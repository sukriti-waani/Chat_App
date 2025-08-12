import assets, { imagesDummyData } from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
  if (!selectedUser) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full h-full max-md:hidden p-6 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-4 text-xs font-light mx-auto max-w-xs">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="User Avatar"
          className="w-20 aspect-square rounded-full object-cover"
        />
        <h1 className="text-xl font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {selectedUser.fullname}
        </h1>
        <p className="text-center">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-6" />

      {/* Media Section */}
      <div className="px-2 text-xs flex-1 overflow-y-auto">
        <p className="font-medium mb-2">Media</p>
        <div className="grid grid-cols-2 gap-3 opacity-80 rounded-md p-1">
          {imagesDummyData.slice(0, 4).map(
            (
              url,
              index // limiting count to make it look smaller
            ) => (
              <div
                key={index}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer rounded overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Logout Button - fixed outside scroll */}
      <div className="mt-4">
        <button
          className="w-full bg-gradient-to-r from-[#02d1ff] to-[#021e24] hover:from-[#021e24] hover:to-[#082d35] 
                     text-white text-sm font-light py-2 px-6 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
