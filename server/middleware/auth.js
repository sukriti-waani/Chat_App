// Import the jsonwebtoken library to work with JWT tokens
import jwt from "jsonwebtoken";

// Import the User model to fetch user details from the database
import User from "../models/User.js";

// ===============================
// Middleware: protectRoute
// ===============================
// - This function protects certain routes by checking for a valid JWT token.
// - If the token is valid → fetch user from DB and allow access.
// - If not → block access and return an error response.
export const protectRoute = async (req, res, next) => {
  try {
    // Step 1: Extract token from request headers
    // In frontend, you must send: headers: { token: "jwtTokenHere" }
    const token = req.headers.token;

    // Step 2: If token is missing, return error immediately
    if (!token) {
      return res
        .status(401) // Unauthorized status code
        .json({ success: false, message: "JWT must be provided" });
    }

    // Step 3: Verify the token using the secret key
    // - jwt.verify() decodes the token if valid
    // - If invalid/expired → throws an error that goes to catch block
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Find the user in the database using decoded.userId
    // - ".select('-password')" ensures the password field is not returned for security
    const user = await User.findById(decoded.userId).select("-password");

    // Step 5: If no user is found in DB, send an error response
    if (!user) {
      return res
        .status(404) // Not found
        .json({ success: false, message: "User not found" });
    }

    // Step 6: Attach user info to req object
    // - This way, controllers that run after this middleware can access `req.user`
    req.user = user;

    // Step 7: Call next() to continue request flow
    // - If everything is fine, request moves on to the next middleware/controller
    next();
  } catch (error) {
    // Step 8: Handle any errors (e.g., invalid token, expired token)
    console.log(error.message); // Logs the error in server console
    res
      .status(401) // Unauthorized
      .json({ success: false, message: error.message });
  }
};

// ===============================
// Controller: checkAuth
// ===============================
// - This endpoint simply confirms if a user is authenticated.
// - It returns the user info attached by protectRoute middleware.
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};
