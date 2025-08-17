// Importing bcryptjs library for password hashing and salting
import bcrypt from "bcryptjs";

// Importing the function to generate JWT tokens (we defined earlier)
import { generateToken } from "../lib/utils.js";

// Importing the User model (MongoDB schema for storing user data)
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
