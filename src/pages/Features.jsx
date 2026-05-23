import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, FileText, MessageSquareText, BarChart2, Users,
  ShieldCheck, Settings, CalendarCheck, CloudUpload, Zap,
  GraduationCap, ArrowRight, ScanText, ToggleRight, Copy,
  Brain, PenTool, FileCheck, Layers, Eye, KeyRound, Hash
} from "lucide-react";

// ═══════════════════════════════════════════
//  HERO FEATURES — Key differentiators
// ═══════════════════════════════════════════
const heroFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Auto Grading",
    description: "Our AI engine evaluates each submission against your rubric — analyzing required keywords, minimum word count, content quality, and topic relevance to generate accurate scores instantly.",
    color: "text-violet-600",
    bg: "bg-gradient-to-br from-violet-50 to-indigo-50",
    border: "border-violet-100",
    badge: "Core Feature",
  },
  {
    icon: ScanText,
    title: "OCR — Handwritten Assignment Support",
    description: "Students snap photos of their handwritten work and upload them. Our OCR engine extracts the text automatically, so the AI can grade handwritten submissions just like typed ones.",
    color: "text-amber-600",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-100",
    badge: "New Feature",
  },
  {
    icon: ToggleRight,
    title: "Flexible Checking Modules",
    description: "Teachers choose how each assignment is evaluated: AI Auto-Check for instant results, Manual Teacher Review for hands-on control, or Hybrid Mode where AI grades first and the teacher finalizes.",
    color: "text-emerald-600",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-100",
    badge: "Teacher Control",
  },
  {
    icon: Copy,
    title: "Duplicate Submission Auto-Reject",
    description: "If a student submits the same assignment that another student already submitted, the system automatically detects and rejects it — preventing copy-paste cheating across the class.",
    color: "text-rose-600",
    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    border: "border-rose-100",
    badge: "Anti-Cheat",
  },
];

