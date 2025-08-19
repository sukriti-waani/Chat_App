import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// Controller: Get all users for sidebar (except the logged-in user)
// Also count unseen messages from each user
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get logged-in user's ID from req.user (set by auth middleware)
    const userId = req.user._id;

    // Fetch all users except the logged-in one, exclude password field
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Object to store unseen messages count for each user
    const unseenMessages = {};

    // For each user, fetch unseen messages they sent to logged-in user
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id, // Messages sent by this user
        receiverId: userId, // To the logged-in user
        seen: false, // That are still unseen
      });

      // If user has unseen messages, store the count
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    // Run all async DB queries in parallel and wait for completion
    await Promise.all(promises);

    // Send back user list and unseen messages info
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    // Log error and send failure response
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller: Get all messages between logged-in user and a selected user
export const getMessages = async (req, res) => {
  try {
    // Extract selected user ID from request parameters
    // Example: /api/messages/:id  →  req.params.id
    const { id: selectedUserId } = req.params;

    // Get logged-in user's ID (added to req.user by auth middleware)
    const myId = req.user._id;

    // Fetch all messages exchanged between logged-in user and selected user
    // $or ensures we get both directions:
    // 1) my messages to them, 2) their messages to me
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId }, // I sent them
        { senderId: selectedUserId, receiverId: myId }, // They sent me
      ],
    });

    // Mark all messages from selected user to me as "seen"
    // updateMany → updates all matching messages
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId }, // Only messages they sent to me
      { seen: true } // Set seen = true
    );

    // Send success response with all messages
    res.json({ success: true, messages });
  } catch (error) {
    // If error occurs, log error message in console
    console.log(error.message);

    // Send failure response with error message
    res.json({ success: false, message: error.message });
  }
};

// API: Mark a specific message as seen using its message ID
export const markMessageAsSeen = async (req, res) => {
  try {
    // Extract message ID from request parameters
    // Example: /api/messages/mark-seen/:id → req.params.id
    const { id } = req.params;

    // Find the message by its ID and update its "seen" field to true
    await Message.findByIdAndUpdate(id, { seen: true });

    // Send success response back to client
    res.json({ success: true });
  } catch (error) {
    // If an error occurs, log it to the server console
    console.log(error.message);

    // Send failure response with error message
    res.json({ success: false, message: error.message });
  }
};

// Controller function to send a message to the selected user
export const sendMessage = async (req, res) => {
  try {
    // Extract text and image from the request body (message content sent by frontend)
    const { text, image } = req.body;

    // Get the receiver's ID from the URL parameter (example: /messages/send/:id)
    const receiverId = req.params.id;

    // Get the sender's ID from the logged-in user (set by protectRoute middleware)
    const senderId = req.user._id;

    // Variable to hold image URL (if an image is provided by sender)
    let imageUrl;

    // If the user attached an image, upload it to Cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      // Store the secure URL returned from Cloudinary
      imageUrl = uploadResponse.secure_url;
    }

    // Create a new message document in the database with sender, receiver, text, and optional image
    const newMessage = await Message.create({
      senderId, // Who sent the message
      receiverId, // Who should receive the message
      text, // The text content
      image: imageUrl, // Image link if provided, otherwise undefined
    });

    // Find the receiver's socket ID (from userSocketMap which stores online users)
    const receiverSocketId = userSocketMap[receiverId];

    // If the receiver is online, send (emit) the new message to their socket in real-time
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Send success response back to the sender with the newly created message
    res.json({ success: true, newMessage });
  } catch (error) {
    // If something goes wrong, log the error in server console
    console.log(error.message);

    // Send failure response to the client with error details
    res.json({ success: false, message: error.message });
  }
};
