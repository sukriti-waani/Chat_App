// Importing bcryptjs library for password hashing and salting
import bcrypt from "bcryptjs";

// Importing the function to generate JWT tokens (we defined earlier)
import { generateToken } from "../lib/utils.js";

// Importing the User model (MongoDB schema for storing user data)
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";

// Controller function to handle signup of a new user
// 'req' = request object (contains incoming data like body, params, etc.)
// 'res' = response object (used to send back data to client)
export const signup = async (req, res) => {
  // Destructuring the required fields from request body
  const { fullName, email, password, bio } = req.body;

  try {
    // Step 1: Validate required fields
    // If any field is missing, return a failure response
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Step 2: Check if user with the same email already exists in DB
    const user = await User.findOne({ email });

    // If user exists, stop signup and return error message
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    // Step 3: Encrypt the password before saving
    // Generate a salt (random data used for stronger hashing)
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4: Create new user in database with hashed password
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword, // store hashed password, never plain text
      bio,
    });

    // Step 5: Generate JWT token for authentication (using user’s ID)
    const token = generateToken(newUser._id);

    // Step 6: Send success response back to client
    res.json({
      success: true,
      userData: newUser, // newly created user details
      token, // authentication token
      message: "Account created successfully",
    });
  } catch (error) {
    // If something goes wrong, log error and send error response
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to login a user
export const login = async (req, res) => {
  try {
    // Step 1: Extract email and password from the request body
    const { email, password } = req.body;

    // Step 2: Find the user in the database by their email
    const userData = await User.findOne({ email });

    // If no user found, return error response
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Step 3: Compare the entered plain-text password with the stored hashed password
    // bcrypt.compare(plainPassword, hashedPassword)
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    // If password does not match, return invalid credentials
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Step 4: Generate JWT token for the logged-in user
    const token = generateToken(userData._id);

    // Step 5: Send success response back to client with user data and token
    res.json({
      success: true,
      userData, // user info from database
      token, // JWT token for authentication
      message: "Login Successful",
    });
  } catch (error) {
    // Step 6: Handle errors (DB issues, bcrypt issues, etc.)
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to check if user is authenticated
// This function simply returns the user object stored in req.user
// (which is usually set by authentication middleware like JWT or Passport).
export const checkAuth = (req, res) => {
  // Respond with a success message and the authenticated user data
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
// This function allows users to update their profile (profile picture, bio, full name).
export const updateProfile = async (req, res) => {
  try {
    // Extract profile details from the request body
    const { profilePic, bio, fullName } = req.body;

    // Get the logged-in user's ID from req.user (set by auth middleware)
    const userId = req.user._id;
    let updatedUser;

    // CASE 1: If no profile picture is provided
    if (!profilePic) {
      // Update only bio and fullName fields in the database
      updatedUser = await User.findByIdAndUpdate(
        userId, // Find user by ID
        { bio, fullName }, // Fields to update
        { new: true } // Return updated user document instead of old one
      );
    } else {
      // CASE 2: If profile picture is provided
      // Upload the picture to Cloudinary
      const upload = await cloudinary.uploader.upload(profilePic);

      // Update profilePic (with Cloudinary URL), bio, and fullName
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    // Send response with updated user data
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    // If something goes wrong, log the error and send failure response
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