// ═══════════════════════════════════════════
//  ALL FEATURES — Only real/actual features
// ═══════════════════════════════════════════
const allFeatures = [
  {
    icon: Sparkles,
    title: "Keyword & Content Analysis",
    description: "AI checks if the student covered the required keywords and met the minimum word count set by the teacher for each assignment.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: MessageSquareText,
    title: "AI-Generated Feedback",
    description: "Each submission gets detailed AI feedback explaining the score, pointing out what was good and what needs improvement.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Eye,
    title: "Teacher Score Override",
    description: "Teachers can review the AI score and override it with their own grade. The final decision always stays with the teacher.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: CloudUpload,
    title: "File Upload Submissions",
    description: "Students upload assignments as PDF, DOCX, or TXT files. Scanned handwritten photos (JPG/PNG) are also supported via OCR processing.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Class & Student Management",
    description: "Teachers create classrooms and share a unique code. Students join using that code. Full roster management with student stats.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: CalendarCheck,
    title: "Deadline Enforcement",
    description: "Set deadlines for each assignment. The system tracks submission timing and shows students whether the deadline has passed.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Settings,
    title: "Custom Assignment Setup",
    description: "Configure max marks, minimum word count, required keywords, and attach reference files — all per assignment.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: BarChart2,
    title: "Student Performance Stats",
    description: "View per-student analytics: how many assignments submitted, how many graded, and their average score across the class.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Layers,
    title: "Teacher File Attachments",
    description: "Teachers can attach question papers, rubric documents, or reference PDFs directly to an assignment for students to download.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: KeyRound,
    title: "Secure Authentication",
    description: "JWT-based login system with access and refresh tokens. Passwords are hashed. Email verification via OTP before account activation.",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

// ═══════════════════════════════════════════
//  CHECKING MODULES — 3 modes
// ═══════════════════════════════════════════
const checkingModules = [
  {
    icon: Brain,
    title: "AI Auto-Check",
    description: "The AI evaluates the assignment automatically based on rubric, keywords, and content. Grades and feedback are generated instantly.",
    color: "from-violet-600 to-indigo-600",
    steps: ["Student submits assignment", "AI analyzes content & keywords", "Score & feedback generated", "Results visible to student"],
  },
  {
    icon: PenTool,
    title: "Manual Teacher Review",
    description: "Teacher reviews each submission manually and assigns scores. Best for subjective or creative assignments.",
    color: "from-emerald-600 to-teal-600",
    steps: ["Student submits assignment", "Teacher downloads & reviews", "Teacher assigns manual score", "Teacher writes feedback"],
  },
  {
    icon: FileCheck,
    title: "Hybrid Mode",
    description: "AI grades first, then the teacher reviews and can adjust the score. Speed of AI + authority of the teacher.",
    color: "from-amber-500 to-orange-600",
    steps: ["Student submits assignment", "AI generates initial score", "Teacher reviews AI grade", "Teacher finalizes the score"],
  },
];

const Features = () => {
  useEffect(() => {
    document.title = "Features of GradifyAI | AI Grading, OCR, & Class Management";
    const description = "Explore GradifyAI's features: AI auto-grading, OCR for handwritten assignments, duplicate submission detection, flexible checking modules, and complete class management.";
    const keywords = "GradifyAI features, AI grading, OCR handwritten, duplicate detection, teacher review, hybrid grading, classroom management, assignment automation";
    const updateMetaTag = (selector, attribute, content) => {
      let tag = document.querySelector(selector);
      if (tag) { tag.setAttribute(attribute, content); }
      else { tag = document.createElement("meta"); tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property'); tag.content = content; document.head.appendChild(tag); }
    };
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);
    [
      { property: "og:title", content: "GradifyAI Features | AI Grading, OCR & Smart Tools" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/features" },
    ].forEach(({ property, content }) => updateMetaTag(`meta[property="${property}"]`, 'content', content));
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">

        {/* ════════════ HERO ════════════ */}
        <section className="relative text-center mb-10 sm:mb-14 p-6 sm:p-10 lg:p-14 bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Real Features — No Gimmicks
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              Everything You Need for
              <br className="hidden sm:block" />
              <span className="gradient-text"> Smarter Grading</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              AI scoring, handwritten OCR, duplicate detection, flexible checking modules, and full classroom management — all in one platform.
            </p>
          </div>
        </section>

        {/* ════════════ HERO FEATURE CARDS ════════════ */}
        <section className="mb-10 sm:mb-14">
          <div className="text-center mb-8">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">What Sets Us Apart</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Key Platform Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {heroFeatures.map((f, i) => (
              <div key={i} className={`group relative ${f.bg} border ${f.border} rounded-2xl p-5 sm:p-7 card-hover overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${i * 0.08}s` }}>
                {/* Badge */}
                <span className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500">
                  {f.badge}
                </span>

                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm border border-white/80 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 pr-20">{f.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════ CHECKING MODULES ════════════ */}
        <section className="mb-10 sm:mb-14 animate-fade-in-up animation-delay-100">
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-5 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            <div className="text-center mb-7 sm:mb-9">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
                <ToggleRight className="w-3.5 h-3.5" /> Teacher Controlled
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1.5">Assignment Checking Modules</h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">Teacher decides how each assignment gets checked</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {checkingModules.map((m, i) => (
                <div key={i} className="relative bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className={`absolute top-0 left-5 right-5 h-0.5 rounded-b-full bg-gradient-to-r ${m.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r ${m.color} flex items-center justify-center mb-4 shadow-md`}>
                    <m.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{m.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">{m.description}</p>

                  <div className="space-y-2">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">How it works</p>
                    {m.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${m.color} flex items-center justify-center shrink-0`}>
                          <span className="text-[9px] font-bold text-white">{j + 1}</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ OCR BANNER ════════════ */}
        <section className="mb-10 sm:mb-14 animate-fade-in-up animation-delay-200">
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-premium">
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-5 lg:gap-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0">
                <ScanText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <div className="text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2.5 border border-white/10">
                  ✨ OCR Technology
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2">Handwritten Assignments? No Problem.</h2>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Students snap photos of their handwritten work and upload them. Our OCR engine extracts the text and the AI grades it using the same keyword, word count, and content analysis pipeline.
                </p>
              </div>
            </div>

            {/* Steps — responsive grid */}
            <div className="relative z-10 mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {["Upload Photo", "OCR Extracts Text", "AI Grades Content", "Teacher Reviews"].map((step, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-white/90 font-medium text-[10px] sm:text-xs">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ ALL FEATURES GRID ════════════ */}
        <section className="mb-10 sm:mb-14">
          <div className="text-center mb-7 sm:mb-9">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Platform Capabilities</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">All Built-In Features</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">Every feature listed here is real and working in GradifyAI</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {allFeatures.map((f, i) => (
              <div key={i} className="group bg-white p-5 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300 border border-slate-100/50`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Features;