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

// Helper utilities to compute a friendly display name
const capitalize = (s) =>
  typeof s === "string" && s.length
    ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    : s;

const extractNameFromEmail = (email) => {
  if (!email || typeof email !== "string") return null;
  const local = email.split("@")[0];
  const parts = local.split(/[._\-+]+/).filter(Boolean);
  if (parts.length === 0) return null;
  return parts.map((p) => capitalize(p.replace(/\d+/g, ""))).join(" ");
};

const getDisplayName = (user) => {
  if (!user || typeof user !== "object") return "Unknown User";

  const fullCandidates = [
    user.fullname,
    user.fullName,
    user.full_name,
    user.displayName,
    user.display_name,
    user.name,
    user.username,
    user.userName,
  ];
  for (const n of fullCandidates) {
    if (n && typeof n === "string" && n.trim()) return n.trim();
  }

  const firstCandidates = [
    user.firstName,
    user.first_name,
    user.firstname,
    user.givenName,
    user.given_name,
  ];
  const lastCandidates = [
    user.lastName,
    user.last_name,
    user.lastname,
    user.surname,
    user.familyName,
    user.family_name,
  ];
  const first = firstCandidates.find((v) => v && v.trim());
  const last = lastCandidates.find((v) => v && v.trim());
  if (first) {
    return `${capitalize(first)}${last ? " " + capitalize(last) : ""}`;
  }

  const nested = user.profile || user.details || user.meta || user.user || {};
  const firstN =
    nested.firstName ||
    nested.first_name ||
    nested.firstname ||
    nested.givenName ||
    nested.given_name;
  const lastN =
    nested.lastName ||
    nested.last_name ||
    nested.lastname ||
    nested.surname ||
    nested.familyName;
  if (firstN) {
    return `${capitalize(firstN)}${lastN ? " " + capitalize(lastN) : ""}`;
  }

  if (user.email && typeof user.email === "string") {
    const derived = extractNameFromEmail(user.email);
    if (derived) return derived;
    return user.email;
  }

  return "Unknown User";
};

// -------------------- CHAT CONTAINER COMPONENT --------------------
const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, setMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const scrollEnd = useRef();

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo} className="w-[180px] h-[160px]" alt="logo" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  const displayName = getDisplayName(selectedUser);

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* -------------------- HEADER -------------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-white"
        />

        <p className="text-lg text-white flex items-center gap-2 truncate">
          {displayName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </p>

        {/* Help icon restored to the right side */}
        <img
          src={assets.help_icon}
          alt="Help"
          className="hidden md:block w-5 ml-auto"
        />

        {/* Back button for mobile */}
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-7 cursor-pointer"
        />
      </div>

      {/* -------------------- CHAT AREA -------------------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {(Array.isArray(messages) ? messages : []).map((msg, idx) => {
          const isOutgoing = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id || idx}
              className={`flex items-end gap-2 mb-4 ${
                isOutgoing ? "flex-row-reverse" : "flex-row"
              }`}
            >
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
        <div ref={scrollEnd} />
      </div>

      {/* -------------------- INPUT AREA -------------------- */}
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
  );
};

export default ChatContainer;
