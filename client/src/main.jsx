// Import the ReactDOM createRoot function to render the app
import { createRoot } from "react-dom/client";

// Import BrowserRouter from react-router-dom to enable routing
import { BrowserRouter } from "react-router-dom";

// Import AuthProvider from your context to provide authentication state globally
import { AuthProvider } from "../context/AuthContext.jsx";

import { ChatProvider } from "../context/ChatContext.jsx";

import App from "./App.jsx";
import "./index.css";

// Get the root DOM element (the div with id="root" in index.html)
// Then render the React app inside it using createRoot (React 18+)
createRoot(document.getElementById("root")).render(
  // Wrap the app with BrowserRouter to enable client-side routing
  <BrowserRouter>
    {/* Wrap the app with AuthProvider to give access to authentication context */}
    <AuthProvider>
      <ChatProvider>
        {/* Render the main App component */}
        <App />
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
