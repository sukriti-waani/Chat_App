import express from "express";
import {
  deleteChat,
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

// ---------------- ROUTES ----------------

// Fetch all users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get all messages with a specific user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark a specific message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send a new message
messageRouter.post("/send/:id", protectRoute, sendMessage);

// Delete chat with a specific user
messageRouter.delete("/:id", protectRoute, deleteChat);

export default messageRouter;
