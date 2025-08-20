import express from "express";

// Importing controller functions
import {
  checkAuth, // To check if user is authenticated
  login, // To handle user login
  signup, // To handle user signup
  updateProfile, // To update user profile
} from "../controllers/userController.js";

// Importing middleware to protect routes (ensures user is logged in)
import { protectRoute } from "../middleware/auth.js";

// Create a new Express Router instance (to define routes separately)
const userRouter = express.Router();

// Define routes and attach corresponding controllers

// Route: POST /api/auth/signup
// Function: Calls signup controller to register a new user
userRouter.post("/signup", signup);

// Route: POST /api/auth/login
// Function: Calls login controller to authenticate user and return token
userRouter.post("/login", login);

// Route: PUT /api/auth/update-profile
// Function: Updates user profile but only if user is authenticated
// Uses protectRoute middleware before calling updateProfile controller
userRouter.put("/update-profile", protectRoute, updateProfile);

// Route: GET /api/auth/check
// Function: Checks if user is authenticated using protectRoute middleware
// If authenticated, calls checkAuth controller to return user info
userRouter.get("/check", protectRoute, checkAuth);

// Export the router so it can be used in server.js (or index.js)
export default userRouter;
