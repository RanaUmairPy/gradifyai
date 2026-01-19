import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Info,
  Star,
  Phone,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Shield,
} from "lucide-react";

const Header = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const navLinks = [
    { name: "Home", path: "/", icon: BookOpen },
    { name: "Features", path: "/features", icon: Star },
    { name: "About", path: "/about", icon: Info },
    { name: "Privacy", path: "/privacy", icon: Shield },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  const NavItem = ({ link }) => {
    const isActive = location.pathname === link.path;
    const Icon = link.icon;
    return (
      <Link
        to={link.path}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 
          ${isActive
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
          }`}
      >
        <Icon className="w-4 h-4" />
        {link.name}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Gradify<span className="text-indigo-500">AI</span>
            </h1>
            <p className="text-xs text-gray-500">Smart Learning Dashboard</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Only show public nav links if NOT logged in */}
          {!user && (
            <nav className="flex items-center gap-2">
              {navLinks.map((l) => (
                <NavItem key={l.path} link={l} />
              ))}
            </nav>
          )}

          {/* Auth */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 font-medium hover:bg-indigo-50 transition"
              >
                <LogIn className="inline-block w-4 h-4 mr-2" />
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition"
              >
                <UserPlus className="inline-block w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* 1. Teacher Action: Create New Class */}
              {user.is_teacher && (
                <Link
                  to="/teacher/create-class"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition shadow-sm"
                  title="Create New Class"
                >
                  <img src="/studyroom.png" alt="Class" className="w-6 h-6 object-contain" />
                  <span className="text-sm font-semibold">Create New Class</span>
                </Link>
              )}

              {/* 1. Student Action: Join Class */}
              {!user.is_teacher && (
                <Link
                  to="/student/join-class"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition shadow-sm"
                  title="Join New Class"
                >
                  <img src="/studyroom.png" alt="Class" className="w-6 h-6 object-contain" />
                  <span className="text-sm font-semibold">Join Class</span>
                </Link>
              )}

              {/* 2. User Avatar (Dashboard Link) */}
              <Link
                to={user.is_teacher ? "/teacher" : "/student"}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold hover:shadow-md transition overflow-hidden border border-indigo-200"
                title="Dashboard"
              >
                <img src="/user.png" alt="Profile" className="w-full h-full object-cover" />
              </Link>

              {/* 3. User Info */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold text-gray-800">{user.username || user.name}</p>
                <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                  {user.is_teacher ? "Teacher" : "Student"}
                </p>
              </div>

              {/* 4. Logout */}
              <button
                onClick={onLogout}
                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pb-4 space-y-3 bg-white/90 backdrop-blur-md">
          {!user && navLinks.map((link) => (
            <NavItem key={link.path} link={link} />
          ))}
          <div className="pt-3 border-t border-gray-200">
            {!user ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-indigo-600 text-center text-indigo-600 font-medium hover:bg-indigo-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-center font-semibold hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {/* 1. Teacher Action: Create New Class */}
                {user.is_teacher && (
                  <Link
                    to="/teacher/create-class"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    <img src="/studyroom.png" alt="Class" className="w-8 h-8 object-contain" />
                    <span className="font-semibold text-sm">Create New Class</span>
                  </Link>
                )}

                {/* 1. Student Action: Join Class */}
                {!user.is_teacher && (
                  <Link
                    to="/student/join-class"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    <img src="/studyroom.png" alt="Class" className="w-8 h-8 object-contain" />
                    <span className="font-semibold text-sm">Join Class</span>
                  </Link>
                )}

                {/* 2. User Avatar (Dashboard Link) */}
                <Link
                  to={user.is_teacher ? "/teacher" : "/student"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-600"
                >
                  <img src="/user.png" alt="Profile" className="w-8 h-8 rounded-full object-cover border border-indigo-200" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">
                      {user.username || user.name}
                    </span>
                    <span className="text-xs text-indigo-400">
                      {user.email}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
