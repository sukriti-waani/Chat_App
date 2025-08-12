import bg from "./bg.jpg";
import logo1 from "./logo.png";

import pic1 from "./pic1.jpg";
import pic2 from "./pic2.webp";
import pic3 from "./pic3.webp";
import pic4 from "./pic4.jpg";
import pic5 from "./pic5.jpg";
import pic6 from "./pic6.webp";
import pic7 from "./pic7.jpg";
import pic8 from "./pic8.avif";

import arrow_icon from "./arrow_icon.png";
import avatar_icon from "./avatar_icon.png";
import gallery_icon from "./gallery_icon.png";
import help_icon from "./help_icon.png";
import menu_icon from "./menu_icon.png";
import search_icon from "./search_icon.png";
import send_button from "./send_button.png";

const assets = {
  bgImage: bg,
  logo: logo1,
  menu_icon,
  search_icon,
  avatar_icon,
  pic1,
  pic2,
  pic3,
  pic4,
  pic5,
  pic6,
  pic7,
  pic8,
  help_icon,
  arrow_icon,
  gallery_icon,
  send_button,
};

export default assets;

export const imagesDummyData = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8];

export const userDummyData = [
  {
    _id: "680f50aaf10f3cd28382ecf2",
    email: "test1@gmail.com",
    fullname: "John Doe",
    profilePic: pic2,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "680f50axf10f3cd28382dcf9",
    email: "test2@gmail.com",
    fullname: "Emma Watson",
    profilePic: pic1,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "682f50ref10f3cd28382ecf4",
    email: "test3@gmail.com",
    fullname: "Michael Smith",
    profilePic: pic4,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "680470af10f3cd2836gecf2",
    email: "test4@gmail.com",
    fullname: "Sophia Johnson",
    profilePic: pic3,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "682f50aag10f3se28382ecf6",
    email: "test5@gmail.com",
    fullname: "David Williams",
    profilePic: pic6,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "681f50aag10f3cd21382ecf9",
    email: "test6@gmail.com",
    fullname: "Olivia Brown",
    profilePic: pic5,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "680f50abf10f3zd28382ecfd",
    email: "test7@gmail.com",
    fullname: "James Miller",
    profilePic: pic8,
    bio: "Hi everyone, I am using Chatio",
  },
  {
    _id: "686f50aaf10f3cd2d382ecfv",
    email: "test8@gmail.com",
    fullname: "Ava Davis",
    profilePic: pic7,
    bio: "Hi everyone, I am using Chatio",
  },
];

export const messagesDummyData = [
  {
    _id: "msg1",
    senderId: "680f50aaf10f3cd28382ecf2", // John Doe
    receivedId: "680f50axf10f3cd28382dcf9", // Emma Watson
    text: "Hey Emma, how are you?",
    seen: true,
    createdAt: "2025-04-28T10:23:27.844Z",
  },
  {
    _id: "msg2",
    senderId: "680f50axf10f3cd28382dcf9", // Emma Watson
    receivedId: "680f50aaf10f3cd28382ecf2", // John Doe
    text: "Hi John! I am good, you?",
    seen: true,
    createdAt: "2025-04-28T10:25:15.200Z",
  },
  {
    _id: "msg3",
    senderId: "682f50ref10f3cd28382ecf4", // Michael Smith
    receivedId: "680470af10f3cd2836gecf2", // Sophia Johnson
    text: "Are we meeting tomorrow?",
    seen: false,
    createdAt: "2025-04-28T11:10:42.500Z",
  },
  {
    _id: "msg4",
    senderId: "680470af10f3cd2836gecf2", // Sophia Johnson
    receivedId: "682f50ref10f3cd28382ecf4", // Michael Smith
    text: "Yes, 10 AM sharp!",
    seen: true,
    createdAt: "2025-04-28T11:12:00.100Z",
  },
  {
    _id: "msg5",
    senderId: "682f50aag10f3se28382ecf6", // David Williams
    receivedId: "681f50aag10f3cd21382ecf9", // Olivia Brown
    text: "Good morning Olivia!",
    seen: false,
    createdAt: "2025-04-28T09:05:30.600Z",
  },
  {
    _id: "msg6",
    senderId: "681f50aag10f3cd21382ecf9", // Olivia Brown
    receivedId: "682f50aag10f3se28382ecf6", // David Williams
    text: "Morning David! How's everything?",
    seen: false,
    createdAt: "2025-04-28T09:06:45.210Z",
  },
  {
    _id: "msg7",
    senderId: "680f50abf10f3zd28382ecfd", // James Miller
    receivedId: "686f50aaf10f3cd2d382ecfv", // Ava Davis
    text: "Hi Ava, let's catch up soon!",
    seen: true,
    createdAt: "2025-04-28T14:45:00.000Z",
  },
  {
    _id: "msg8",
    senderId: "686f50aaf10f3cd2d382ecfv", // Ava Davis
    receivedId: "680f50abf10f3zd28382ecfd", // James Miller
    text: "Sure James, this weekend?",
    seen: true,
    createdAt: "2025-04-28T14:47:22.320Z",
  },
];
