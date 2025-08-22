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
  const [onlineUsers, setOnlineUsers] = useState([]);

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

  // Login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      // Send a POST request to the backend API for authentication
      // Example: /api/auth/login or /api/auth/register depending on 'state'
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      // If backend response has "success = true"
      if (data.success) {
        // Save authenticated user data into React state (so app knows who is logged in)
        setAuthUser(data.userData);

        // Establish a socket connection for real-time features (e.g., chat, notifications)
        connectSocket(data.userData);

        // Set default header in axios for future requests (adds token automatically)
        axios.defaults.headers.common["token"] = data.token;

        // Save token in React state (to manage authentication locally)
        setToken(data.token);

        // Save token in browser localStorage (so user stays logged in even after refresh)
        localStorage.setItem("token", data.token);

        // Show a success message (e.g., "Login successful")
        toast.success(data.message);
      } else {
        // If success is false → show error message (probably login failed)
        toast.error(error.message);
      }
    } catch (error) {
      // Catch any error (like server error, network failure) and show as a toast
      toast.error(error.message);
    }
  };

  // Logout function to handle user logout and socket disconnection
  const logout = async () => {
    // Remove authentication token from local storage (so user won’t stay logged in after refresh)
    localStorage.removeItem("token");

    // Clear token from app state
    setToken(null);

    // Clear authenticated user details from app state
    setAuthUser(null);

    // Reset the list of online users to an empty array
    setOnlineUsers([]);

    // Remove token from axios default headers (future API calls won’t be authenticated)
    axios.defaults.headers.common["token"] = null;

    // Show success message that user logged out
    toast.success("Logged out successfully");

    // Disconnect the user from the socket (so they are no longer online in real-time)
    socket.disconnect();
  };

  // Update profile function to handle user profile updates
  const updateProfile = async (body) => {
    try {
      // Send a PUT request to the server with the updated profile data (body)
      const { data } = await axios.put("/api/auth/update-profile", body);

      // If the server responds with success = true
      if (data.success) {
        // Update the current authenticated user state with the new user data
        setAuthUser(data.user);

        // Show a success notification to the user
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      // If any error occurs (e.g., network error, server error), show it as a toast
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
      setOnlineUsers(userIds);
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
    login,
    logout,
    updateProfile,
  };

  // Provide the above values to all children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
