import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import assets, { userDummyData } from "../assets/assets";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <img src={assets.logo} alt="logo" className="w-12 h-10" />
            <span className="text-lg font-semibold">Chatio</span>
          </div>

          {/* Menu */}
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="g-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5 bg-[#1a1a1a] hover:border hover:border-[#026c7a]">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User List with Animation */}
      <div className="flex flex-col">
        <AnimatePresence>
          {userDummyData.map((user, index) => (
            <motion.div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(2,108,122,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id ? "bg-[#033a46]/40" : ""
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="avatar"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullname}</p>
                <span
                  className={`text-xs ${
                    index < 3 ? "text-green-400" : "text-neutral-400"
                  }`}
                >
                  {index < 3 ? "Online" : "Offline"}
                </span>
              </div>
              {index > 2 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-teal-500/50">
                  {index}
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
