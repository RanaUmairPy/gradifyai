import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import TeacherPage from "./Teacher";
import StudentPage from "./Student";
import Home from "./Home";
import About from "./About";
import Features from "./Features";
import PrivacyPolicy from "./PrivacyPolicy";
import Contact from "./Contact";
import ClassRoom from "./ClassRoom";
import AssignmentDetails from "./AssignmentDetails";
import AssignmentSubmissions from "./AssignmentSubmissions";
import CreateClass from "./CreateClass";
import JoinClass from "./JoinClass";

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
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

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

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      {/* Header always visible */}
      <header className={`sticky top-0 z-50 ${theme.header}`}>
        <Header user={user} onLogout={handleLogout} />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        <Routes>
          {/* Public Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />

          {/* New Class Routes */}
          <Route path="/teacher/create-class" element={user?.is_teacher ? <CreateClass /> : <Navigate to="/" />} />
          <Route path="/student/join-class" element={!user?.is_teacher ? <JoinClass /> : <Navigate to="/" />} />

          {/* Teacher Assignments Management */}
          <Route path="/teacher/assignment/:id/submissions" element={<AssignmentSubmissions />} />
          <Route path="/teacher/assignment/:id" element={<AssignmentDetails />} />

          {/* Student Assignments */}
          <Route path="/student/assignment/:id" element={<AssignmentDetails />} />

          {/* Classroom Views */}
          <Route path="/student/class/:id" element={<ClassRoom />} />
          <Route path="/teacher/class/:id" element={<ClassRoom />} />

          {/* Dashboard / Home */}
          <Route path="/" element={
            !user ? <Home /> :
              user.is_teacher ? <TeacherPage /> : <StudentPage />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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