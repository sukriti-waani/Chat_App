// Import React hooks for state, side effects, refs, and context
import { useContext, useEffect, useRef, useState } from "react";

// Import toast for showing notifications
import toast from "react-hot-toast";

// Import authentication context (for logged-in user info, online users)
import { AuthContext } from "../../context/AuthContext";

// Import chat context (for messages, selected user, sending messages)
import { ChatContext } from "../../context/ChatContext";

// Import assets (images/icons) and utility function to format timestamps
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

// -------------------- CHAT CONTAINER COMPONENT --------------------
const ChatContainer = () => {
  // ---------------- CONTEXT --------------------
  // Get chat-related data and functions from ChatContext
  const { messages, selectedUser, setSelectedUser, sendMessage, setMessages } =
    useContext(ChatContext);

  // Get auth-related data from AuthContext
  const { authUser, onlineUsers } = useContext(AuthContext);

  // ---------------- STATE & REFS --------------------
  // input: stores the text typed in the chat input box
  const [input, setInput] = useState("");

  // scrollEnd: reference to automatically scroll to bottom of chat
  const scrollEnd = useRef();

  // -------------------- FUNCTIONS --------------------

  // Function to send text messages
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission reload
    if (!input.trim()) return; // Do nothing if input is empty

    // Call sendMessage from ChatContext
    await sendMessage({ text: input.trim() });

    // Clear input box after sending
    setInput("");
  };

  // Function to send image messages
  const handleSendImage = async (e) => {
    const file = e.target.files[0]; // Get the selected file

    // Validate that it is an image
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Convert image to base64 to send
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result }); // Send image message
      e.target.value = ""; // Reset file input
    };
    reader.readAsDataURL(file); // Read file as base64 string
  };

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setMessages(selectedUser._id); // Update messages for selected user
    }
  }, [selectedUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
    }
  }, [messages]);

  // -------------------- JSX / UI --------------------
  // Show placeholder if no user is selected
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo} className="w-[180px] h-[160px]" alt="logo" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* -------------------- HEADER -------------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        {/* Selected user's profile picture */}
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-white"
        />

        {/* Selected user's name and online status */}
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullname}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        {/* Back button for mobile */}
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-7 cursor-pointer"
        />

        {/* Help icon for desktop */}
        <img
          src={assets.help_icon}
          alt="Help"
          className="hidden md:block w-5"
        />
      </div>

      {/* -------------------- CHAT AREA -------------------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {/* Loop through messages */}
        {(Array.isArray(messages) ? messages : []).map((msg, idx) => {
          const isOutgoing = msg.senderId === authUser._id; // Check if message is sent by me

          return (
            <div
              key={msg._id || idx}
              className={`flex items-end gap-2 mb-4 ${
                isOutgoing ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar and timestamp */}
              <div className="text-center text-xs">
                <img
                  src={
                    isOutgoing
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>

              {/* Message content */}
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  alt="Attachment"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                    isOutgoing ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
            </div>
          );
        })}
        {/* Dummy div for auto-scroll */}
        <div ref={scrollEnd}></div>
      </div>

      {/* -------------------- INPUT AREA -------------------- */}
      <div className="absolute bottom-0 left-0 w-full flex items-center gap-3 p-3 bg-transparent">
        {/* Text input and image upload */}
        <div className="flex-1 flex items-center bg-[#1a1a1a] px-3 rounded-full hover:border hover:border-[#026c7a]">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm py-3 border-none outline-none text-white placeholder-gray-400 bg-transparent"
          />

          {/* Hidden file input for image */}
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={assets.gallery_icon}
              alt="Attach"
              className="w-5 opacity-70 hover:opacity-100 transition"
            />
          </label>
        </div>

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          className="bg-[#2e464c] hover:bg-[#074553] rounded-full p-2 flex items-center justify-center"
        >
          <img src={assets.send_button} alt="Send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Export the ChatContainer component for use in other parts of app
export default ChatContainer;
