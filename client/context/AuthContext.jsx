// Import necessary libraries and hooks
import axios from "axios"; // Axios for HTTP requests
import { createContext, useEffect, useState } from "react"; // React hooks
import toast from "react-hot-toast"; // For showing notifications
import { io } from "socket.io-client"; // For real-time socket connections

// Get backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Set axios default base URL to backend URL so all requests go to backend
axios.defaults.baseURL = backendUrl;

// Create a new Context for authentication
export const AuthContext = createContext();

// Create a provider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  // State to store JWT token from localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));

  // State to store authenticated user data
  const [authUser, setAuthUser] = useState(null);

  // State to store online users received from socket server
  const [onlineUsers, setOnlineUSers] = useState([]);

  // State to store socket connection instance
  const [socket, setSocket] = useState(null);

  // Function to check if user is authenticated
  const checkAuth = async () => {
    try {
      // Send GET request to backend to verify authentication
      const { data } = await axios.get("/api/auth/check");

      // If authentication is successful
      if (data.success) {
        setAuthUser(data.user); // Store user data in state
        connectSocket(data.user); // Connect the user to socket server
      }
    } catch (error) {
      // Show error toast if request fails
      toast.error(error.message);
    }
  };

  // Function to connect socket for real-time updates
  const connectSocket = (userData) => {
    // If no user data or socket is already connected, return
    if (!userData || socket?.connected) return;

    // Create a new socket instance and pass userId as query
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id, // Send user ID to backend
      },
    });

    // Connect the socket
    newSocket.connect();

    // Update the state with new socket instance
    setSocket(newSocket);

    // Listen to 'getOnlineUsers' event from backend
    // Whenever server sends online user IDs, update state
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUSers(userIds);
    });
  };

  // useEffect runs once on component mount
  useEffect(() => {
    // If token exists, set default header for axios
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    // Check if user is authenticated
    checkAuth();
  }, []); // Empty dependency array means it runs only once

  // Value to provide to all children components consuming this context
  const value = {
    axios, // Axios instance with default base URL and token
    authUser, // Authenticated user data
    onlineUsers, // List of online users
    socket, // Socket instance
  };

  // Provide the above values to all children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
