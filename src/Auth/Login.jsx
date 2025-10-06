import React, { useState } from "react";
import axios from "axios";
// Icons used in the Login form
import { ArrowRight, User, Lock, CornerRightUp, Brain, CheckCircle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi"; 

// Component to represent the GradifyAI brain-like logo (High-Impact SVG)
const GradifyAILogo = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M48.2 11.2c-15.3 0-27.7 12.4-27.7 27.7 0 5.4 1.5 10.4 4.1 14.8-1.5 2.8-2.3 6.1-2.3 9.4 0 11.8 9.6 21.4 21.4 21.4 10.1 0 18.7-7 20.9-16.3 3.4-1.2 6.4-3.2 8.9-5.7 6.4-6.4 10.3-15.1 10.3-24.6.1-15.3-12.3-27.7-27.6-27.7zm-.6 59.8c-7.9 0-14.3-6.4-14.3-14.3 0-2.8.8-5.4 2.1-7.7 1.4-.4 2.8-.7 4.3-.7 5.7 0 10.4 4.7 10.4 10.4 0 5.7-4.7 10.4-10.4 10.4zm18.7-18.7c-2.3 0-4.4-.8-6.1-2.1-1.3-.4-2.7-.7-4.1-.7-5.7 0-10.4-4.7-10.4-10.4 0-5.7 4.7-10.4 10.4-10.4 5.7 0 10.4 4.7 10.4 10.4 0 5.7-4.7 10.4-10.4 10.4zm-11.4-12.7c0-2.3-1.9-4.2-4.2-4.2h-7.7c-2.3 0-4.2 1.9-4.2 4.2v7.7c0 2.3 1.9 4.2 4.2 4.2h7.7c2.3 0 4.2-1.9 4.2-4.2v-7.7zM66 43.1c-2.3 0-4.2-1.9-4.2-4.2V31.2c0-2.3 1.9-4.2 4.2-4.2h7.7c2.3 0 4.2 1.9 4.2 4.2v7.7c0 2.3-1.9 4.2-4.2 4.2h-7.7z"
      transform="translate(0, 0) scale(0.9)"
    />
  </svg>
);

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

    // API Logic
    try {
      const response = await axios.post(
        `${BASE_API}api/user/api/login/`,
        formData
      );

      if (response.status === 200) {
        setMessage("✅ Authentication successful.");
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const user = response.data.user;

        setFormData({ username: "", password: "" });

        setTimeout(() => {
          if (user.is_teacher) {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Invalid institutional credentials provided.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // PRIMARY BACKGROUND: Light Blue Gradient (Consistent and Attractive)
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 p-4 sm:p-8">
      
      {/* Main Content Wrapper (Premium Shadow and Structure) */}
      <div className="max-w-5xl w-full flex flex-col md:flex-row shadow-3xl shadow-indigo-400/50 rounded-2xl overflow-hidden border border-white/50">
        
        {/* 1. LEFT SIDE: Branding and Value Proposition Column (INDIGO Accent) */}
        <div className="w-full md:w-1/2 bg-indigo-700 p-8 sm:p-12 flex flex-col justify-between text-white text-center md:text-left order-2 md:order-1">
            
            {/* --- TOP BRANDING SECTION: Clear and Bold --- */}
            <div className="mb-8">
                <div className="flex items-center justify-center md:justify-start mb-3">
                    <GradifyAILogo className="w-11 h-11 mr-3 text-white" />
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        GradifyAI
                    </h1>
                </div>
                <h3 className="text-3xl font-bold tracking-tight mt-4">
                    Welcome Back, Educator.
                </h3>
            </div>
            
            {/* --- MIDDLE CONTENT: High-Level Professional Text (Bolds updated) --- */}
            <div className="flex-grow space-y-3">
                <p className="text-xl font-medium text-indigo-100/90 leading-snug">
                    Access your <strong className="font-extrabold text-white">Strategic AI Dashboard</strong> for advanced academic management.
                </p>
                <p className="text-sm text-indigo-200/80 leading-relaxed">
                    GradifyAI empowers institutions with a sophisticated solution for equitable evaluation, delivering data-driven insights essential for accelerating student progress and optimizing faculty resources.
                </p>
            </div>
            
            {/* --- BOTTOM FEATURE LIST (Professional Wording) --- */}
            <div className="mt-8 space-y-3 text-left pt-6 border-t border-indigo-500/50">
                <p className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Core Capabilities</p>
                <div className="flex items-center text-sm text-white font-medium">
                    <CheckCircle className="w-4 h-4 mr-2 text-indigo-300" /> Objective AI-Driven Grading
                </div>
                <div className="flex items-center text-sm text-white font-medium">
                    <CheckCircle className="w-4 h-4 mr-2 text-indigo-300" /> Comprehensive Integrity Checks
                </div>
                <div className="flex items-center text-sm text-white font-medium">
                    <CheckCircle className="w-4 h-4 mr-2 text-indigo-300" /> Faculty Workflow Optimization
                </div>
            </div>
        </div>

        {/* 2. RIGHT SIDE: Form Column (Premium, Clean Glassmorphism) */}
        <div className="w-full md:w-1/2 bg-white/75 backdrop-blur-lg p-8 sm:p-12 flex flex-col justify-center order-1 md:order-2">
            
            <div className="flex flex-col items-start mb-10">
                <ArrowRight className="text-indigo-600 w-8 h-8 mb-2" />
                <h2 className="text-3xl font-bold text-gray-900">
                    Secure Platform Access
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                    Please provide your institutional credentials
                </p>
            </div>

            {/* Message Display (Refined style) */}
            {message && (
                <p
                    className={`text-left mb-6 text-sm font-medium p-3 rounded-xl ${
                        message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    } border border-gray-200 shadow-sm`}
                >
                    {message}
                </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Username Input (Sophisticated Underline style) */}
                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm group-focus-within:text-indigo-600 transition-colors">
                        Institutional Username
                    </label>
                    <div className="flex items-center border-b-2 border-indigo-300/70 rounded-none px-0 py-2 bg-transparent focus-within:border-indigo-600 transition-all duration-300">
                        <User className="text-gray-500 group-focus-within:text-indigo-600 w-5 h-5 mr-3 transition-colors" />
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-500 font-medium"
                            placeholder="Your registered username"
                        />
                    </div>
                </div>

                {/* Password Input (Sophisticated Underline style) */}
                <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm group-focus-within:text-indigo-600 transition-colors">
                        Password
                    </label>
                    <div className="flex items-center border-b-2 border-indigo-300/70 rounded-none px-0 py-2 bg-transparent focus-within:border-indigo-600 transition-all duration-300">
                        <Lock className="text-gray-500 group-focus-within:text-indigo-600 w-5 h-5 mr-3 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-500 font-medium"
                            placeholder="Secure password"
                        />
                    </div>
                </div>

                {/* Submit Button (Updated text to "Login") */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed mt-10"
                >
                    {loading ? "Authenticating..." : <><ArrowRight className="w-5 h-5" /> Login</>}
                </button>
            </form>

            {/* Footer Link */}
            <p className="text-center text-gray-600 text-sm mt-8">
                New institutional user?{" "}
                <a
                    href="/signup"
                    className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center justify-center gap-1 mt-2 group"
                >
                    <CornerRightUp className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" /> Initiate Registration
                </a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;