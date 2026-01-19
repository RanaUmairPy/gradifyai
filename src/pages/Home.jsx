import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// Lucide icons
import { BookCheck, Brain, CheckCircle, Lightbulb, TrendingUp, UploadCloud, Monitor, MessageSquare } from "lucide-react";

// --- Features Data ---
const marketingFeatures = [
  {
    icon: CheckCircle,
    title: "Instant AI Grading",
    description: "Automate checking for accuracy, style, and structure. Reduce your grading time by up to 90%.",
    color: "text-green-600",
  },
  {
    icon: Lightbulb,
    title: "Actionable Feedback",
    description: "Students receive personalized, constructive tips right away, drastically improving their learning cycle.",
    color: "text-yellow-600",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor class performance, identify struggling students, and track learning outcomes easily and efficiently.",
    color: "text-blue-600",
  },
];

// --- How It Works Data ---
const howItWorksSteps = [
  {
    icon: UploadCloud,
    title: "1. Upload Assignment",
    description: "Teachers upload the assignment file and define the grading rubric once.",
    color: "text-indigo-600",
  },
  {
    icon: Brain,
    title: "2. AI Auto-Evaluation",
    description: "Our intelligent AI processes the submissions instantly against the defined criteria.",
    color: "text-purple-600",
  },
  {
    icon: MessageSquare,
    title: "3. Deliver Feedback",
    description: "Students receive the grade and detailed, constructive feedback immediately.",
    color: "text-red-600",
  },
  {
    icon: Monitor,
    title: "4. Track & Analyze",
    description: "Use the dashboard to monitor class performance and identify areas for improvement.",
    color: "text-teal-600",
  },
];

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750513018123303"
  crossorigin="anonymous"></script>
const Home = () => {
  useEffect(() => {
    // --- SEO Logic (Kept intact and robust) ---
    document.title = "GradifyAI | AI Assignment Checker for Students & Teachers";

    const description =
      "GradifyAI is an AI-powered platform that helps students and teachers automate assignment checking, grading, and feedback. Simplify your academic workflow with instant AI analysis and smart classroom tools.";

    const keywords =
      "GradifyAI, Assignment Checker AI, AI Grading Tool, AI Homework Checker, Education AI, Teacher Dashboard, Student Portal, Online Learning, Smart Evaluation, Gradify Edu, AI for Education";

    const updateMetaTag = (selector, attribute, content) => {
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute(attribute, content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property');
        tag.content = content;
        document.head.appendChild(tag);
      }
    };

    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    // Open Graph & Twitter Card Tags
    const ogData = [
      { property: "og:title", content: "GradifyAI — AI Assignment Checker" },
      { property: "og:description", content: "Simplify assignments with AI. GradifyAI automates grading, feedback, and class management for teachers and students." },
      { property: "og:image", content: "https://www.gradifyai.online/gradify-cover.png" },
      { property: "og:url", content: "https://www.gradifyai.online/" },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:title", content: "GradifyAI — AI Assignment Checker" },
      { property: "twitter:description", content: "AI-powered assignment checking and grading platform built for teachers and students." },
      { property: "twitter:image", content: "https://www.gradifyai.online/gradify-cover.png" },
      { property: "twitter:site", content: "@GradifyAI" },
    ];

    ogData.forEach(({ property, content }) => {
      updateMetaTag(`meta[property="${property}"]`, 'content', content);
    });

  }, []);

  return (
    // Clean, light, professional base with full mobile responsiveness
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">

      {/* Navigation removed to prevent double headers - handled by Base.jsx */}


      <main className="container mx-auto px-4 py-10 sm:py-16">

        {/* ======================= HERO SECTION (The main pitch) ======================= */}
        <section className="text-center max-w-5xl mx-auto mb-20">

          {/* Headline - Premium look with gradient and extra bold font */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight text-gray-900">
            Automate Grading with <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              The AI Assignment Checker
            </span>
          </h1>

          {/* Subtext - Clear value proposition */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            GradifyAI helps teachers save <strong>hours every week</strong> by providing instant, highly accurate grading and <span className="font-semibold text-indigo-600">smart, constructive feedback</span> for every student submission.
          </p>

          {/* Primary CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/signup" // Directing to signup as the primary action
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-5 rounded-xl shadow-2xl shadow-purple-500/50 transition duration-300 transform hover:scale-[1.03] inline-flex items-center justify-center gap-3 text-xl"
            >
              <Brain size={26} /> Try GradifyAI Free Today
            </Link>
          </div>
        </section>

        {/* ======================= FEATURES/VALUE PROPOSITION SECTION ======================= */}
        <section className="mt-16 sm:mt-24 mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Educators Are Choosing AI
          </h2>

          {/* Grid Layout for Features - Professional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {marketingFeatures.map((feature, index) => (
              <div
                key={index}
                // Feature Card: Elevated design with professional border/shadow
                className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-indigo-400 transition duration-300 hover:shadow-2xl hover:border-indigo-600"
              >
                <feature.icon size={36} className={`${feature.color} mb-4`} />
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================= HOW IT WORKS (Working Flow) ======================= */}
        <section className="mt-24 mb-20 bg-white p-10 sm:p-16 rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-14">
            How GradifyAI Works in 4 Simple Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 border-4 border-white shadow-md`}>
                  <step.icon size={32} className={`${step.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* ======================= FINAL CTA BLOCK ======================= */}
        <section className="mt-20 sm:mt-32 text-center bg-indigo-600 p-10 sm:p-16 rounded-3xl shadow-2xl shadow-indigo-500/50">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Simplify Your Grading?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of educators saving hours every week. Setup takes less than 2 minutes.
          </p>
          <Link
            to="/signup"
            // Final CTA: High-impact and inviting
            className="bg-white text-indigo-700 font-extrabold px-10 py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.05] inline-flex items-center gap-2 text-xl"
          >
            <Brain size={22} /> Get Started Now
          </Link>
        </section>

      </main>
    </div>
  );
};

export default Home;