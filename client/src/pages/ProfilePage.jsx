import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const ProfilePage = () => {
  // Importing `authUser` (the currently logged in user's data)
  // and `updateProfile` (a function to update user profile info)
  // from AuthContext using React's useContext hook.
  const { authUser, updateProfile } = useContext(AuthContext);

  // Stores profile avatar image file
  const [selectedImg, setSelectedImg] = useState(null);

  // For navigation after form submission
  const navigate = useNavigate();

  // Create state variables for controlled inputs (form fields).
  // Initialize them with values from the logged-in user's profile.
  const [name, setName] = useState(authUser.fullName); // Tracks "Name" input field
  const [bio, setBio] = useState(authUser.bio); // Tracks "Bio" input field

  // Function to handle form submission (when user clicks "Save" button).
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission (which refreshes the page).

    // Case 1: If the user did not select a new profile picture
    if (!selectedImg) {
      // Update only fullName and bio in the user's profile
      await updateProfile({ fullName: name, bio });
      navigate("/"); // After saving, redirect to homepage (temporary navigation logic)
      return; // Exit function here since no image needs processing
    }

    // Case 2: If a new profile picture (file) is selected
    const reader = new FileReader(); // Create a new FileReader to read the uploaded file
    reader.readAsDataURL(selectedImg); // Read file as a Base64-encoded data URL

    // This event triggers once file reading is complete
    reader.onload = async () => {
      const base64Image = reader.result; // Get the Base64-encoded string of the image

      // Update profile with image + fullName + bio
      await updateProfile({ profilePic: base64Image, fullName: name, bio });

      navigate("/"); // After saving, redirect to homepage
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      {/* Container with theme border + popup hover effect like signup page */}
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-[#026c7a] flex items-center justify-between max-sm:flex-col-reverse rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#026c7a]/40">
        {/* FORM SECTION */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          {/* Heading with gradient + back arrow icon */}
          <h3 className="flex justify-center items-center w-full gap-2">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-[#0cadc3] to-[#026c7a] bg-clip-text text-transparent drop-shadow-md tracking-wide">
              Profile Details
            </span>
            {/* Optional back arrow */}
            <img
              onClick={() => navigate(-1)}
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 cursor-pointer hover:scale-110 transition-transform duration-200"
            />
          </h3>

          {/* PROFILE IMAGE UPLOAD */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt="Profile avatar"
              className={`w-12 h-12 ${
                selectedImg ? "rounded-full" : ""
              } border border-gray-500 transition-all duration-300`}
            />
            <span className="transition-colors duration-300 hover:text-teal-400">
              Upload profile image
            </span>
          </label>

          {/* NAME INPUT */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0394a7] transition-colors duration-300 hover:border-[#0394a7] hover:bg-white/10"
          />

          {/* BIO TEXTAREA */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0394a7] transition-colors duration-300 hover:border-[#0394a7] hover:bg-white/10"
            rows={4}
          ></textarea>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#0394a7] to-[#024b57] hover:from-[#026c7a] hover:to-[#012f35] text-white p-2 rounded-full text-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md hover:shadow-[#026c7a]/50"
          >
            Save
          </button>
        </form>

        {/* SIDE IMAGE SECTION */}
        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 transition-transform duration-300 hover:scale-105 ${
            selectedImg && "rounded-full"
          }`}
          src={authUser.profilePic || assets.logo}
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
