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
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <BookOpen className="w-4 h-4 text-blue-600" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4 text-green-600" /> },
    { name: "Features", path: "/features", icon: <Star className="w-4 h-4 text-yellow-500" /> },
    { name: "Contact", path: "/contact", icon: <Phone className="w-4 h-4 text-purple-600" /> },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="\public\gradifylogo.png"
            alt="GradifyAI Logo"
            className="w-11 h-11 group-hover:rotate-6 transition-transform duration-300"
          />
          <span className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
            Gradify<span className="text-blue-500">Ai</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-1 hover:text-indigo-600 transition relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all duration-300 ${location.pathname === link.path ? "text-indigo-600 after:w-full" : ""
                }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Auth Buttons / User Info */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 px-5 py-2 border border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1 px-5 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-xl">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-700">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none transition-transform duration-300 hover:scale-110"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg py-4 space-y-4 px-6 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 text-gray-700 text-base font-medium hover:text-indigo-600 transition ${location.pathname === link.path ? "text-indigo-600 font-semibold" : ""
                }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {!user ? (
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <Link
                to="/login"
                className="flex items-center justify-center gap-1 w-1/2 text-center py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-1 w-1/2 text-center py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-3 border-t pt-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 w-full justify-center"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;