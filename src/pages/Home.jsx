import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookCheck, Brain, LogIn } from "lucide-react";

const Home = () => {
  useEffect(() => {
    // ✅ Basic SEO tags
    document.title = "GradifyAI | AI Assignment Checker for Students & Teachers";

    const description =
      "GradifyAI is an AI-powered platform that helps students and teachers automate assignment checking, grading, and feedback. Simplify your academic workflow with instant AI analysis and smart classroom tools.";

    const keywords =
      "GradifyAI, Assignment Checker AI, AI Grading Tool, AI Homework Checker, Education AI, Teacher Dashboard, Student Portal, Online Learning, Smart Evaluation, Gradify Edu";

    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const desc = document.createElement("meta");
      desc.name = "description";
      desc.content = description;
      document.head.appendChild(desc);
    }

    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const keys = document.createElement("meta");
      keys.name = "keywords";
      keys.content = keywords;
      document.head.appendChild(keys);
    }

    // ✅ Open Graph & Twitter Card Tags
    const ogData = [
      { property: "og:title", content: "GradifyAI — AI Assignment Checker" },
      {
        property: "og:description",
        content:
          "Simplify assignments with AI. GradifyAI automates grading, feedback, and class management for teachers and students.",
      },
      { property: "og:image", content: "https://www.gradifyai.online/gradify-cover.png" },
      { property: "og:url", content: "https://www.gradifyai.online/" },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:title", content: "GradifyAI — AI Assignment Checker" },
      {
        property: "twitter:description",
        content:
          "AI-powered assignment checking and grading platform built for teachers and students.",
      },
      { property: "twitter:image", content: "https://www.gradifyai.online/gradify-cover.png" },
      { property: "twitter:site", content: "@GradifyAI" },
    ];

    ogData.forEach(({ property, content }) => {
      const existingTag = document.querySelector(`meta[property="${property}"]`);
      if (existingTag) {
        existingTag.setAttribute("content", content);
      } else {
        const tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.content = content;
        document.head.appendChild(tag);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col justify-center items-center text-white px-6">
      <div className="text-center max-w-2xl">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-4 rounded-2xl shadow-lg">
            <BookCheck size={60} />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Assignment Checker AI
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-white/80 mb-8">
          Simplify your academic workflow — upload, check, and analyze assignments
          instantly using AI-powered evaluation. Manage your classes, track
          progress, and get smart feedback for every submission.
        </p>

        {/* CTA Buttons */}
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

        {/* Footer */}
        <div className="mt-12 text-white/60 text-sm">
          © {new Date().getFullYear()} Assignment Checker — Built for students and
          teachers
        </div>
      </div>
    </div>
  );
};

export default Home;
