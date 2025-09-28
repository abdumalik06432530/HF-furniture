import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Basic client-side validation
    if (!email || !password || (currentState === "Sign Up" && (!name || !phone))) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint =
        currentState === "Sign Up"
          ? `${backendUrl}/api/user/register`
          : `${backendUrl}/api/user/login`;

      const payload =
        currentState === "Sign Up"
          ? { name, email, password, phone }
          : { email, password };

      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(
          currentState === "Sign Up"
            ? "Account created successfully!"
            : "Logged in successfully!"
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            {currentState}
          </h2>
          <hr className="w-10 h-0.5 bg-gray-900" />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {currentState === "Sign Up" && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                required
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Links */}
        <div className="flex justify-between text-xs sm:text-sm text-gray-600">
          <a
            href="#"
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Forgot your password?
          </a>
          <button
            type="button"
            onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            {currentState === "Login" ? "Create account" : "Login Here"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-6 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : currentState === "Login" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;