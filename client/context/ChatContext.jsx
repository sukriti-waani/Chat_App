// Import React utilities
import { createContext, useContext, useEffect, useState } from "react";

// Import AuthContext to reuse authentication-related data (axios, socket)
import { AuthContext } from "./AuthContext";

// Import toast for showing error notifications
import toast from "react-hot-toast";

// Create a ChatContext that will hold chat-related state and functions
export const ChatContext = createContext();

// Define the ChatProvider component, which wraps children components
// and provides chat-related context values
export const ChatProvider = ({ children }) => {
  // Store all chat messages for the currently active conversation
  const [messages, getMessages] = useState([]);

  // Store list of all users who can chat (shown in sidebar or list)
  const [users, setUsers] = useState([]);

  // Track which user is currently selected for chatting
  const [selectedUser, setSelectedUser] = useState(null);

  // Track unseen/unread messages (for showing badges/notifications)
  const [unseenMessages, setUnseenMessages] = useState([]);

  // Get socket (real-time connection) and axios (API calls) from AuthContext
  const { socket, axios } = useContext(AuthContext);

  // Function to fetch all users + unseen messages from backend
  const getUsers = async () => {
    try {
      // Make GET request to backend API
      const { data } = await axios.get("/api/messages/users");

      // If backend responds with success, update users and unseen messages
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      // Show error notification if API call fails
      toast.error(error.message);
    }
  };

  // function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      // Make an HTTP POST request to backend API to send message to the selected user
      // "selectedUser._id" is the recipient's ID
      // "messageData" contains the message content (like text, timestamp, etc.)
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      // If backend confirms message was successfully sent
      if (data.success) {
        // Add the newly sent message to local state 'messages'
        // (prevMessages = previous messages, then append new one at end)
        getMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        // If backend responded with failure, show error toast
        toast.error(data.message);
      }
    } catch (error) {
      // If network error / server error occurs, show the error message
      toast.error(error.message);
    }
  };

  // function to subscribe to messages for selected user
  const subscribeToMessages = async () => {
    // If socket connection is not available, just exit
    if (!socket) return;

    // Listen for "newMessage" event coming from socket server
    socket.on("newMessage", (newMessage) => {
      // Case 1: If a user is selected in chat AND
      // the incoming message is from that selected user
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Mark this message as seen immediately
        newMessage.seen = true;

        // Add it to the 'messages' state (append to existing conversation)
        getMessages((prevMessages) => [...prevMessages, newMessage]);

        // Update backend to mark this message as "seen" in DB
        axios.put(`/api/messages/mark/${newMessage._id}`);
      }
      // Case 2: If message is from some other user (not the one currently selected)
      else {
        // Update unseen messages count for that sender
        // If already has unseen count, increment it by 1
        // Otherwise, initialize with 1
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // Function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    // If socket connection exists, remove the "newMessage" event listener
    // This prevents duplicate listeners when component re-renders or unmounts
    if (socket) socket.off("newMessage");
  };

  // React hook that runs side effects when 'socket' or 'selectedUser' changes
  useEffect(() => {
    // Subscribe to incoming messages when socket or selected user changes
    subscribeToMessages();

    // Cleanup function: unsubscribe when component unmounts
    // OR before re-running the effect (to avoid memory leaks / multiple listeners)
    return () => unsubscribeFromMessages();

    // Dependencies: effect re-runs whenever 'socket' or 'selectedUser' changes
  }, [socket, selectedUser]);

  // Create a value object that holds all states and functions
  // This will be accessible anywhere inside ChatContext
  const value = {
    messages, // chat messages
    getMessages,
    users, // list of users
    setUsers,
    selectedUser, // active chat user
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers, // function to fetch users
    socket, // expose socket for real-time chat
    sendMessage,
  };

  // Return the Provider component
  // It shares `value` with all children wrapped inside ChatProvider
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
