import { AnimatePresence, motion } from "framer-motion"; // For smooth animations
import { useContext, useEffect, useState } from "react"; // React hooks
import { useNavigate } from "react-router-dom"; // For navigation
import { AuthContext } from "../../context/AuthContext"; // Authentication context
import { ChatContext } from "../../context/ChatContext"; // Chat data context
import assets from "../assets/assets"; // Image and icon assets

const Sidebar = () => {
  // Destructure values from ChatContext
  const {
    getUsers, // Function to fetch users
    users, // All users
    selectedUser, // Current selected user
    setSelectedUser, // Setter for selected user
    unseenMessages, // Object storing unseen message count per user
    setUnseenMessages, // Setter for unseen messages
  } = useContext(ChatContext);

  // Destructure from AuthContext
  const { logout, onlineUsers } = useContext(AuthContext);

  // Local state for search input
  const [input, setInput] = useState("");

  // React Router hook for navigation
  const navigate = useNavigate();

  // Filter users based on search input
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // Re-fetch users whenever onlineUsers changes
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    // Sidebar container
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* -------- Header Section -------- */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <div className="flex items-center gap-1">
            <img src={assets.logo} alt="logo" className="w-12 h-10" />
            <span className="text-lg font-semibold">Chatio</span>
          </div>

          {/* Menu dropdown */}
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              {/* Navigate to profile */}
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              {/* Logout */}
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* -------- Search bar -------- */}
        <div className="bg-[#1a1a1a] rounded-full flex items-center gap-2 py-3 px-4 mt-5 hover:border hover:border-[#026c7a]">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* -------- User List -------- */}
      <div className="flex flex-col">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              // On click -> set selected user + reset unseen messages for that user
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({
                  ...prev,
                  [user._id]: 0, // Reset unseen count for this user
                }));
              }}
              // Animation states
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(2,108,122,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              // Highlight selected user
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id ? "bg-[#033a46]/40" : ""
              }`}
            >
              {/* User avatar */}
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="avatar"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              {/* User details */}
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                <span
                  className={`text-xs ${
                    onlineUsers.includes(user._id)
                      ? "text-teal-700"
                      : "text-neutral-400"
                  }`}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </span>
              </div>

              {/* Show unseen message count if > 0 */}
              {unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-teal-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
