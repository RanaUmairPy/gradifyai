import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// Lucide icons
import { Brain, Users, Target, Rocket, Clock, Zap, BarChart3, HeartHandshake } from "lucide-react";

// --- Core Pillars Data ---
const corePillars = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Automate grading and feedback to reduce educators' manual workload by up to 90%.",
    color: "text-red-600",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Provide students with immediate, targeted insights for continuous learning and rapid improvement.",
    color: "text-yellow-600",
  },
  {
    icon: BarChart3,
    title: "Unbiased Grading",
    description: "Utilize consistent AI rubrics to ensure fair, transparent, and objective evaluations every time.",
    color: "text-teal-600",
  },
];

// --- Impact Metrics ---
const impactMetrics = [
    { value: "90%", label: "Time Saved on Grading" },
    { value: "20+", label: "Features Implemented" },
    { value: "5/5", label: "Educator Satisfaction" },
];

const About = () => {
  useEffect(() => {
    // ✅ Robust SEO Setup (Kept intact)
    document.title = "About GradifyAI | The Future of AI-Powered Education";

    const description =
      "Learn about GradifyAI — the AI-powered academic assistant dedicated to simplifying assignment checking, grading, and classroom management for modern education.";

    const keywords =
      "GradifyAI, AI Assignment Checker, AI Grading, Educational Technology, Online Learning, Teacher Dashboard, Student Portal, Assignment Evaluation, EdTech, Umair Saeed";

    // Helper function to manage meta tags
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

    // Open Graph Tags
    const ogData = [
      { property: "og:title", content: "About GradifyAI | Empowering Teachers & Students with AI" },
      { property: "og:description", content: "Discover how GradifyAI uses AI to make assignment checking, grading, and classroom management smarter and easier." },
      { property: "og:image", content: "https://www.gradifyai.online/gradify-cover.png" },
      { property: "og:url", content: "https://www.gradifyai.online/about" },
      { property: "twitter:card", content: "summary_large_image" },
    ];
    
    ogData.forEach(({ property, content }) => {
        updateMetaTag(`meta[property="${property}"]`, 'content', content);
    });

  }, []);

  return (
    // Base container: Premium look with mobile-friendly vertical padding
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-10 sm:py-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ======================================================= */}
        {/* HERO SECTION: The Core Story */}
        {/* ======================================================= */}
        <div className="text-center mb-12 sm:mb-16 p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-b-4 border-purple-500/80">
            <p className="text-xs sm:text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">
                Our Foundation
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-snug">
                The Story Behind <span className="font-extrabold">GradifyAI</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto">
                We believe the future of education lies in <span className="font-extrabold">empowering the educator</span>. GradifyAI was born from the need to eliminate repetitive tasks, giving teachers back the time and energy to focus on what truly matters: <span className="font-extrabold">mentoring and inspiring students</span>.
            </p>
        </div>

        {/* --- */}

        {/* ======================================================= */}
        {/* IMPACT AND STATISTICS (Driving Real Change - Optimized) */}
        {/* ======================================================= */}
        <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                Driving Real Change
            </h2>
            {/* Optimized for mobile: Grid stacks to single column, added shadow for premium look */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 bg-indigo-700 text-white p-6 sm:p-8 rounded-2xl shadow-2xl">
                {/* Mobile optimization: Grid columns stack on small screens */}
                {impactMetrics.map((metric, index) => (
                    <div 
                        key={index} 
                        // On small screens, border only appears on bottom for separation
                        className="text-center p-3 border-b sm:border-r last:border-b-0 last:sm:border-r-0 border-white/20"
                    >
                        <p className="text-4xl sm:text-5xl font-extrabold mb-1">
                            {metric.value}
                        </p>
                        <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-indigo-200">
                            {metric.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* --- */}

        {/* ======================================================= */}
        {/* MISSION & PILLARS (Mobile: Mission takes full width, Pillars stack) */}
        {/* ======================================================= */}
        <div className="mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">
                Our Guiding Principles
            </h2>
            
            {/* Grid Layout: Columns adjust based on screen size */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                
                {/* Mission Card: Takes full width on mobile, 2/4 on larger screens */}
                <div className="lg:col-span-2 bg-indigo-600 text-white p-6 sm:p-10 rounded-2xl shadow-2xl border-b-4 border-purple-400">
                    <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-3" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        Our Mission
                    </h3>
                    <p className="text-indigo-100 leading-relaxed text-sm sm:text-base">
                        To simplify assignment workflows for educators globally, providing <span className="font-extrabold">unmatched efficiency and accuracy</span> through intelligent automation.
                    </p>
                </div>

                {/* Core Pillars Cards: Stack vertically on mobile, turn into 3 columns on larger screens */}
                {corePillars.map((pillar, index) => (
                    <div 
                        key={index} 
                        className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
                    >
                        <div className={`p-3 inline-block rounded-xl ${pillar.color} bg-opacity-10 mb-3`}>
                            <pillar.icon size={24} className={pillar.color} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {pillar.title}
                        </h3>
                        <p className="text-gray-600 text-xs">{pillar.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* --- */}

        {/* ======================================================= */}
        {/* FOUNDER / TEAM SECTION */}
        {/* ======================================================= */}
        <div className="p-8 sm:p-10 bg-white border border-gray-200 rounded-3xl text-center shadow-lg mb-16">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Meet the Founder: Umair Saeed
            </h2>
            <p className="text-sm sm:text-lg text-gray-700 max-w-4xl mx-auto mb-6">
                GradifyAI is rooted in a deep understanding of academic needs. Our focus remains on <span className="font-extrabold">utility, reliability, and academic integrity</span>, ensuring the tool truly supports the learning ecosystem.
            </p>

            {/* Founder Link */}
            <div className="mt-4">
                <a
                href="https://www.linkedin.com/in/umair-saeed-5659a8340/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-bold text-base sm:text-xl hover:text-indigo-800 transition-all border-b-2 border-indigo-600 hover:border-indigo-800"
                >
                    <HeartHandshake size={20} /> Connect on LinkedIn
                </a>
            </div>
        </div>
        
        {/* --- */}

        {/* ======================================================= */}
        {/* FINAL CTA SECTION (Call to Action) */}
        {/* ======================================================= */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-16 text-center shadow-2xl">
          <Rocket className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Join the Education Revolution Today
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-6 max-w-3xl mx-auto">
            Experience the efficiency, precision, and freedom that AI-powered assignment management provides. Start saving hours every week.
          </p>
          <Link
            to="/signup"
            className="bg-white text-purple-700 font-extrabold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-2xl hover:bg-gray-100 transition-all text-lg sm:text-xl transform hover:scale-105 inline-block"
          >
            Start Free Trial
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;