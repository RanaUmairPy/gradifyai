import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain, Users, Target, Rocket, GraduationCap, Code2, Server,
  Lightbulb, Eye, ScanText, Copy, ToggleRight, CheckCircle,
  HeartHandshake, ArrowRight, Sparkles, BookOpen, Layers,
  Linkedin, Github
} from "lucide-react";

// ═══════════════════════════════════════
//  PROJECT GOALS
// ═══════════════════════════════════════
const projectGoals = [
  {
    icon: Brain,
    title: "Automate Grading with AI",
    description: "Reduce the manual effort of checking each assignment by letting AI handle the scoring based on teacher-defined rubrics.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: ScanText,
    title: "Support Handwritten Submissions",
    description: "Enable students to scan handwritten assignments by uploading photos, with OCR extracting text for AI-powered evaluation.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: ToggleRight,
    title: "Give Teachers Full Control",
    description: "Let teachers choose their preferred checking method — AI auto-check, manual review, or a hybrid approach.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Copy,
    title: "Prevent Academic Dishonesty",
    description: "Automatically detect and reject duplicate submissions to maintain fairness and originality in assessments.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

// ═══════════════════════════════════════
//  TEAM MEMBERS
// ═══════════════════════════════════════
const teamMembers = [
  {
    name: "Umair Saeed",
    role: "Backend Developer",
    description: "Designed and built the entire backend architecture: Django REST APIs, AI grading engine, OCR integration, database models, JWT authentication, and the assignment evaluation pipeline.",
    icon: Server,
    color: "from-emerald-600 to-teal-600",
    bgGlow: "bg-emerald-500/10",
    linkedin: "https://www.linkedin.com/in/umair-saeed-5659a8340/",
    github: "https://github.com/UmairSaeed-oss",
    pic: "/WhatsApp Image 2026-05-11 at 5.39.25 PM.jpeg",
    contributions: ["Django REST APIs", "AI Grading Logic", "OCR Integration", "Database Design", "Authentication System"],
  },
  {
    name: "Muzammal Ikhlaq",
    role: "Frontend Developer & Mobile App Developer",
    description: "Built the complete user interface: responsive React components, premium UI/UX design, teacher & student dashboards, real-time state management, and seamless API integration.",
    icon: Code2,
    color: "from-violet-600 to-indigo-600",
    bgGlow: "bg-violet-500/10",
    linkedin: "https://www.linkedin.com/in/muzammal-ikhlaq",
    github: "https://github.com/muzammal-ikhlaq",
    pic: "\Muzammal.jpeg",
    contributions: ["React UI Components", "Responsive Design", "Dashboard Interfaces", "API Integration", "Mobile App Developer"],
  },
];

// ═══════════════════════════════════════
//  WHAT WE BUILT — Platform capabilities
// ═══════════════════════════════════════
const platformCapabilities = [
  "AI-powered assignment scoring using keywords, word count, and content analysis",
  "OCR engine for grading handwritten scanned assignments",
  "Three checking modules: AI Auto-Check, Manual Review, Hybrid Mode",
  "Automatic duplicate submission detection and rejection",
  "Teacher score override — final grade control stays with the teacher",
  "AI-generated detailed feedback for every submission",
  "Class management with unique join codes for students",
  "Custom assignment configuration: max marks, keywords, word limits, deadlines",
  "Per-student analytics: submitted, graded, and average scores",
  "Secure JWT authentication with email OTP verification",
];

const About = () => {
  useEffect(() => {
    document.title = "About GradifyAI | AI-Powered Assignment Checking Platform";
    const description = "GradifyAI is a professional platform that automates assignment grading using AI, supports handwritten OCR, offers flexible checking modules, and provides complete classroom management.";
    const keywords = "GradifyAI, about, AI grading, assignment checker, Umair Saeed, Muzammal Ikhlaq, education technology, OCR";
    const updateMetaTag = (selector, attribute, content) => {
      let tag = document.querySelector(selector);
      if (tag) { tag.setAttribute(attribute, content); }
      else { tag = document.createElement("meta"); tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property'); tag.content = content; document.head.appendChild(tag); }
    };
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);
    [
      { property: "og:title", content: "About GradifyAI | AI Assignment Checking Platform" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/about" },
    ].forEach(({ property, content }) => updateMetaTag(`meta[property="${property}"]`, 'content', content));
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative text-center mb-10 sm:mb-14 p-6 sm:p-10 lg:p-14 bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-5">
              <GraduationCap className="w-3.5 h-3.5" /> AI Education Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              The Story Behind <span className="gradient-text">GradifyAI</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              GradifyAI is an <strong className="text-slate-700">AI-powered assignment checking and grading platform</strong> engineered for modern classrooms. It helps teachers automate grading, support handwritten submissions via OCR, and gives full control over checking methods: while students get instant AI feedback on every submission.
            </p>
          </div>
        </section>

        {/* ═══════════════ MISSION + VISION ═══════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-14">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-6 sm:p-8 rounded-2xl shadow-premium animate-fade-in-up">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4 border border-white/10">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-violet-100 text-sm leading-relaxed">
                To build a smart, practical tool that <span className="font-bold text-white">reduces the manual burden of assignment grading</span> for teachers while ensuring students receive instant, constructive feedback — making the evaluation process faster, fairer, and more transparent for everyone involved.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-2xl shadow-premium animate-fade-in-up animation-delay-100">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4 border border-white/10">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Our Vision</h2>
              <p className="text-emerald-100 text-sm leading-relaxed">
                To become a <span className="font-bold text-white">reliable educational technology solution</span> that empowers institutions to adopt AI-assisted grading at scale — supporting multiple assignment formats including handwritten work, and maintaining academic integrity through intelligent anti-cheat mechanisms.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ PROJECT GOALS ═══════════════ */}
        <section className="mb-10 sm:mb-14">
          <div className="text-center mb-7 sm:mb-9">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">Why We Built This</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">Project Goals</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">The core problems GradifyAI was designed to solve</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {projectGoals.map((g, i) => (
              <div key={i} className="group bg-white p-5 sm:p-6 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${g.bg} border ${g.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <g.icon className={`w-5 h-5 ${g.color}`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">{g.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{g.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ WHAT WE BUILT ═══════════════ */}
        <section className="mb-10 sm:mb-14 animate-fade-in-up">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 p-5 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
                <CheckCircle className="w-3.5 h-3.5" /> Real Capabilities
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1.5">What We Built</h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">Every capability listed here is implemented and working</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {platformCapabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TEAM ═══════════════ */}
        <section className="mb-10 sm:mb-14">
          <div className="text-center mb-7 sm:mb-9">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">The People Behind It</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">Meet the Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card border border-slate-100 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${member.color}`} />

                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    {member.pic ? (
                      <img 
                        src={member.pic} 
                        alt={member.name} 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md shrink-0 border-2 border-slate-100 ring-4 ring-slate-50 transition-transform duration-300 hover:scale-105"
                        style={{ 
                          imageRendering: "-webkit-optimize-contrast",
                          backfaceVisibility: "hidden",
                          transform: "translateZ(0)"
                        }}
                      />
                    ) : (
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-r ${member.color} flex items-center justify-center shadow-md shrink-0 border-2 border-white ring-4 ring-slate-50`}>
                        <member.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mb-1">{member.name}</h3>
                      <p className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3`}>
                        {member.role}
                      </p>
                      
                      {/* Social Links */}
                      <div className="flex flex-wrap gap-2">
                        {member.linkedin && member.linkedin !== "#" && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all duration-300">
                            <Linkedin className="w-3.5 h-3.5 text-sky-600" /> LinkedIn
                          </a>
                        )}
                        {member.github && member.github !== "#" && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-800 transition-all duration-300">
                            <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio / Description */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {member.description}
                    </p>
                  </div>

                  {/* Key Contributions */}
                  {member.contributions && member.contributions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-100">
                      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Contributions</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {member.contributions.map((contribution, index) => (
                          <span key={index} className="inline-flex items-center text-[10px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100 font-medium">
                            {contribution}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ PROJECT CONTEXT ═══════════════ */}
        <section className="mb-8 sm:mb-12 animate-fade-in-up">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-premium">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white/90" />
              </div>
              <div className="text-center lg:text-left flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2">Transforming Classroom Workflows</h2>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  GradifyAI is engineered to demonstrate how artificial intelligence can be practically and securely applied to modern education. The platform represents a next-generation academic checking ecosystem, combining cutting-edge web technologies with intelligent automation to build a highly scalable, reliable solution.
                </p>
              </div>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-violet-700 font-extrabold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-sm sm:text-base shrink-0">
                Try GradifyAI <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;