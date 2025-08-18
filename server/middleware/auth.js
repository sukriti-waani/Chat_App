// Import jsonwebtoken library for verifying JWT tokens
import jwt from "jsonwebtoken";

// Import User model to fetch user details from the database
import User from "../models/User.js";

// ===============================
// Middleware to protect routes
// ===============================
// - This function ensures that only authenticated users can access certain routes.
// - It verifies the token, fetches the user, and attaches user info to req object.
export const protectRoute = async (req, res, next) => {
  try {
    // Step 1: Get token from request headers
    // Example: In frontend you send `headers: { token: "jwtTokenHere" }`
    const token = req.headers.token;

    // Step 2: Verify the token using JWT and secret key
    // If invalid or expired, jwt.verify() will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Find the user from database using the decoded userId
    // ".select('-password')" ensures password field is excluded for security
    const user = await User.findById(decoded.userId).select("-password");

    // Step 4: If user does not exist in DB, send error response
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Step 5: Attach user data to req object so next middleware/controllers can use it
    req.user = user;

    // Step 6: Call next() to pass control to the next middleware or controller
    next();
  } catch (error) {
    // If any error occurs (invalid token, expired token, etc.), log and send response
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// Controller to check authentication
// ===============================
// - This endpoint is used to confirm if a user is authenticated.
// - It simply returns the user info that protectRoute middleware attached to req.
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};
