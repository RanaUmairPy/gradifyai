import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import TeacherPage from "./Teacher";
import StudentPage from "./Student";
import Home from "./Home";
import About from "./About";
import Features from "./Features"; 
import PrivacyPolicy from "./PrivacyPolicy"; 
import Contact from "./Contact"; 

const Base = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    // If not logged in → show home page (public view)
    if (!storedUser || !token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [navigate]);

  const theme = {
    bg: "bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200",
    header: "bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-md",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  // ✅ Decide which page to render based on path and user status
  let content;

  if (location.pathname === "/about") {
    content = <About />;
  } else if (location.pathname === "/features") {
    content = <Features />;
  } else if (location.pathname === "/privacy") {
    content = <PrivacyPolicy />;
  } else if (location.pathname === "/contact") { 
    content = <Contact />;
  } else if (!user) {
    content = <Home />; // Public Home Page (for all other public routes like /login, the component should handle routing)
  } else if (user?.is_teacher) {
    content = <TeacherPage />; // Teacher Dashboard
  } else {
    content = <StudentPage />; // Student Dashboard
  }

  // Note: For public pages (About, Features, Privacy, Contact), the page content
  // will now span the full width of the 'main' container (max-w-7xl).

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      {/* Header always visible */}
      <header className={`sticky top-0 z-50 ${theme.header}`}>
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        {content}
      </main>

      {/* Footer always visible */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-indigo-100 shadow-inner py-6 text-center text-gray-600">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-indigo-600">GradifyEdu</span>. All
          rights reserved. Built for the future of education.
        </p>
      </footer>
    </div>
  );
};

export default Base;