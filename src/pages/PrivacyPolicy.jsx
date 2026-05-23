import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Lock, KeyRound, Cpu, Database, UserCheck,
  ServerCog, Globe, Mail, CheckCircle, ArrowRight, FileText,
  Sparkles, ShieldAlert, FileCheck
} from "lucide-react";

// ═══════════════════════════════════════
//  REAL SECURITY CAPABILITIES (Trust Badges)
// ═══════════════════════════════════════
const trustFeatures = [
  {
    icon: Lock,
    title: "Strong Password Hashing",
    description: "Passwords are mathematically hashed using advanced algorithms before storage. We never store or transmit plaintext passwords.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    borderColor: "border-violet-100",
  },
  {
    icon: KeyRound,
    title: "Encrypted JWT Tokens",
    description: "Every user session is authenticated via secure JSON Web Tokens (JWT) to ensure stateless, secure, and isolated API access.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    icon: Database,
    title: "Classroom Scope Isolation",
    description: "Student submissions, manual overrides, and custom rubrics are completely inaccessible to anyone outside your specific classroom code.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: Cpu,
    title: "No Public LLM Training",
    description: "Uploaded assignment documents and extracted handwritten OCR texts are used solely for your scoring. They never train public AI models.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    borderColor: "border-amber-100",
  },
];

