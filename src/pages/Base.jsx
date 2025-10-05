import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Home from "./Home";
import TeacherPage from "./Teacher";
import Login from "../Auth/Login";

const Base = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Get user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");


    setUser(storedUser);
    setLoading(false);
  }, [navigate]);

  const theme = {
    bg: "bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200",
    header: "bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-md",
    text: "text-gray-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${theme.header}`}>
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        <section className="mb-12">
          {/* ✅ If teacher, show TeacherPage; otherwise show Home */}
          {user?.role === "teacher" ? <TeacherPage /> : <Home />}
        </section>

        {/* Nested routes (if any) */}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-indigo-100 shadow-inner py-6 text-center text-gray-600">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-indigo-600">GradifyEdu</span>. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Base;
