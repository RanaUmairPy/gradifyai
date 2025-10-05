import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Home from "./Home";
import Login from "../Auth/Login";
const Base = () => {
  
  const theme = {
    bg: "bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200",
    header: "bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-md",
    text: "text-gray-800",
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      
      <header className={`sticky top-0 z-50 ${theme.header}`}>
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        {/* Default Home Section */}
        <section className="mb-12">
          <Home />
        </section>
        
        {/* Nested Pages */}
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
