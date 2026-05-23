import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Info, Star, Phone, Menu, X, LogIn, UserPlus, LogOut, Shield, Sun, Moon, Smartphone } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Header = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Home", path: "/", icon: BookOpen },
    { name: "Features", path: "/features", icon: Star },
    { name: "Mobile App", path: "/download-app", icon: Smartphone },
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
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 
          ${isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
            : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
      >
        <Icon className="w-4 h-4" />
        {link.name}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Logo and branding */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-850 dark:text-white tracking-tight leading-tight">
              Gradify<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 font-bold">Autonomous Grading Desk</p>
          </div>
        </Link>

        {/* Desktop Nav deck */}
        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <nav className="flex items-center gap-1.5">
              {navLinks.map((l) => (
                <NavItem key={l.path} link={l} />
              ))}
            </nav>
          )}



          {/* Auth Action sets */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-850 transition"
              >
                <LogIn className="inline-block w-3.5 h-3.5 mr-1.5" />
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition"
              >
                <UserPlus className="inline-block w-3.5 h-3.5 mr-1.5" />
                Enroll
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-slate-150/60 dark:border-slate-800/80 pl-4">
              
              {/* Teacher Dynamic actions */}
              {user.is_teacher && (
                <Link
                  to="/teacher/create-class"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-250 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-extrabold transition shadow-sm"
                  title="Create New Classroom Workspace"
                >
                  <img src="/studyroom.png" alt="Classroom icon" className="w-5.5 h-5.5 object-contain" />
                  <span>Create Class</span>
                </Link>
              )}

              {/* Student Dynamic actions */}
              {!user.is_teacher && (
                <Link
                  to="/student/join-class"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-250 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-extrabold transition shadow-sm"
                  title="Enroll in Classroom Workspace"
                >
                  <img src="/studyroom.png" alt="Enroll icon" className="w-5.5 h-5.5 object-contain" />
                  <span>Join Class</span>
                </Link>
              )}

              {/* User Avatar panel linking to dashboard */}
              <Link
                to={user.is_teacher ? "/teacher" : "/student"}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-850 hover:shadow transition overflow-hidden border border-slate-200/60 dark:border-slate-800 shrink-0"
                title="Dashboard Desk"
              >
                <img src="/user.png" alt="User avatar" className="w-full h-full object-cover" />
              </Link>

              {/* Meta details */}
              <div className="hidden lg:block text-left shrink-0">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 leading-none">{user.username || user.name}</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-normal mt-0.5">{user.email}</p>
                <span className="inline-block text-[8px] bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider mt-0.5">
                  {user.is_teacher ? "Faculty" : "Student"}
                </span>
              </div>

              {/* Logout Trigger */}
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-150/40 dark:border-rose-900/30 transition shrink-0"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3.5 md:hidden">

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800 transition text-slate-800 dark:text-white"
          >
            {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer popups */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 border-b border-slate-200/60 dark:border-slate-800" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pb-5 pt-2 space-y-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          {!user && navLinks.map((link) => (
            <NavItem key={link.path} link={link} />
          ))}
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            {!user ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-850 text-center text-slate-700 dark:text-slate-350 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-600 text-white text-center text-xs font-black uppercase tracking-wider shadow shadow-indigo-500/10 hover:bg-indigo-700 transition"
                >
                  Enroll
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Teacher Action */}
                {user.is_teacher && (
                  <Link
                    to="/teacher/create-class"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/[0.03] dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/30"
                  >
                    <img src="/studyroom.png" alt="Class icon" className="w-8 h-8 object-contain" />
                    <span className="font-extrabold text-xs uppercase tracking-wider">Create Class</span>
                  </Link>
                )}

                {/* Student Action */}
                {!user.is_teacher && (
                  <Link
                    to="/student/join-class"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/[0.03] dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/30"
                  >
                    <img src="/studyroom.png" alt="Join icon" className="w-8 h-8 object-contain" />
                    <span className="font-extrabold text-xs uppercase tracking-wider">Join Class</span>
                  </Link>
                )}

                {/* Profile Dashboard link */}
                <Link
                  to={user.is_teacher ? "/teacher" : "/student"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/40 dark:border-slate-800"
                >
                  <img src="/user.png" alt="Profile" className="w-8 h-8 rounded-xl object-cover border border-slate-250 dark:border-slate-800 shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 leading-none">
                      {user.username || user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-none">
                      {user.email}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-500/10"
                >
                  Sign Out
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
