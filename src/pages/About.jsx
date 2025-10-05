import React, { useEffect } from "react";
import { Brain, Users, Target, Rocket } from "lucide-react";

const About = () => {
  useEffect(() => {
    // ✅ Basic SEO metadata setup
    document.title = "About GradifyAI | AI Assignment Checker & Class Management";

    const description =
      "Learn about GradifyAI — an AI-powered academic assistant built to simplify assignment checking, grading, and classroom management for teachers and students.";

    const keywords =
      "GradifyAI, AI Assignment Checker, AI Grading, Educational Technology, Online Learning, Teacher Dashboard, Student Portal, Assignment Evaluation, Gradify Edu";

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

    // ✅ Optional Open Graph Tags
    const ogTitle = "About GradifyAI | Empowering Teachers & Students with AI";
    const ogDescription =
      "Discover how GradifyAI uses AI to make assignment checking, grading, and classroom management smarter and easier.";
    const ogImage = "https://www.gradifyai.online/gradify-cover.png";
    const ogUrl = "https://www.gradifyai.online/about";

    const createMeta = (property, content) => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", property);
      tag.content = content;
      document.head.appendChild(tag);
    };

    createMeta("og:title", ogTitle);
    createMeta("og:description", ogDescription);
    createMeta("og:image", ogImage);
    createMeta("og:url", ogUrl);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100 p-10">
        <h1 className="text-4xl font-extrabold text-indigo-700 text-center mb-6">
          About <span className="text-gray-800">GradifyAI</span>
        </h1>

        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-12">
          GradifyAI is an <strong>AI-powered academic assistant</strong> designed
          to help teachers and students automate assignment checking, feedback,
          and grading — making education smarter, faster, and more effective.
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 hover:shadow-md transition-all">
            <Brain className="w-10 h-10 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To empower educators and learners through AI tools that reduce
              manual effort, provide instant feedback, and promote efficient,
              personalized learning experiences.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 hover:shadow-md transition-all">
            <Target className="w-10 h-10 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To become the most trusted AI platform in education — bridging
              technology and learning through automation, intelligence, and
              simplicity.
            </p>
          </div>
        </div>

        {/* Team / Founder Section */}
        <div className="mt-16 text-center">
          <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            Built for Teachers & Students
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Whether you’re teaching or learning, GradifyAI is built to make
            academic life simpler. Teachers can manage classes, track
            assignments, and give feedback — while students can join, submit, and
            learn effortlessly.
          </p>

          {/* 👇 Founder LinkedIn */}
          <div className="mt-6">
            <p className="text-gray-600 mb-2 font-medium">Founder:</p>
            <a
              href="https://www.linkedin.com/in/umair-saeed-5659a8340/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline transition-all"
            >
              Umair Saeed — LinkedIn Profile
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-10 text-center shadow-lg">
          <Rocket className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            Join the Future of Education 🚀
          </h2>
          <p className="text-white/90 mb-6">
            Experience AI-powered assignment management. Simplify your teaching
            and learning journey with GradifyAI.
          </p>
          <a
            href="/signup"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
