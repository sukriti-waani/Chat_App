import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  // Extract chat-related data and functions from context
  // NOTE: Renamed getMessages to setMessages in your ChatContext for clarity
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  // Extract auth-related data from context
  const { authUser, onlineUsers } = useContext(AuthContext);

  // Ref for auto-scroll to latest message
  const scrollEnd = useRef();

  // State for input text
  const [input, setInput] = useState("");

  // Handle sending a text message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUser?._id) return; // Prevent sending if no user selected
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending an image message
  const handleSendImage = async (e) => {
    if (!selectedUser?._id) return;
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      // toast import assumed available
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = ""; // reset input
    };
    reader.readAsDataURL(file);
  };

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Receiver details (if user is selected)
  const receiverAvatar = selectedUser?.profilePic || assets.avatar_icon;
  const receiverName = selectedUser?.fullname || "Receiver";

  // Render
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={receiverAvatar}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-white"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {receiverName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="hidden md:block w-5"
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {(Array.isArray(messages) ? messages : []).map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 mb-4 ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar and timestamp */}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : receiverAvatar
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
                alt="Message Attachment"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
          </div>
        ))}
        {/* Always scroll to end */}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom input area */}
      <div className="absolute bottom-0 left-0 w-full flex items-center gap-3 p-3 bg-transparent">
        <div className="flex-1 flex items-center bg-[#1a1a1a] px-3 rounded-full hover:border hover:border-[#026c7a]">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm py-3 border-none outline-none text-white placeholder-gray-400 bg-transparent"
          />
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

        <button
          onClick={handleSendMessage}
          className="bg-[#2e464c] hover:bg-[#074553] rounded-full p-2 flex items-center justify-center"
        >
          <img src={assets.send_button} alt="Send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo} className="w-[180px] h-[160px]" alt="logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
