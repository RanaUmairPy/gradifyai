import React, { useState } from "react";
import axios from "axios";
import { UserPlus, User, Mail, Lock, CornerRightUp, Brain, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        roll_number: "",
        name: "",
        is_teacher: false,

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
                `${BASE_API}api/user/register/`,
                formData
            );

            if (response.status === 201) {
                setMessage("✅ Registration successful! Please check your email to confirm.");

                localStorage.setItem("user_email_for_otp", formData.email);

                setFormData({ username: "", email: "", password: "", roll_number: "", name: "", is_teacher: false });

                setTimeout(() => {
                    navigate("/email-confirmation");
                }, 2000);
            }
        } catch (error) {
            console.error("Signup error:", error);

            if (error.response && error.response.data) {
                const errorData = error.response.data;
                let errorMessages = [];

                for (const key in errorData) {
                    errorMessages.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${errorData[key].join(", ")}`);
                }

                setMessage(`❌ ${errorMessages.join(" ")}`);
            } else {
                setMessage("❌ A network error occurred. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        // 💡 BACKGROUND MATCHES LOGIN: Soft gray/blue gradient
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">

            {/* Main Content Wrapper (Container for both columns - responsive split) */}
            <div className="max-w-6xl w-full flex flex-col md:flex-row shadow-2xl shadow-indigo-200 rounded-2xl overflow-hidden border border-indigo-200">

                {/* 1. LEFT SIDE: Welcome/Branding Column (Matches Login's main color) */}
                <div className="w-full md:w-1/2 bg-indigo-600 p-8 sm:p-12 flex flex-col justify-center text-white text-center md:text-left order-2 md:order-1">
                    <Brain className="w-16 h-16 mx-auto md:mx-0 mb-4 text-white" />
                    <h3 className="text-4xl font-extrabold mb-3">
                        Join GradifyAI
                    </h3>
                    <p className="text-xl font-medium text-indigo-100/90 mb-4">
                        The Future of <span className="text-white">Academic Evaluation</span> starts here.
                    </p>
                    <p className="text-sm text-indigo-200/80">
                        Register your institutional account to gain access to automated grading, plagiarism detection, and efficient classroom management tools.
                    </p>
                </div>

                {/* 2. RIGHT SIDE: Form Column (Matches Login's form card style) */}
                <div className="w-full md:w-1/2 bg-white/95 backdrop-blur-sm p-6 sm:p-10 flex flex-col justify-center order-1 md:order-2">

                    <div className="flex flex-col items-center mb-6">
                        <UserPlus className="text-indigo-600 w-10 h-10 mb-2" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Institutional Registration
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Create your account to proceed
                        </p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <p
                            className={`text-center mb-5 text-sm font-medium p-3 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                } border border-white/20`}
                        >
                            {message}
                        </p>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Role Selection */}
                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-1 group-focus-within:text-indigo-600 transition-colors">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-300 ${formData.is_teacher === false ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-indigo-300'}`}>
                                    <input
                                        type="radio"
                                        name="is_teacher"
                                        className="hidden"
                                        checked={formData.is_teacher === false}
                                        onChange={() => setFormData({ ...formData, is_teacher: false })}
                                    />
                                    <BookOpen className={`w-5 h-5 mr-2 ${formData.is_teacher === false ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">Student</span>
                                </label>
                                <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-300 ${formData.is_teacher === true ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500' : 'bg-white border-gray-300 hover:border-indigo-300'}`}>
                                    <input
                                        type="radio"
                                        name="is_teacher"
                                        className="hidden"
                                        checked={formData.is_teacher === true}
                                        onChange={() => setFormData({ ...formData, is_teacher: true })}
                                    />
                                    <User className={`w-5 h-5 mr-2 ${formData.is_teacher === true ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">Teacher</span>
                                </label>
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-1 group-focus-within:text-indigo-600 transition-colors">
                                Username
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
                                <User className="text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 mr-3 transition-colors" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                                    placeholder="Choose your username"
                                />
                            </div>
                        </div>
                        {/* name Field */}
                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-1 group-focus-within:text-indigo-600 transition-colors">
                                Your Name
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
                                <User className="text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 mr-3 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-1 group-focus-within:text-indigo-600 transition-colors">
                                Roll Number / ID
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
                                <User className="text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 mr-3 transition-colors" />
                                <input
                                    type="text"
                                    name="roll_number"
                                    value={formData.roll_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                                    placeholder="Enter your Roll No / ID"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-1 group-focus-within:text-indigo-600 transition-colors">
                                Institutional Email
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
                                <Mail className="text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 mr-3 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                                    placeholder="Enter your university email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-1 group-focus-within:text-indigo-600 transition-colors">
                                Password
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
                                <Lock className="text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 mr-3 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-300 shadow-md shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : <><UserPlus className="w-5 h-5" /> Register Account</>}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <p className="text-center text-gray-500 text-sm mt-8">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center justify-center gap-1 mt-2"
                        >
                            <CornerRightUp className="w-4 h-4 transform rotate-180" /> Institutional Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;