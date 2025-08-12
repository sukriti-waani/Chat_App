import { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const receiverAvatar = selectedUser?.profilePic || assets.avatar_icon;
  const receiverName = selectedUser?.fullname || "Receiver";

  const conversationData = messagesDummyData.map((msg, index) => {
    const isReceiver = index % 2 === 0;
    return {
      ...msg,
      avatar: isReceiver ? receiverAvatar : assets.avatar_icon,
      isReceiver,
    };
  });

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

        <div ref={scrollEnd}></div>
      </div>

      {/* ------- bottom area ------- */}
      {/* ------- bottom area ------- */}
      <div className="absolute bottom-0 left-0 w-full flex items-center gap-3 p-3 bg-transparent">
        <div className="flex-1 flex items-center bg-[#1a1a1a] px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm py-3 border-none outline-none text-white placeholder-gray-400 bg-transparent"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={assets.gallery_icon}
              alt="Attach"
              className="w-5 opacity-70 hover:opacity-100 transition"
            />
          </label>
        </div>
        <button className="bg-[#082d35] hover:bg-[#021e24] rounded-full p-2 flex items-center justify-center ">
          <img src={assets.send_button} alt="Send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo} className="max-w-16" alt="logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
