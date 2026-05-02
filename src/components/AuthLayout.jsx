import React from "react";
import Header from "./Header";

/**
 * Shared layout for the unauthenticated pages (Login, Signup,
 * EmailConfirmation, ForgotPassword). Renders the same GradifyAI header
 * that's used everywhere else and centers its children in the remaining
 * vertical space, keeping each page's existing background intact.
 */
const AuthLayout = ({ children, bgClass = "bg-gray-100" }) => {
  return (
    <div className={`min-h-screen flex flex-col ${bgClass}`}>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-md">
        <Header user={null} onLogout={() => {}} />
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
