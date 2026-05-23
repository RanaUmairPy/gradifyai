import React, { useState } from "react";
import axios from "axios";
import { 
  UserPlus, User, Mail, Lock, Eye, EyeOff, BookOpen, 
  GraduationCap, ShieldCheck, Sparkles, LayoutDashboard, FileText, Settings
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: "", email: "", password: "", roll_number: "", name: "", is_teacher: false 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${BASE_API}api/user/register/`, formData);
      if (response.status === 201) {
        setMessage("✅ Registration successful! Please check your email to confirm.");
        localStorage.setItem("user_email_for_otp", formData.email);
        setFormData({ username: "", email: "", password: "", roll_number: "", name: "", is_teacher: false });
        setTimeout(() => navigate("/email-confirmation"), 2000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response?.data) {
        let msgs = [];
        for (const key in error.response.data) {
          msgs.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${error.response.data[key].join(", ")}`);
        }
        setMessage(`❌ ${msgs.join(" ")}`);
      } else {
        setMessage("❌ A network error occurred. Please try again.");
      }
    } finally { 
      setLoading(false); 
    }
  };

  // ═══════════════════════════════════════
  //  PLATFORM VALUE PROPOSITION
  // ═══════════════════════════════════════
  const platformFeatures = [
    { icon: LayoutDashboard, title: "Intelligent Dashboard", text: "Real-time insights and automated grading analytics." },
    { icon: FileText, title: "OCR Validation", text: "Seamlessly extract and grade handwritten assignments." },
    { icon: Settings, title: "Custom Rubrics", text: "Configure flexible evaluation criteria and constraints." }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4 sm:p-6 lg:p-8">
      
      {/* ═══════════════ BACKGROUND DECORATIONS ═══════════════ */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-violet-200/40 to-indigo-100/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-emerald-100/30 to-teal-50/10 blur-[100px]" />
      </div>

      <div className="max-w-6xl w-full bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row relative z-10 animate-fade-in-up">
        
        {/* ═══════════════ LEFT BRANDING PANEL (Hidden on very small mobile, visible on sm+) ═══════════════ */}
        <div className="hidden sm:flex flex-col justify-between w-full md:w-5/12 bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 p-8 lg:p-12 text-white relative overflow-hidden">
          
          {/* Glassmorphism overlays */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

          {/* Logo & Title */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-10 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">GradifyAI</span>
            </Link>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Join the Future of Academic Evaluation.
            </h2>
            <p className="text-sm sm:text-base text-violet-100/90 leading-relaxed max-w-sm">
              Register your institutional profile to gain immediate access to our advanced grading engine, classroom structures, and anti-plagiarism mechanisms.
            </p>
          </div>

          {/* Real Platform Values */}
          <div className="relative z-10 mt-10 space-y-5 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-xs font-bold text-violet-200 uppercase tracking-widest">Platform Highlights</span>
            </div>
            {platformFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <feat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{feat.title}</h3>
                  <p className="text-xs text-violet-200/80 leading-relaxed pr-4">{feat.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ RIGHT REGISTRATION FORM PANEL ═══════════════ */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 lg:p-12 xl:p-14 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Only Header */}
          <div className="sm:hidden flex items-center gap-2.5 mb-8 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">GradifyAI</span>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Registration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-xs sm:text-sm text-slate-500">Provide your designated institutional details to register.</p>
          </div>

          {message && (
            <div className={`mb-6 p-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-fade-in-down ${
              message.includes("✅") ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-800 border border-rose-100"
            }`}>
              <span className="mt-0.5">{message.includes("✅") ? "✓" : "!"}</span>
              <p className="flex-1 leading-relaxed">{message.replace(/^[✅❌]\s*/, "")}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Identity Scope Selector */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">I am registering as a:</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { val: false, label: "Student", Icon: BookOpen }, 
                  { val: true, label: "Teacher", Icon: User }
                ].map(({ val, label, Icon }) => (
                  <label key={label} className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 border-2 rounded-xl cursor-pointer transition-all duration-300 text-xs sm:text-sm ${
                    formData.is_teacher === val 
                    ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm shadow-violet-500/10' 
                    : 'bg-white border-slate-100 hover:border-violet-300 hover:bg-slate-50 text-slate-600'
                  }`}>
                    <input type="radio" name="is_teacher" className="hidden" checked={formData.is_teacher === val} onChange={() => setFormData({ ...formData, is_teacher: val })} />
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${formData.is_teacher === val ? 'text-violet-600' : 'text-slate-400'}`} />
                    <span className="font-extrabold">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Input Grid (2 columns on md+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" name="username" value={formData.username} onChange={handleChange} required 
                    placeholder="Choose username"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-xs sm:text-sm font-medium" 
                  />
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required 
                    placeholder="E.g. Dr. John Doe"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-xs sm:text-sm font-medium" 
                  />
                </div>
              </div>

              {/* Institutional Email Field */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Institutional Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required 
                    placeholder="faculty@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-xs sm:text-sm font-medium" 
                  />
                </div>
              </div>

              {/* Roll Number / Employee ID Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Roll Number / ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" name="roll_number" value={formData.roll_number} onChange={handleChange} required 
                    placeholder="Identifier Code"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-xs sm:text-sm font-medium" 
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Create Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" value={formData.password} onChange={handleChange} required 
                    placeholder="Secure password"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-xs sm:text-sm font-medium" 
                  />
                  <button 
                    type="button" onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-violet-600 transition-colors" tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" disabled={loading}
              className={`w-full bg-violet-600 text-white font-extrabold py-3.5 sm:py-4 mt-2 rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm ${loading ? "opacity-80 pointer-events-none" : ""}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Registration...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Institutional Account
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Already possess an active account?
              <Link to="/login" className="ml-1.5 text-violet-600 font-extrabold hover:text-violet-800 hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;