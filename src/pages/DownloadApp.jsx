import React, { useState } from "react";
import { 
  Smartphone, Download, ExternalLink, Sparkles, Camera, BellRing, 
  WifiOff, BarChart3, Check, Star, ShieldCheck, ArrowRight, 
  Laptop, ChevronRight, GraduationCap
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const DownloadApp = () => {
  const { showToast } = useToast();
  const [activeSlide, setActiveSlide] = useState(0);

  const apkUrl = "https://github.com/Muzammal-Ikhlaq/gradifyai-mobile-app/releases/download/v1.0.0/app-release.apk";
  const releaseUrl = "https://github.com/Muzammal-Ikhlaq/gradifyai-mobile-app/releases/tag/v1.0.0";
  const repoUrl = "https://github.com/Muzammal-Ikhlaq/gradifyai-mobile-app";

  const appScreens = [
    {
      title: "Elegant App Splash Desk",
      desc: "Branded initial splash workspace representing the official Final Year Project by Umair Saeed Khan and Muzammal Ikhlaq.",
      stat: "v1.0 Release",
      image: "/app_screen1.jpg"
    },
    {
      title: "Unified Workspace Drawer",
      desc: "Access course feeds, trigger classroom actions, view user manuals, configure profile settings, and access direct developer support.",
      stat: "Faculty Dashboard",
      image: "/app_screen2.jpg"
    },
    {
      title: "Interactive Classroom Feed",
      desc: "Students can browse registered subjects (Calculus, DSA, PF) with distinct indicators, and enroll instantly with unique join codes.",
      stat: "Student Workspace",
      image: "/app_screen3.jpg"
    }
  ];

  const features = [
    {
      icon: Camera,
      title: "OCR Camera Grading integration",
      desc: "Snap clear photos of written tasks and submit them directly for instant OCR auto-checking — no manual typing or scanning required.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: BellRing,
      title: "Real-Time Push Alerts",
      desc: "Never miss academic deadlines. Receive native smartphone alerts for upcoming due-dates and grading releases.",
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      icon: WifiOff,
      title: "Offline Sync Engine",
      desc: "View class files, instructions, grades, and keyword lists even during network blackouts. Syncs back when active.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: BarChart3,
      title: "SaaS Performance Gauges",
      desc: "Check beautiful, fluid HSL analytics and progress arcs tailored to mobile device viewports.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    }
  ];

  const testimonials = [
    {
      quote: "The handwritten OCR camera feature is a total game-changer. My students snap their essay assignments from their smartphones, and the extracted text syncs immediately with the GPT grading rubrics.",
      author: "Mr. Hassan Iftikhar",
      role: "Lecturer of CS & IT",
      rating: 5,
      initials: "HI"
    },
    {
      quote: "Deploying classrooms and review structures via the desktop panel combined with mobile push triggers is fantastic. Immediate override scores sync instantly with the student cohort records.",
      author: "Ms. Kashifa Nawab",
      role: "Lecturer of CS & IT",
      rating: 5,
      initials: "KN"
    },
    {
      quote: "The seamless integration of AI rubric-based evaluation with handwritten image scans is incredibly robust. It saves dozens of hours of manual marking while maintaining rigorous feedback standards.",
      author: "Dr. Shahzad Nazir",
      role: "Professor of Computer Science & IT",
      rating: 5,
      initials: "SN"
    },
    {
      quote: "Building the interface was amazing. The native offline support paired with mobile push alerts relieves so much exam stress. Plus, local sync lets us verify grading rules on the fly.",
      author: "Muzammal Ikhlaq",
      role: "Undergraduate CS Student & Frontend Lead",
      rating: 5,
      initials: "MI"
    },
    {
      quote: "Evaluating NLP check-blocks and OCR handwriting extraction yields rapid responses. The mobile SQLite caching makes looking up syllabus grades incredibly fluid.",
      author: "Umair Saeed Khan",
      role: "Undergraduate CS Student & AI Developer",
      rating: 5,
      initials: "UK"
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(apkUrl);
    showToast("Direct APK download link copied to clipboard!", "success");
  };

  return (
    <div className="space-y-24 pb-24 animate-fade-in-up">
      <title>Download Mobile App | GradifyAI</title>

      {/* ═══════════════ HERO HEADER PANEL ═══════════════ */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-12 lg:p-16 shadow-premium border border-slate-800">
        
        {/* Visual SaaS background accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-violet-300 text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> TAKING LEARNING BEYOND THE DESKTOP
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Grade, Submit, & Track <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Instantly from your Phone
              </span>
            </h1>

            <p className="text-slate-350 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Unlock the complete power of GradifyAI with our native Flutter mobile app. Snap photos of handwritten documents for instant OCR extraction, track task due-dates, and receive real-time grading reports.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href={apkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast("Direct APK download initialized!", "info")}
                className="w-full sm:w-auto bg-indigo-650 text-white font-extrabold px-7 py-4 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-indigo-750 active:scale-95 transition shadow-lg shadow-indigo-500/25 text-xs sm:text-sm"
              >
                <Download className="w-4.5 h-4.5" /> Download Direct Android APK
              </a>

              <a 
                href={releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-extrabold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm border border-white/10 transition"
              >
                <ExternalLink className="w-4 h-4" /> View Release Notes (v1.0.0)
              </a>
            </div>

            {/* Micro badges */}
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-5 text-[10px] sm:text-xs text-slate-400 font-semibold border-t border-slate-800/80 mt-8">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Clean APK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Flutter Cross-Platform</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-purple-400" />
                <span>Real-Time Web Syncing</span>
              </div>
            </div>
          </div>

          {/* Interactive CSS Device Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group select-none">
              
              {/* Branded backdrop glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl blur-[30px] opacity-30 group-hover:opacity-45 transition duration-500" />
              
              {/* Phone frame wrapper */}
              <div className="relative w-[240px] sm:w-[260px] h-[480px] sm:h-[520px] rounded-[3rem] border-8 border-slate-950 bg-slate-950 shadow-2xl overflow-hidden p-1 flex flex-col justify-between">
                
                {/* Speaker top camera notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-900 rounded-full mr-2" />
                  <div className="w-1.5 h-1.5 bg-indigo-900/60 rounded-full" />
                </div>

                <img 
                  src="/app_screen3.jpg" 
                  alt="GradifyAI Student Dashboard Mobile" 
                  className="w-full h-full object-cover rounded-[2.5rem]"
                />

              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ═══════════════ COMPARATIVE FEATURE SHOWCASE ═══════════════ */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">FEATURES SYNC</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Why Adopt the Mobile Companion?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            GradifyAI web is tailored for heavy editing, while the mobile client delivers instant on-the-go academic actions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 hover:shadow transition"
            >
              <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                <feat.icon className={`w-5 h-5 ${feat.color}`} />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SCREENSHOTS CAROUSEL ═══════════════ */}
      <section className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 sm:p-10 lg:p-12 space-y-8 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">SCREEN REVEALS</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">Seamless Application Walkthrough</h2>
          </div>
          
          <div className="flex gap-2 shrink-0">
            {appScreens.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-all ${activeSlide === idx ? "bg-indigo-600 px-3" : "bg-slate-200 dark:bg-slate-850"}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold uppercase font-mono">
              {appScreens[activeSlide].stat}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white leading-snug">
              {appScreens[activeSlide].title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {appScreens[activeSlide].desc}
            </p>
            <button 
              onClick={() => setActiveSlide((activeSlide + 1) % appScreens.length)}
              className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs inline-flex items-center gap-1.5 group hover:underline pt-2"
            >
              Next Feature Reveal <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="md:col-span-7 flex justify-center bg-white/40 dark:bg-slate-900/10 backdrop-blur rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800 relative min-h-[300px] items-center">
            
            {/* Screenshot Panel */}
            <div className="w-[190px] h-[360px] rounded-[2rem] bg-slate-950 border-4 border-slate-900 shadow-xl overflow-hidden p-1 flex flex-col justify-between text-white relative">
              <div className="flex-1 bg-slate-900 rounded-[1.6rem] flex flex-col justify-between overflow-hidden relative">
                
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-950 rounded-full z-15 flex items-center justify-center pointer-events-none" />

                <img 
                  src={appScreens[activeSlide].image} 
                  alt={appScreens[activeSlide].title} 
                  className="w-full h-full object-cover rounded-[1.6rem] animate-fade-in"
                  key={activeSlide}
                />
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ═══════════════ MATRIX COMPARISON TABLE ═══════════════ */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">MATRIX COMPARISON</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Platform Capability Grid</h2>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-350">
                <th className="p-4 sm:p-5 font-black">Capability Feature</th>
                <th className="p-4 sm:p-5 font-black text-center">SaaS Web Portal</th>
                <th className="p-4 sm:p-5 font-black text-center text-indigo-600 dark:text-indigo-400">Flutter Mobile APK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-800 dark:text-slate-200">Handwritten OCR Camera Scanning</td>
                <td className="p-4 sm:p-5 text-center">Manual upload only</td>
                <td className="p-4 sm:p-5 text-center font-extrabold text-emerald-500">✓ Instant Snap scan</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-800 dark:text-slate-200">Instant Grade Alerts</td>
                <td className="p-4 sm:p-5 text-center">Requires browser reload</td>
                <td className="p-4 sm:p-5 text-center font-extrabold text-emerald-500">✓ Push notifications</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-800 dark:text-slate-200">Offline Coursework Browsing</td>
                <td className="p-4 sm:p-5 text-center">No (requires link)</td>
                <td className="p-4 sm:p-5 text-center font-extrabold text-emerald-500">✓ SQLite local cache</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-800 dark:text-slate-200">Large Cohort CSV Grade Exports</td>
                <td className="p-4 sm:p-5 text-center font-extrabold text-emerald-500">✓ Native bulk downloads</td>
                <td className="p-4 sm:p-5 text-center">Not supported</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-800 dark:text-slate-200">Anti-Duplicate Submission Lock</td>
                <td className="p-4 sm:p-5 text-center font-extrabold text-emerald-500">✓ Full server validation</td>
                <td className="p-4 sm:p-5 text-center font-extrabold text-emerald-500">✓ Enabled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════ INSTALLATION GUIDE & QR CODE ═══════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Step-by-Step APK Guide */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white">Android Sideloading Quick Guide</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Since our mobile client is currently distributed as a direct APK, follow these quick steps to set it up on your Android device:</p>
            
            <div className="space-y-3.5 pt-4">
              {[
                { step: "01", text: "Download the verified app-release.apk file using our direct download links." },
                { step: "02", text: "Open your Android 'Settings' → 'Security' (or 'Apps & Notifications')." },
                { step: "03", text: "Enable 'Install Unknown Apps' for your active mobile web browser (e.g. Chrome)." },
                { step: "04", text: "Tap the finished download file from your notification panel and select 'Install'." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-xs font-black flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Currently targeted for Android 8.0+ devices</span>
            <a 
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Explore Github Code Repository <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Play Store coming soon panel */}
        <div className="lg:col-span-4 bg-indigo-600 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-4 text-center">
            <span className="text-[9px] font-black bg-white/15 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block border border-white/10">SCAN TO SYNC</span>
            <h3 className="text-lg font-black tracking-tight">Direct Phone Install</h3>
            <p className="text-indigo-150 text-[11px] sm:text-xs">Copy or scan the download link to download the APK directly on your smartphone.</p>
            
            {/* Styled interactive QR simulation box */}
            <div className="w-36 h-36 mx-auto bg-white rounded-2xl p-2.5 shadow-lg border border-indigo-200/20 flex flex-col items-center justify-between group cursor-pointer active:scale-95 transition" onClick={handleCopyLink}>
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300 relative">
                <Smartphone className="w-8 h-8 text-indigo-600" />
                <span className="absolute bottom-1.5 text-[8px] text-slate-500 font-black uppercase tracking-wider">TAP TO COPY LINK</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center mt-6">
            <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-black block">Institutional Release</span>
            <span className="text-[10px] text-indigo-150 font-medium block mt-1">Google Play Store & App Store — Coming Soon</span>
          </div>

        </div>

      </section>

      {/* ═══════════════ TESTIMONIALS SECTION ═══════════════ */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">FEEDBACK LOOPS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Endorsed by Students & Faculty</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow transition"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                {/* Visual Initials Avatar (No image as requested) */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  {test.initials}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white leading-none">{test.author}</h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-1.5">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default DownloadApp;
