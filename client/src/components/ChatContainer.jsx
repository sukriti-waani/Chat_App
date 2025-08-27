import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  // Extract chat-related data and functions from context
  const { messages, selectedUser, setSelectedUser, sendMessage } =
    useContext(ChatContext);

  // Extract auth-related data from context
  const { authUser, onlineUsers } = useContext(AuthContext);

  // Ref for auto-scroll to latest message
  const scrollEnd = useRef();

  // State for input text
  const [input, setInput] = useState("");

  // -------------------- Functions --------------------

  // Handle sending a text message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending an image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
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

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Receiver details (if user is selected)
  const receiverAvatar = selectedUser?.profilePic || assets.avatar_icon;
  const receiverName = selectedUser?.fullname || "Receiver";

  // Dummy conversation data (for testing UI)
  const conversationData = messagesDummyData.map((msg, index) => {
    const isReceiver = index % 2 === 0;
    return {
      ...msg,
      avatar: isReceiver ? receiverAvatar : assets.avatar_icon,
      isReceiver,
    };
  });

  // -------------------- JSX --------------------
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ------ header ------ */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={receiverAvatar}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-white"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {receiverName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
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

      {/* ----- Chat Area ------ */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {conversationData.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 mb-4 ${
              msg.isReceiver ? "justify-start" : "justify-end"
            }`}
          >
            {/* Receiver message with avatar on left */}
            {msg.isReceiver && (
              <div className="text-center text-xs">
                <img
                  src={msg.avatar}
                  alt="Profile"
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {/* Message content (image or text) */}
            {msg.image ? (
              <img
                src={msg.image}
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                alt="Message Attachment"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all ${
                  msg.isReceiver
                    ? "bg-violet-500/30 text-white rounded-bl-none"
                    : "bg-blue-500/30 text-white rounded-br-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            {/* Sender message with avatar on right */}
            {!msg.isReceiver && (
              <div className="text-center text-xs">
                <img
                  src={msg.avatar}
                  alt="Profile"
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Always scroll to end of chat */}
        <div ref={scrollEnd}></div>
      </div>

      {/* ------- bottom area ------- */}
      <div className="absolute bottom-0 left-0 w-full flex items-center gap-3 p-3 bg-transparent">
        {/* Input field + attach button */}
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

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          className="bg-[#2e464c] hover:bg-[#074553] rounded-full p-2 flex items-center justify-center "
        >
          <img src={assets.send_button} alt="Send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  ) : (
    // If no user selected → show placeholder
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo} className="w-[180px] h-[160px]" alt="logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
