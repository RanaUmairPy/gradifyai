import React, { useState } from "react";
import axios from "axios";
import { LogIn, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${BASE_API}api/user/api/login/`,
        formData
      );

      if (response.status === 200) {
        setMessage("✅ Login successful!");

        // Save tokens and user data
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const user = response.data.user;

        setFormData({ username: "", password: "" });

        // 🔹 Redirect based on user role
        setTimeout(() => {
          if (user.is_teacher) {
            navigate("/teacher"); // teacher goes to teacher dashboard
          } else {
            navigate("/student"); // student goes to student dashboard
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 px-4">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md border border-indigo-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <LogIn className="text-indigo-600 w-10 h-10 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back to <span className="text-indigo-600">GradifyEdu</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please sign in to continue
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mb-4 text-sm font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white">
              <User className="text-indigo-500 w-5 h-5 mr-2" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-gray-800"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white">
              <Lock className="text-indigo-500 w-5 h-5 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-gray-800"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
