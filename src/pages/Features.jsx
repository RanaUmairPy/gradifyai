import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// Lucide icons for each feature, giving a modern and professional feel
import {
  Sparkles,  // For AI Magic / Core AI
  FileText,   // For Document Analysis
  MessageSquareText, // For Detailed Feedback
  BarChart2,  // For Analytics & Reporting
  Users,      // For Class Management
  ShieldCheck, // For Academic Integrity
  BellRing,   // For Notifications
  Settings,   // For Customization
  Award,      // For Achievement/Recognition
  CalendarCheck, // For Deadline Management
  CloudUpload, // For Easy Uploads
  Globe,      // For Multi-language support (example)
  Zap,        // For Speed/Efficiency
  GraduationCap // General education icon
} from "lucide-react";

// --- Comprehensive Features Data for GradifyAI ---
const allFeatures = [
  {
    icon: Sparkles,
    title: "Intelligent AI Grading Engine",
    description: "Our core AI precisely evaluates assignments against custom rubrics, ensuring fair, consistent, and accurate scoring every time.",
    category: "AI Core",
    color: "text-purple-600",
  },
  {
    icon: MessageSquareText,
    title: "Personalized Instant Feedback",
    description: "Students receive immediate, actionable insights on their submissions, guiding them towards better understanding and improvement.",
    category: "Student Experience",
    color: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Comprehensive Plagiarism Detection",
    description: "Integrates advanced tools to detect plagiarism, ensuring academic integrity and originality in all submissions.",
    category: "Academic Integrity",
    color: "text-red-600",
  },
  {
    icon: BarChart2,
    title: "Advanced Performance Analytics",
    description: "Gain deep insights into class performance, identify common errors, and track individual student progress effortlessly.",
    category: "Teacher Tools",
    color: "text-green-600",
  },
  {
    icon: Users,
    title: "Streamlined Class Management",
    description: "Organize classes, manage student rosters, and distribute assignments with an intuitive, easy-to-use interface.",
    category: "Teacher Tools",
    color: "text-indigo-600",
  },
  {
    icon: CloudUpload,
    title: "Multiple Submission Formats",
    description: "Supports various file types (PDF, DOCX, TXT, etc.) for assignments, offering flexibility for both teachers and students.",
    category: "Usability",
    color: "text-yellow-600",
  },
  {
    icon: CalendarCheck,
    title: "Deadline & Reminder System",
    description: "Set assignment deadlines and send automated reminders to students, ensuring timely submissions.",
    category: "Teacher Tools",
    color: "text-pink-600",
  },
  {
    icon: Settings,
    title: "Customizable Grading Rubrics",
    description: "Create and save your own grading rubrics or modify existing ones to perfectly match your course requirements.",
    category: "Teacher Tools",
    color: "text-orange-600",
  },
  {
    icon: Award,
    title: "Badges & Gamification",
    description: "Motivate students with achievement badges and gamified elements to boost engagement and learning.",
    category: "Student Experience",
    color: "text-amber-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Data Handling",
    description: "All student data and assignments are handled with industry-leading security and privacy protocols.",
    category: "Security & Privacy",
    color: "text-cyan-600",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "GradifyAI is designed to support assignments and feedback in multiple languages, catering to global classrooms.",
    category: "Usability",
    color: "text-teal-600",
  },
  {
    icon: Zap,
    title: "Scalable Performance",
    description: "Handles large volumes of assignments and students effortlessly, making it ideal for institutions of any size.",
    category: "Performance",
    color: "text-fuchsia-600",
  },
];

const Features = () => {
  useEffect(() => {
    // --- SEO Setup for Features Page ---
    document.title = "Features of GradifyAI | AI Grading, Feedback & Class Management";

    const description =
      "Explore the powerful features of GradifyAI, including AI grading, instant feedback, plagiarism detection, class management, and advanced analytics for educators and students.";

    const keywords =
      "GradifyAI features, AI grading features, instant feedback, plagiarism checker, classroom management, student analytics, customizable rubrics, EdTech features, AI for teachers, assignment automation";

    // Helper function for meta tags
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
      { property: "og:title", content: "GradifyAI Features | Automate & Enhance Your Teaching" },
      { property: "og:description", content: "Discover the complete suite of AI-powered tools GradifyAI offers for smarter grading, insightful feedback, and efficient classroom management." },
      { property: "og:image", content: "https://www.gradifyai.online/features-cover.png" }, // Custom image for features
      { property: "og:url", content: "https://www.gradifyai.online/features" },
      { property: "twitter:card", content: "summary_large_image" },
    ];
    
    ogData.forEach(({ property, content }) => {
        updateMetaTag(`meta[property="${property}"]`, 'content', content);
    });

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-10 sm:py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* ======================= HERO SECTION ======================= */}
        <section className="text-center mb-16 p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-b-4 border-indigo-600/80">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                Unlock the Power of <br className="sm:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    AI-Enhanced Education
                </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto">
                GradifyAI is packed with innovative features designed to streamline your workflow, enrich student learning, and elevate your teaching experience.
            </p>
        </section>

        {/* ======================= ALL FEATURES GRID ======================= */}
        <section className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                Comprehensive Tools for Every Need
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {allFeatures.map((feature, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-indigo-300 transform hover:-translate-y-1"
                    >
                        <div className={`p-3 inline-block rounded-xl ${feature.color} bg-opacity-10 mb-4`}>
                            <feature.icon size={32} className={feature.color} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* ======================= KEY HIGHLIGHTS / TESTIMONIALS (Optional, but good for features page) ======================= */}
        {/* You can add a testimonials or a 'how it helps' section here to break up the features grid */}
        <section className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-10 sm:p-16 rounded-3xl shadow-2xl text-center mb-20">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Redefine Your Teaching Experience
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                GradifyAI is more than just a tool; it's your partner in creating an efficient, engaging, and effective learning environment.
            </p>
            <Link
                to="/signup"
                className="bg-white text-indigo-700 font-extrabold px-10 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-xl transform hover:scale-105 inline-block"
            >
                Start Your Free Trial
            </Link>
        </section>

      </div>
    </div>
  );
};

export default Features;