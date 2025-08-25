import { AnimatePresence, motion } from "framer-motion"; // Animation for user list entries
import { useContext, useEffect, useState } from "react"; // React hooks for state and context
import { useNavigate } from "react-router-dom"; // Navigation hook for routing
import { AuthContext } from "../../context/AuthContext"; // Auth context for auth state and logout
import { ChatContext } from "../../context/ChatContext"; // Chat context for users, messages, etc.
import assets from "../assets/assets"; // Image assets like logo, icons

const Sidebar = () => {
  // Destructure necessary state and functions from ChatContext
  const {
    getUsers, // Function to fetch users list
    users, // Array of user objects
    selectedUser, // Currently selected user object
    setSelectedUser, // Setter to update selected user
    unseenMessages, // Object mapping user IDs to counts of unseen messages
    setUnseenMessages, // Setter to update unseen messages count
  } = useContext(ChatContext);

  // Destructure logout function and onlineUsers array from AuthContext
  // logout handles clearing user session/authentication
  // onlineUsers is an array of user IDs currently online
  const { logout, onlineUsers } = useContext(AuthContext);

  // State to hold the search input text; initialized as an empty string
  const [input, setInput] = useState("");

  // React Router's navigate function for programmatic navigation
  const navigate = useNavigate();

  // Filter users based on input string, matching fullName ignoring case
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // useEffect to refetch users when the onlineUsers array changes
  useEffect(() => {
    getUsers(); // Refresh user list based on current online status
  }, [onlineUsers]);

  return (
    // Outer container with conditional class hiding on medium screens if a user is selected
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header section */}
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
            {/* Dropdown menu shown on hover */}
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")} // Navigate to profile page
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="g-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5 bg-[#1a1a1a] hover:border hover:border-[#026c7a]">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)} // Update input state on typing
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User list with animation on add/remove */}
      <div className="flex flex-col">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id} // Unique key for React rendering
              onClick={() => setSelectedUser(user)} // Set selected user on click
              initial={{ opacity: 0, x: -15 }} // Animation initial state
              animate={{ opacity: 1, x: 0 }} // Animation animate state
              exit={{ opacity: 0, x: 15 }} // Animation exit state
              transition={{ duration: 0.25, ease: "easeOut" }} // Animation timing
              whileHover={{
                scale: 1.02, // Scale up on hover
                backgroundColor: "rgba(2,108,122,0.2)", // Background color on hover
              }}
              whileTap={{ scale: 0.98 }} // Scale down on tap
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id ? "bg-[#033a46]/40" : ""
              }`} // Highlight if selected
            >
              {/* User avatar */}
              <img
                src={user?.profilePic || assets.avatar_icon} // Show avatar or fallback icon
                alt="avatar"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p> {/* Display user full name */}
                <span
                  className={`text-xs ${
                    onlineUsers.includes(user._id)
                      ? "text-teal-700"
                      : "text-neutral-400"
                  }`}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}{" "}
                  {/* Online status */}
                </span>
              </div>
              {/* Show count of unseen messages if any */}
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
