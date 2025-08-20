import express from "express";

import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

import { protectRoute } from "../middleware/auth.js";

// Create a new Express Router instance for message-related routes
const messageRouter = express.Router();

// Route to fetch all users for the sidebar (only accessible if user is authenticated)
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Route to get all messages with a specific user (id = userId passed in URL)
messageRouter.get("/:id", protectRoute, getMessages);

// Route to mark a specific message as "seen" (id = messageId passed in URL)
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

messageRouter.post("/send/:id", protectRoute, sendMessage);

// Export the router so it can be used in the main server file (app.js / index.js)
export default messageRouter;
