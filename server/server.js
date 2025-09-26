import cors from "cors"; // Enables Cross-Origin Resource Sharing (to allow API requests from other domains)
import "dotenv/config"; // Loads environment variables from .env file into process.env
import express from "express"; // Express framework for building APIs
import http from "http"; // Node's HTTP module (to create server with Express)
import { connectDB } from "./lib/db.js"; // Custom function to connect to MongoDB database
import messageRouter from "./routes/messageRouters.js";
import userRouter from "./routes/userRoutes.js"; // Import user-related routes

import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app); // Create an HTTP server using Express app

// Initialize socket.io server with the http server instance
export const io = new Server(server, {
  // Allow connections from any frontend (CORS enabled for all origins)
  cors: { origin: "*" },
});

// Store online users in an object
// Format: { userId: socketId }
export const userSocketMap = {};

// Socket.io connection handler -> runs when a client connects
io.on("connection", (socket) => {
  // Get the userId passed by the client when connecting
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  // If userId exists, store mapping of userId to the connected socket.id
  if (userId) userSocketMap[userId] = socket.id;

  // Send the list of currently online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection event
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);

    // Remove user from online users map when they disconnect
    delete userSocketMap[userId];

    // Update all clients with the new list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" })); // Parse incoming JSON requests with body size limit of 4MB
app.use(cors()); // Enable CORS for all routes

// Define routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter); // Mount user routes under /api/auth
app.use("/api/messages", messageRouter);

// Connect to MongoDB database
await connectDB(); // Establish connection to MongoDB before starting server

if (process.env.NODE_ENV !== "production") {
  // Define port and start server
  const PORT = process.env.PORT || 5000; // Get port from environment or fallback to 5000
  server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
}

// Export server for Vercel
export default server;
