import assets, { messagesDummyData } from "../assets/assets";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const currentUserId = "680f50aaf10f3cd28382ecf2"; // logged-in user ID

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ------ header ------ */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-white"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullname}
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
        {messagesDummyData.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUserId;
          const avatarSrc = isCurrentUser
            ? assets.avatar_icon // logged-in user avatar
            : msg.senderProfilePic ||
              selectedUser.profilePic ||
              assets.avatar_icon;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  alt="Message Attachment"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                    isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {/* Avatar and time */}
              <div className="text-center text-xs">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
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
