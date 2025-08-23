import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const LoginPage = () => {
  // State to track whether the form is in "Sign up" or "Login" mode
  const [currState, setCurrState] = useState("Sign up");

  // Controlled input states for form fields
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // Tracks whether the first step of data has been submitted
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    // Prevents default page reload when form is submitted

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      // Moves user to next step (bio input) in sign-up process
      return;
    }
    // If in login mode or bio step, this is where you would handle API calls
    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };
  // onSubmitHandler → Handles the form submission logic based on current mode and step

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left Section - Logo with Heading */}
      <div className="flex flex-col items-center">
        <img
          src={assets.logo}
          alt="Chatio Logo"
          className="w-[min(30vw,220px)] mb-0"
        />
        <h1 className="text-8xl font-bold text-white font-[Poppins] tracking-wide">
          Chatio
        </h1>
      </div>

      {/* Right Section - Form */}
      <form
        onSubmit={onSubmitHandler}
        action=""
        className="border-2 border-[#026c7a] bg-white/10 text-white p-6 flex flex-col gap-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#026c7a]/40"
      >
        {/* Heading with state label + arrow icon */}
        <h2 className="flex justify-center items-center w-full">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-[#0cadc3] to-[#026c7a] bg-clip-text text-transparent drop-shadow-md tracking-wide">
            {currState}
          </span>
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 cursor-pointer hover:scale-110 transition-transform"
            />
          )}
        </h2>

        {/* Full Name input - Only in Sign up mode before submitting data */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setfullName(e.target.value)}
            // Updates FullName state on input change
            value={fullName}
            type="text"
            className="p-2 border border-[#026c7a] bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0394a7] hover:border-[#0394a7] hover:bg-white/5"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email and Password inputs - Only before data submission */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              // Updates email state
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-[#026c7a] bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0394a7] hover:border-[#0394a7] hover:bg-white/5"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              // Updates password state
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-[#026c7a] bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0394a7] hover:border-[#0394a7] hover:bg-white/5"
            />
          </>
        )}

        {/* Bio textarea - Only shown in Sign up mode after first step */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            // Updates bio state
            value={bio}
            rows={4}
            className="p-2 border border-[#026c7a] bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0394a7] hover:border-[#0394a7] hover:bg-white/5"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        {/* Submit button - Text changes depending on mode */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#0394a7] to-[#024b57] hover:from-[#026c7a] hover:to-[#012f35] text-white text-sm font-light py-2 px-6 rounded-full cursor-pointer"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Terms and privacy agreement */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" className="accent-[#026c7a]" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {/* Toggle link between Sign up and Login */}
        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  // Switch to Login mode
                  setIsDataSubmitted(false);
                  // Reset any progress in sign-up
                }}
                className="font-medium text-[#0cadc3] cursor-pointer underline hover:text-[#157c8c] transition-colors duration-200"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign up")}
                // Switch to Sign up mode
                className="font-medium text-[#0cadc3] cursor-pointer underline hover:text-[#157c8c] transition-colors duration-200"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
