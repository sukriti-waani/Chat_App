import mongoose from "mongoose"; // Import mongoose library for MongoDB object modeling

// Define schema (structure) for messages
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Stores MongoDB ObjectId of sender
      ref: "User", // Refers to User model (relation)
      required: true, // Sender is mandatory
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // Stores ObjectId of receiver
      ref: "User", // Refers to User model
      required: true, // Receiver is mandatory
    },
    text: { type: String }, // Message text (optional)
    image: { type: String }, // Message image URL (optional)
    seen: { type: Boolean, default: false }, // Tracks if message is seen
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
