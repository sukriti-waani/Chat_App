// Import React utilities
import { createContext, useContext, useState } from "react";

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
  const [messages, setMessages] = useState([]);

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

  // Create a value object that holds all states and functions
  // This will be accessible anywhere inside ChatContext
  const value = {
    messages, // chat messages
    setMessages,
    users, // list of users
    setUsers,
    selectedUser, // active chat user
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers, // function to fetch users
    socket, // expose socket for real-time chat
  };

  // Return the Provider component
  // It shares `value` with all children wrapped inside ChatProvider
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