// ═══════════════════════════════════════
//  POLICY SECTIONS (Premium Card Layout)
// ═══════════════════════════════════════
const policyCards = [
  {
    icon: UserCheck,
    title: "1. Information We Securely Collect",
    accent: "from-violet-500 to-indigo-600",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    items: [
      {
        label: "Account Profile Credentials",
        text: "When registering as a Teacher or Student, we collect your full name, authenticated email address, account role, and an encrypted password hash."
      },
      {
        label: "Uploaded Assignments & OCR Files",
        text: "We collect files uploaded for grading (PDF, DOCX, TXT) as well as scanned handwritten assignment pages to perform text extraction via OCR."
      },
      {
        label: "Custom Grading Rubrics",
        text: "We securely persist assignment titles, passing requirements, target word counts, specific required keywords, maximum score limits, and strict deadlines."
      },
      {
        label: "Evaluated Feedback & Scores",
        text: "We store the AI-calculated grading outcomes, detailed feedback breakdown, submission status timestamps, and teacher manual score overrides."
      }
    ]
  },
  {
    icon: ServerCog,
    title: "2. How We Use Your Information",
    accent: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    items: [
      {
        label: "Running the Evaluation Engine",
        text: "Your uploaded content is parsed to evaluate content structure, extract text from handwritten images, count words, and verify specified keywords."
      },
      {
        label: "Duplicate Auto-Rejection Check",
        text: "To uphold fairness and academic integrity, submissions are analyzed to instantly flag and reject identical duplicate uploads within the same class."
      },
      {
        label: "Dashboard Performance Metrics",
        text: "Aggregated numeric scores and grading throughput statistics are organized to render real-time progression graphs for authorized classroom instructors."
      },
      {
        label: "Crucial Service Security Updates",
        text: "We utilize email channels strictly to issue OTP verification tokens, execute password reset flows, and communicate critical platform maintenance notices."
      }
    ]
  },
  {
    icon: ShieldCheck,
    title: "3. Complete Security & Access Control",
    accent: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    items: [
      {
        label: "End-to-End API Security",
        text: "All incoming and outgoing web traffic is encrypted using industry-standard TLS/SSL protocols to prevent man-in-the-middle network tampering."
      },
      {
        label: "Strict Database Authorization",
        text: "Submissions stay strictly linked to corresponding student IDs and target assignments. Unauthorized token requests are explicitly intercepted and rejected."
      },
      {
        label: "Secure Temporary Storage",
        text: "Processed documents and extracted textual contents are held in restricted server paths and are not indexed by any search engine or public gateway."
      }
    ]
  },
  {
    icon: Globe,
    title: "4. Information Sharing & Third Parties",
    accent: "from-amber-500 to-orange-600",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    items: [
      {
        label: "Zero Selling Guarantee",
        text: "GradifyAI firmly adheres to an absolute zero-selling standard. We do not sell, rent, or package student info or evaluation records for advertisers."
      },
      {
        label: "Secure Cloud Subprocessors",
        text: "Our core API servers and processing databases operate on top-tier, compliant cloud providers committed to stringent data isolation standards."
      },
      {
        label: "Required Statutory Disclosure",
        text: "We will only share targeted records if explicitly mandated by formal, verified legal warrants or enforceable orders from a legitimate jurisdiction."
      }
    ]
  },
  {
    icon: Mail,
    title: "5. User Control & Data Protection Rights",
    accent: "from-rose-500 to-purple-600",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    items: [
      {
        label: "Record Transparency",
        text: "Users hold standard rights to access their complete historical submission records, inspect grading timelines, or modify profile particulars."
      },
      {
        label: "Educator Classroom Discretion",
        text: "Teachers maintain total executive authority over their hosted classroom codes, score modification properties, and student roster access."
      },
      {
        label: "Direct Privacy Support Channel",
        text: "For targeted inquiries, compliance verifications, or urgent record handling requests, reach out directly to our core technical administrators."
      }
    ]
  },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | GradifyAI Secure Data Protection";
    const description = "Understand how GradifyAI secures your academic records, enforces strict classroom isolation, protects JWT sessions, and guarantees absolute data privacy.";
    const keywords = "GradifyAI privacy policy, secure AI grading, student data privacy, OCR handwritten security, Django JWT authentication, academic trust";
    
    const updateMetaTag = (selector, attribute, content) => {
      let tag = document.querySelector(selector);
      if (tag) { tag.setAttribute(attribute, content); }
      else { tag = document.createElement("meta"); tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property'); tag.content = content; document.head.appendChild(tag); }
    };

    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);
    [
      { property: "og:title", content: "Privacy Policy | GradifyAI Secure Data Protection" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/privacy" },
    ].forEach(({ property, content }) => updateMetaTag(`meta[property="${property}"]`, 'content', content));
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* ═══════════════ HERO HEADER CARD ═══════════════ */}
        <section className="relative text-center p-6 sm:p-10 lg:p-14 bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 overflow-hidden mb-6 sm:mb-8 animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Full Transparency & Privacy
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
            Our <span className="gradient-text">Privacy Commitment</span>
          </h1>

          <p className="text-xs sm:text-sm font-bold text-slate-400 mb-5">
            Effective Version: <span className="text-slate-600">May 2026</span> | Secure Cloud Implementation
          </p>

          <p className="text-xs sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            At GradifyAI, securing the educational information of <strong className="text-slate-700">teachers and students</strong> is foundational. We employ advanced cryptographic hashing, stateless session tokens, and strict classroom-scoped database isolation to make sure assignments and feedback remain strictly private and protected.
          </p>
        </section>

        {/* ═══════════════ TRUST SECURITY BADGES ═══════════════ */}
        <section className="mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Built-in Protections</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">How We Protect Your Data</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {trustFeatures.map((t, i) => (
              <div key={i} className="group bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${t.bg} border ${t.borderColor} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-300`}>
                    <t.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${t.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{t.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{t.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ POLICY SECTIONS (CARDS LAYOUT) ═══════════════ */}
        <section className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <p className="text-[10px] sm:text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">Clear & Readable</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Detailed Privacy Terms</h2>
          </div>

          {policyCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Premium top accent gradient line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent}`} />

              <div className="p-5 sm:p-7 lg:p-8">
                {/* Section Header */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-50">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 border border-slate-100/50`}>
                    <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">{card.title}</h2>
                </div>

                {/* Grid of Section Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {card.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2.5 p-1 rounded-lg">
                      <div className="mt-1 shrink-0">
                        <CheckCircle className="w-4 h-4 text-violet-500" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5">{item.label}</h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct support email shown specifically under the last card */}
                {i === policyCards.length - 1 && (
                  <div className="mt-5 pt-4 border-t border-slate-100/80 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600">Need specific compliance support?</span>
                    <a href="mailto:bscsf22e09@bgnu.edu.pk" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 underline">
                      privacy@gradifyai.online <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ═══════════════ USER TRUST / ACTION BANNER ═══════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-premium text-center animate-fade-in-up">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/10">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-2">Committed to Academic Safety</h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
              GradifyAI strictly preserves the professional distance and boundaries necessary for higher education. Your rubric keywords, uploaded student papers, and score evaluation outcomes are held with the utmost respect for data integrity.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-violet-700 font-extrabold px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-xs sm:text-sm">
                Get Started Securely <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm">
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ LEGAL FOOTER NOTICE ═══════════════ */}
        <div className="my-6 text-center px-4">
          <p className="text-[10px] sm:text-xs text-slate-400 max-w-md mx-auto">
            By creating classrooms or evaluating scanned files within GradifyAI, you acknowledge agreement with these transparent security controls and operational terms.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;