// Importing necessary React and third-party libraries
import { useContext } from "react"; // To use React Context (for global state management)
import { Toaster } from "react-hot-toast"; // For showing notifications
import { Navigate, Route, Routes } from "react-router-dom"; // Navigate was missing in your code

// Importing AuthContext to access authentication-related data (like logged-in user)
import { AuthContext } from "../context/AuthContext";

// Importing assets (images, icons, etc.)
import assets from "./assets/assets";

// Importing pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

// Extracting bgImage from assets
const { bgImage } = assets;

// Main App Component
const App = () => {
  // Getting `authUser` from AuthContext (it tells whether the user is logged in or not)
  const { authUser } = useContext(AuthContext);

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="h-screen w-full bg-cover bg-center bg-no-repeat"
    >
      {/* Toaster is used for showing success/error popups */}
      <Toaster />

      {/* Define different routes (pages) of the application */}
      <Routes>
        {/* Home page route ("/") */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
          // If user is logged in -> show HomePage
          // Else redirect (Navigate) to LoginPage
        />

        {/* Login page route ("/login") */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          // If user is NOT logged in -> show LoginPage
          // Else redirect to HomePage
        />

        {/* Profile page route ("/profile") */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          // If user is logged in -> show ProfilePage
          // Else redirect to LoginPage
        />
      </Routes>
    </div>
  );
};

export default App;
