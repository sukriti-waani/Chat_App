// React utilities
import { createContext, useContext, useEffect, useState } from "react";

// Toast for showing error/success messages
import toast from "react-hot-toast";

// Import authentication context (contains authUser, socket, axios)
import { AuthContext } from "./AuthContext";

// ---------------- CREATE CONTEXT ----------------
export const ChatContext = createContext();

// ---------------- CHAT PROVIDER ----------------
export const ChatProvider = ({ children }) => {
  // ---------------- STATE VARIABLES ----------------
  const [messages, setMessages] = useState([]); // messages for selected chat
  const [users, setUsers] = useState([]); // all chat users
  const [selectedUser, setSelectedUser] = useState(null); // currently opened chat user
  const [unseenMessages, setUnseenMessages] = useState({}); // unseen message count per user

  // ---------------- AUTH & SOCKET ----------------
  const { socket, axios, authUser } = useContext(AuthContext);

  // ---------------- GET USERS ----------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        // Add online status to each user
        const usersWithStatus = (data.users || []).map((user) => ({
          ...user,
          online: user.online || false,
        }));
        setUsers(usersWithStatus);

        // Clean unseen messages (only keep counts > 0)
        const cleanUnseen = {};
        Object.entries(data.unseenMessages || {}).forEach(([userId, count]) => {
          if (count > 0) cleanUnseen[userId] = count;
        });
        setUnseenMessages(cleanUnseen);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- FETCH MESSAGES WHEN OPENING CHAT ----------------
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return; // do nothing if no chat is selected
      try {
        const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
        if (data.success) {
          setMessages(data.messages || []);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchMessages();
  }, [selectedUser, axios]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (messageData) => {
    try {
      if (!selectedUser?._id) {
        toast.error("No user selected!");
        return;
      }

      const payload = {
        ...messageData,
        senderId: authUser._id,
      };

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        payload
      );

      if (data.success) {
        // Update local state immediately for sender
        setMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          if (safePrev.some((m) => m._id === data.newMessage._id))
            return safePrev;
          return [...safePrev, data.newMessage];
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- SOCKET: LISTEN FOR NEW MESSAGE ----------------
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isForSelected =
        selectedUser && newMessage.senderId === selectedUser._id;

      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        // Avoid duplicates
        if (safePrev.some((m) => m._id === newMessage._id)) return safePrev;

        if (isForSelected) {
          // If chat is open, mark seen
          newMessage.seen = true;
          axios.put(`/api/messages/mark/${newMessage._id}`);
          return [...safePrev, newMessage];
        } else {
          // If chat is not open, increment unseen count
          setUnseenMessages((prevUnseen) => ({
            ...prevUnseen,
            [newMessage.senderId]: (prevUnseen[newMessage.senderId] || 0) + 1,
          }));
          return safePrev;
        }
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, axios, selectedUser]);

  // ---------------- OPEN CHAT ----------------
  const openChat = (user) => {
    setSelectedUser(user);

    if (user?._id) {
      setUnseenMessages((prev) => {
        const newUnseen = { ...prev };
        delete newUnseen[user._id]; // reset unseen for this user
        return newUnseen;
      });
    }
  };

  // ---------------- DELETE CHAT ----------------
  const deleteChat = async (userId) => {
    try {
      const { data } = await axios.delete(`/api/messages/${userId}`);
      if (data.success) {
        // If the deleted chat is currently open, clear it
        if (selectedUser && selectedUser._id === userId) {
          setMessages([]);
          setSelectedUser(null);
        }
        toast.success("Chat deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- PROVIDE CONTEXT VALUE ----------------
  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser: openChat, // wrapper resets unseen
    unseenMessages,
    setUnseenMessages,
    getUsers,
    sendMessage,
    deleteChat, // now properly available
    socket,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
