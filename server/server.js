import cors from "cors"; // Enables Cross-Origin Resource Sharing (to allow API requests from other domains)
import "dotenv/config"; // Loads environment variables from .env file into process.env
import express from "express"; // Express framework for building APIs
import http from "http"; // Node's HTTP module (to create server with Express)
import { connectDB } from "./lib/db.js"; // Custom function to connect to MongoDB database
import messageRouter from "./routes/messageRouters.js";
import userRouter from "./routes/userRoutes.js"; // Import user-related routes

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app); // Create an HTTP server using Express app

// Middleware setup
app.use(express.json({ limit: "4mb" })); // Parse incoming JSON requests with body size limit of 4MB
app.use(cors()); // Enable CORS for all routes

// Define routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter); // Mount user routes under /api/auth
app.use("/api/messages", messageRouter);

// Connect to MongoDB database
await connectDB(); // Establish connection to MongoDB before starting server

// Define port and start server
const PORT = process.env.PORT || 5000; // Get port from environment or fallback to 5000
server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
// Start HTTP server and log the running port
