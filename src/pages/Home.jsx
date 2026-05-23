import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain, CheckCircle, UploadCloud, MessageSquare, ArrowRight,
  Sparkles, ScanText, Copy, Eye, Users, Settings, CalendarCheck,
  ToggleRight, GraduationCap, BookOpen, PenTool, FileCheck,
  KeyRound, CloudUpload, BarChart2
} from "lucide-react";

// ═══════════════════════════════════════
//  HOW IT WORKS — Actual system flow
// ═══════════════════════════════════════
const howItWorksSteps = [
  {
    icon: Settings,
    title: "Teacher Creates Assignment",
    description: "Set title, description, max marks, required keywords, minimum word count, deadline, and attach reference files.",
    step: "01",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: CloudUpload,
    title: "Student Uploads Submission",
    description: "Submit assignment as PDF, DOCX, or TXT. Handwritten? Snap a clear photo (JPG/PNG) — OCR extracts the text.",
    step: "02",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Brain,
    title: "AI Evaluates Content",
    description: "AI analyzes the submission against the rubric — checking keywords, word count, content quality — and generates a score with feedback.",
    step: "03",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Eye,
    title: "Teacher Reviews & Finalizes",
    description: "Teacher can view AI scores, override with manual grades, or use the hybrid mode. Final decision is always the teacher's.",
    step: "04",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

// ═══════════════════════════════════════
//  CORE FEATURES — Only real ones
// ═══════════════════════════════════════
const coreFeatures = [
  {
    icon: Brain,
    title: "AI Auto-Grading",
    description: "Assignments are evaluated by AI based on keywords, word count, and content quality defined by the teacher.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: ScanText,
    title: "OCR for Handwritten Work",
    description: "Students snap photos of handwritten assignments. Our OCR engine extracts text so the AI can grade them normally.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Copy,
    title: "Duplicate Auto-Reject",
    description: "If a student submits the same assignment another student already submitted, it gets automatically detected and rejected.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: MessageSquare,
    title: "AI-Generated Feedback",
    description: "Each submission gets detailed AI feedback explaining the score — what was good and what needs improvement.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: ToggleRight,
    title: "Flexible Checking Modes",
    description: "Teachers choose: AI auto-check, manual review, or hybrid mode where AI grades first and the teacher finalizes.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Eye,
    title: "Teacher Score Override",
    description: "Teachers can review AI scores and override them. The final grade is always in the teacher's control.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

// ═══════════════════════════════════════
//  PLATFORM HIGHLIGHTS — Quick facts
// ═══════════════════════════════════════
const platformHighlights = [
  { icon: Users, text: "Class management with unique join codes" },
  { icon: CalendarCheck, text: "Deadline tracking & enforcement" },
  { icon: BarChart2, text: "Per-student performance analytics" },
  { icon: CloudUpload, text: "PDF, DOCX, TXT & scanned photo uploads" },
  { icon: Settings, text: "Custom rubrics per assignment" },
  { icon: KeyRound, text: "Secure JWT auth with OTP verification" },
];

// ═══════════════════════════════════════
//  WHO IS IT FOR — Real use cases
// ═══════════════════════════════════════
const userTypes = [
  {
    title: "For Teachers",
    icon: PenTool,
    color: "from-violet-600 to-indigo-600",
    items: [
      "Create classrooms & share join codes",
      "Create assignments with custom rubrics",
      "Choose AI, Manual, or Hybrid grading",
      "View student stats & override scores",
      "Attach reference files to assignments",
    ],
  },
  {
    title: "For Students",
    icon: BookOpen,
    color: "from-emerald-600 to-teal-600",
    items: [
      "Join classes using teacher's code",
      "Upload assignments (typed or handwritten)",
      "Get instant AI scores & feedback",
      "View submission status & grades",
      "Track deadlines for each assignment",
    ],
  },
];

const Home = () => {
  useEffect(() => {
    document.title = "GradifyAI | AI Assignment Checker for Students & Teachers";
    const description = "GradifyAI is an AI-powered platform that automates assignment grading, provides instant feedback, supports handwritten OCR, and offers flexible teacher-controlled checking modules.";
    const keywords = "GradifyAI, AI assignment checker, AI grading tool, OCR handwritten, teacher dashboard, student portal, assignment automation, education AI, classroom management";
    const updateMetaTag = (selector, attribute, content) => {
      let tag = document.querySelector(selector);
      if (tag) { tag.setAttribute(attribute, content); }
      else { tag = document.createElement("meta"); tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property'); tag.content = content; document.head.appendChild(tag); }
    };
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);
    [
      { property: "og:title", content: "GradifyAI — AI Assignment Checker" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/" },
      { property: "twitter:card", content: "summary_large_image" },
    ].forEach(({ property, content }) => updateMetaTag(`meta[property="${property}"]`, 'content', content));
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative text-center max-w-5xl mx-auto pt-6 sm:pt-14 pb-14 sm:pb-20 px-4 animate-fade-in-up">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-br from-violet-200/40 via-indigo-200/30 to-purple-100/20 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 text-violet-700 dark:text-violet-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Assignment Checker
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-[1.1] tracking-tight text-slate-900 dark:text-white">
          Automate Assignment{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">Checking with AI</span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          GradifyAI helps teachers <strong className="text-slate-700 dark:text-slate-200">grade assignments instantly</strong> using AI — with support for{" "}
          <span className="text-violet-600 dark:text-violet-400 font-semibold">typed & handwritten submissions</span>, teacher-controlled checking modules, and built-in duplicate detection.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link to="/signup" className="btn-primary !px-7 !py-3.5 sm:!px-8 sm:!py-4 !text-sm sm:!text-base inline-flex items-center gap-2.5 !rounded-xl sm:!rounded-2xl">
            <GraduationCap className="w-5 h-5" /> Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/features" className="btn-secondary !px-7 !py-3.5 sm:!px-8 sm:!py-4 !text-sm sm:!text-base inline-flex items-center gap-2 !rounded-xl sm:!rounded-2xl">
            Explore Features
          </Link>
        </div>

        {/* Quick platform highlights instead of fake stats */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {platformHighlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <h.icon className="w-4 h-4 text-violet-500 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 leading-tight">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CORE FEATURES ═══════════════ */}
      <section className="mb-14 sm:mb-20 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">What GradifyAI Does</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Core Platform Features</h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">Every feature listed here is real and working in the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {coreFeatures.map((f, i) => (
            <div key={i}
              className={`group bg-white p-5 sm:p-7 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="mb-14 sm:mb-20 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 p-5 sm:p-10 lg:p-12 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">Step by Step</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">How GradifyAI Works</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">From assignment creation to final grading — here's the actual workflow</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="relative text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Connector line - desktop */}
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-slate-200 to-transparent" />
                )}

                <div className="relative inline-block mb-4">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <step.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${step.color}`} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-violet-500/30">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHO IS IT FOR ═══════════════ */}
      <section className="mb-14 sm:mb-20 px-4">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Built for Both Sides</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Teachers & Students</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">Here's exactly what each user can do on the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {userTypes.map((type, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 sm:p-7 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type.color}`} />

              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center shadow-md`}>
                  <type.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{type.title}</h3>
              </div>

              <ul className="space-y-3">
                {type.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ OCR HIGHLIGHT ═══════════════ */}
      <section className="mb-14 sm:mb-20 px-4 animate-fade-in-up">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-premium">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0">
              <ScanText className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/10">
                ✨ OCR Technology
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-1.5">Handwritten Assignments Supported</h3>
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                Students snap photos of their handwritten work and upload them. Our OCR engine extracts the text and the AI grades it with the same keyword, word count, and content analysis pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;