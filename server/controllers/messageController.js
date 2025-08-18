import Message from "../models/Message.js";
import User from "../models/User.js";

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
