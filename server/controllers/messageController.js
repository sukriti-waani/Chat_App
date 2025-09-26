import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// ---------------- GET USERS FOR SIDEBAR ----------------
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id; // current logged-in user

    // Fetch all users except the logged-in one
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Prepare unseen messages count
    const unseenMessages = {};

    // For each user, count unseen messages sent to me
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      unseenMessages[user._id] = messages.length || 0;
    });

    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- GET MESSAGES ----------------
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params; // chat partner ID
    const myId = req.user._id; // logged-in user ID

    // Fetch all messages between me and selected user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // sort by time

    // Mark as seen: messages they sent to me
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- MARK MESSAGE AS SEEN ----------------
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params; // message ID
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );
    res.json({ success: true, message: updatedMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- SEND MESSAGE ----------------
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // message content
    const receiverId = req.params.id; // receiver from URL
    const senderId = req.user._id; // sender = logged-in user

    // Upload image if provided
    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Save message in DB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl || null,
    });

    // Get receiver’s socket (if online)
    const receiverSocketId = userSocketMap[receiverId];

    // Push new message to receiver instantly
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Also return new message to sender
    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- DELETE CHAT ----------------
export const deleteChat = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params; // chat partner
    const myId = req.user._id; // logged-in user

    // Delete all messages where (me ↔ selectedUser)
    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
