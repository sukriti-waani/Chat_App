// Import React utilities for state management, context sharing, and side effects
import { createContext, useContext, useEffect, useState } from "react";

// Import toast library to show notification messages (like errors)
import toast from "react-hot-toast";

// Import AuthContext to get authentication info, axios, and socket
import { AuthContext } from "./AuthContext";

// ---------------- CREATE CONTEXT ----------------
// Creating a new context called ChatContext that will be used to share chat state globally
export const ChatContext = createContext();

// ---------------- CHAT PROVIDER ----------------
// The provider component wraps the app/components that need access to chat data
export const ChatProvider = ({ children }) => {
  // ---------------- STATE VARIABLES ----------------

  // messages: stores the list of chat messages for the currently selected user
  const [messages, setMessages] = useState([]);

  // users: stores the list of all users who can chat
  const [users, setUsers] = useState([]);

  // selectedUser: stores the user object for whom the chat is currently open
  const [selectedUser, setSelectedUser] = useState(null);

  // unseenMessages: stores the count of unread messages per user
  // Example: { userId1: 2, userId2: 5 }
  const [unseenMessages, setUnseenMessages] = useState({});

  // ---------------- AUTH & SOCKET ----------------

  // Get socket, axios instance, and logged-in user from AuthContext
  const { socket, axios, authUser } = useContext(AuthContext);

  // ---------------- GET USERS ----------------
  // Fetch list of users from the backend API
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users"); // GET request to fetch users

      if (data.success) {
        // Map users and add an 'online' property (default to false if not provided)
        const usersWithStatus = (data.users || []).map((user) => ({
          ...user,
          online: user.online || false,
        }));

        setUsers(usersWithStatus); // Update users state
        setUnseenMessages(data.unseenMessages || {}); // Update unseen messages state
      }
    } catch (error) {
      toast.error(error.message); // Show error if API call fails
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (messageData) => {
    try {
      // If no user is selected, prevent sending
      if (!selectedUser?._id) {
        toast.error("No user selected!");
        return;
      }

      // Add senderId to the message payload
      const payload = {
        ...messageData,
        senderId: authUser._id,
      };

      // Send message to backend API
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        payload
      );

      if (data.success) {
        // Update local messages state
        setMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : []; // Ensure prev is an array
          if (safePrev.some((m) => m._id === data.newMessage._id))
            return safePrev; // Prevent duplicate
          return [...safePrev, data.newMessage]; // Add new message
        });

        // Emit message through socket for real-time delivery
        if (socket) socket.emit("sendMessage", data.newMessage);
      } else {
        toast.error(data.message); // Show error from backend if any
      }
    } catch (error) {
      toast.error(error.message); // Show network/API errors
    }
  };

  // ---------------- SOCKET: LISTEN FOR NEW MESSAGE ----------------
  useEffect(() => {
    if (!socket) return;

    // Function to handle receiving a new message
    const handleNewMessage = (newMessage) => {
      // Check if the message is for the currently selected user
      const isForSelected =
        selectedUser && newMessage.senderId === selectedUser._id;

      if (isForSelected) {
        // Mark message as seen
        newMessage.seen = true;

        setMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          if (safePrev.some((m) => m._id === newMessage._id)) return safePrev; // Prevent duplicates
          return [...safePrev, newMessage]; // Add new message to chat
        });

        // Mark message as seen in backend
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // If message is from another user, increment unseen message count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    // Listen for 'newMessage' event from socket
    socket.on("newMessage", handleNewMessage);

    // Clean up listener when component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
    // selectedUser is dynamically checked inside the handler
  }, [socket, axios, selectedUser]);

  // ---------------- SOCKET: ONLINE/OFFLINE STATUS ----------------
  // (This second effect is redundant for 'newMessage', but may be used for status updates)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isForSelected =
        selectedUser && newMessage.senderId === selectedUser._id;

      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        // Prevent duplicate messages
        if (safePrev.some((m) => m._id === newMessage._id)) return safePrev;

        if (isForSelected) {
          newMessage.seen = true;
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
          setUnseenMessages((prevUnseen) => ({
            ...prevUnseen,
            [newMessage.senderId]: prevUnseen[newMessage.senderId]
              ? prevUnseen[newMessage.senderId] + 1
              : 1,
          }));
        }

        return [...safePrev, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, axios]);

  // ---------------- PROVIDE CONTEXT VALUE ----------------
  // All state and functions that need to be shared globally
  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    sendMessage,
    socket,
  };

  // Provide the ChatContext to children components
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
