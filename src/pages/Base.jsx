import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TeacherPage from "./Teacher";
import StudentPage from "./Student";
import Home from "./Home";

const Base = () => {
  const navigate = useNavigate();
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

  // ✅ Decide which dashboard to show
  let content;
  if (!user) {
    // Not logged in — show Home (public landing)
    content = <Home />;
  } else if (user?.is_teacher) {
    // Teacher dashboard
    content = <TeacherPage />;
  } else {
    // Student dashboard
    content = <StudentPage />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      {/* Header always visible */}
      <header className={`sticky top-0 z-50 ${theme.header}`}>
        <Header />
      </header>

      {/* Main content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        {content}
      </main>

      {/* Footer always visible */}
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
