import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  return (
    <div>
      <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
        <div className="backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative">
          <Sidebar />
          <ChatContainer />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
