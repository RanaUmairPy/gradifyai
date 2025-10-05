import React from "react";
import { Link } from "react-router-dom";
import { BookCheck, Brain, LogIn } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col justify-center items-center text-white px-6">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-4 rounded-2xl shadow-lg">
            <BookCheck size={60} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Assignment Checker AI
        </h1>

        <p className="text-lg sm:text-xl text-white/80 mb-8">
          Simplify your academic workflow — upload, check, and analyze assignments instantly using AI-powered evaluation. 
          Manage your classes, track progress, and get smart feedback for every submission.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-50 transition"
          >
            <LogIn size={20} /> Login
          </Link>

          <Link
            to="/signup"
            className="border-2 border-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/20 transition"
          >
            <Brain size={20} /> Sign Up
          </Link>
        </div>

        <div className="mt-12 text-white/60 text-sm">
          © {new Date().getFullYear()} Assignment Checker — Built for students and teachers
        </div>
      </div>
    </div>
  );
};

export default Home;
