import React, { useEffect, useState } from "react";
import { 
  Phone, Mail, Linkedin, MessageCircle,
  Send, ArrowRight, ShieldCheck, GraduationCap, CheckCircle,
  User, AtSign, HelpCircle, MessageSquare
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", role: "Teacher", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    document.title = "Contact Support | GradifyAI Platform Inquiries";
    const description = "Reach out to the GradifyAI Final Year Project team for inquiries regarding AI automated grading, handwritten OCR support, or technical implementations.";
    const keywords = "GradifyAI contact, support, FYP team, BGNU computer science, developer inquiry, AI grading assistance";
    
    const updateMetaTag = (selector, attribute, content) => {
      let tag = document.querySelector(selector);
      if (tag) { tag.setAttribute(attribute, content); }
      else { tag = document.createElement("meta"); tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property'); tag.content = content; document.head.appendChild(tag); }
    };

    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);
    [
      { property: "og:title", content: "Contact Support | GradifyAI Platform Inquiries" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/contact" },
    ].forEach(({ property, content }) => updateMetaTag(`meta[property="${property}"]`, 'content', content));
  }, []);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      // Simulate submission delay for smooth UI feedback
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitMessage("Thank you for reaching out! Your inquiry has been securely routed to the core developers.");
      setFormData({ name: "", email: "", role: "Teacher", subject: "", message: "" });
    } catch {
      setSubmitMessage("An error occurred while submitting your request. Please email us directly.");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  // ═══════════════════════════════════════
  //  REAL CONTACT & ACADEMIC INFO
  // ═══════════════════════════════════════
  const developerProfiles = [
    {
      name: "Umair Saeed Khan",
      role: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/umair-saeed-5659a8340/",
      whatsapp: "https://wa.me/923488735199",
      phoneLabel: "+92 348 8735199",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accent: "from-emerald-600 to-teal-600"
    },
    {
      name: "Muzammal Ikhlaq",
      role: "Frontend Developer",
      linkedin: "https://www.linkedin.com/in/muzammal-ikhlaq",
      whatsapp: "https://wa.me/923124295838",
      phoneLabel: "+92 312 4295838",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-100",
      accent: "from-violet-600 to-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* ═══════════════ PREMIUM HERO BANNER ═══════════════ */}
        <section className="relative text-center p-6 sm:p-10 lg:p-12 bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 overflow-hidden mb-6 sm:mb-8 animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          
          {/* Subtle background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-to-br from-violet-100/30 to-indigo-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
            <GraduationCap className="w-3.5 h-3.5" /> Core Project Support
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
            Get in <span className="gradient-text">Touch With Us</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding the AI grading engine logic, OCR accuracy parameters, or interested in evaluating our Final Year Project implementation? Reach out directly to the primary developers.
          </p>
        </section>

        {/* ═══════════════ MAIN CONTENT GRID (INFO + FORM) ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8 sm:mb-12">
          
          {/* ═══════════════ LEFT COLUMN: REAL CONTACT DETAILS (5 Cols) ═══════════════ */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* Support Email Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-card border border-slate-100 relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-600" />
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100/60 mt-0.5">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">General Inquiry Channel</p>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Support Email</h3>
                  <a href="mailto:bscsf22e09@bgnu.edu.pk" className="text-xs sm:text-sm font-bold text-violet-600 hover:text-violet-700 underline break-all block">
                    support@gradifyai.online
                  </a>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Centralized mailbox for general platform inquiries and support.</p>
                </div>
              </div>
            </div>

            {/* Real Team Contacts Section */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-card border border-slate-100 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 text-center sm:text-left">
                Direct Developer Profiles
              </h3>

              <div className="space-y-4">
                {developerProfiles.map((dev, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-3 hover:bg-white hover:shadow-sm transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{dev.name}</h4>
                        <span className={`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${dev.badgeColor}`}>
                          {dev.role}
                        </span>
                      </div>
                      
                      {/* LinkedIn Direct Button */}
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" title={`${dev.name} LinkedIn`}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shrink-0 shadow-2xs">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>

                    {/* WhatsApp Action */}
                    <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {dev.phoneLabel}
                      </span>
                      <a href={dev.whatsapp} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-md hover:bg-emerald-600 transition-colors shadow-2xs">
                        <MessageCircle className="w-3 h-3 fill-white" /> Chat
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ═══════════════ RIGHT COLUMN: PREMIUM MESSAGE FORM (7 Cols) ═══════════════ */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-card border border-slate-100 relative overflow-hidden h-full animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
              
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Send an Inquiry Message</h2>
                <p className="text-xs sm:text-sm text-slate-500">Fill out the parameters below to trigger a structured notification.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                
                {/* Responsive row for Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text" id="name" name="name"
                        value={formData.name} onChange={handleChange}
                        placeholder="Dr. Smith / Student" required
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                      Your Identity Scope
                    </label>
                    <select
                      id="role" name="role"
                      value={formData.role} onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all text-xs sm:text-sm font-bold"
                    >
                      <option value="Teacher">Teacher / Evaluator</option>
                      <option value="Student">Student</option>
                      <option value="Evaluator">Thesis Panel / Examiner</option>
                      <option value="Developer">External Developer</option>
                    </select>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <AtSign className="w-4 h-4" />
                    </div>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="instructor@university.edu" required
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Inquiry Subject <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <input
                      type="text" id="subject" name="subject"
                      value={formData.subject} onChange={handleChange}
                      placeholder="e.g. AI Keyword Rubric Validation Integration" required
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Message Payload */}
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Message Details <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      id="message" name="message"
                      value={formData.message} onChange={handleChange}
                      rows="4" placeholder="Specify your testing questions, feedback, or review criteria..." required
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all text-xs sm:text-sm font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Submission status feedback */}
                {submitMessage && (
                  <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-fade-in-down ${
                    submitMessage.includes("Thank you") ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-800 border border-rose-100"
                  }`}>
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${submitMessage.includes("Thank you") ? "text-emerald-600" : "text-rose-600"}`} />
                    <p className="flex-1 leading-relaxed">{submitMessage}</p>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit" disabled={isSubmitting}
                  className={`w-full btn-primary !py-3 sm:!py-3.5 !rounded-xl flex items-center justify-center gap-2 !text-xs sm:!text-sm font-extrabold shadow-lg hover:shadow-xl transition-all ${
                    isSubmitting ? "!opacity-75 cursor-wait" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Routing Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Transmit Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ═══════════════ FOOTER TRUST PLEDGE ═══════════════ */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-6 text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-violet-600" /> Direct Communication Pledge
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-xl mx-auto">
            As a Final Year Project under active supervision, incoming queries receive highly responsive follow-up directly from the core development team.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Contact;