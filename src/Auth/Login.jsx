import React, { useState } from "react";
import axios from "axios";
import { 
  ArrowRight, User, Lock, Eye, EyeOff, KeyRound, 
  GraduationCap, CheckCircle, ShieldCheck, Sparkles 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${BASE_API}api/user/api/login/`, formData);
      if (response.status === 200) {
        setMessage("✅ Authentication successful. Redirecting...");
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setFormData({ username: "", password: "" });
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Invalid credentials. Please verify and try again.");
    } finally { 
      setLoading(false); 
    }
  };

  // ═══════════════════════════════════════
  //  REAL PLATFORM CAPABILITIES
  // ═══════════════════════════════════════
  const capabilities = [
    "AI & Keyword-Based Rubric Scoring",
    "Handwritten OCR Text Extraction",
    "Automated Duplicate Checking"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4 sm:p-6 lg:p-8">
      
      {/* ═══════════════ BACKGROUND DECORATIONS ═══════════════ */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-violet-200/40 to-indigo-100/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-emerald-100/30 to-teal-50/10 blur-[100px]" />
      </div>

      <div className="max-w-5xl w-full bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row relative z-10 animate-fade-in-up">
        
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
              Welcome Back to your Workspace.
            </h2>
            <p className="text-sm sm:text-base text-violet-100/90 leading-relaxed max-w-sm">
              Securely access your active classrooms, submit assignments, and review detailed AI-generated evaluations.
            </p>
          </div>

          {/* Real Features List */}
          <div className="relative z-10 mt-12 space-y-4 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-xs font-bold text-violet-200 uppercase tracking-widest">Active Modules</span>
            </div>
            {capabilities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <CheckCircle className="w-3 h-3 text-emerald-300" />
                </div>
                <span className="text-sm font-medium text-white/95">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ RIGHT LOGIN FORM PANEL ═══════════════ */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Only Header (Shows when left panel is hidden on ultra-small screens) */}
          <div className="sm:hidden flex items-center gap-2.5 mb-8 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">GradifyAI</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Authentication
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Account Login</h1>
            <p className="text-sm text-slate-500">Please enter your institutional credentials to continue.</p>
          </div>

          {message && (
            <div className={`mb-6 p-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-fade-in-down ${
              message.includes("✅") ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-800 border border-rose-100"
            }`}>
              <span className="mt-0.5">{message.includes("✅") ? "✓" : "!"}</span>
              <p className="flex-1 leading-relaxed">{message.replace(/^[✅❌]\s*/, "")}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Username or Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  autoComplete="username"
                  placeholder="Enter your registered username"
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm font-medium" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  autoComplete="current-password"
                  placeholder="Enter your secure password"
                  className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm font-medium" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-violet-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-violet-600 text-white font-extrabold py-3.5 sm:py-4 rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm ${loading ? "opacity-80 pointer-events-none" : ""}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an institutional account yet? 
              <Link to="/signup" className="ml-1.5 text-violet-600 font-extrabold hover:text-violet-800 hover:underline transition-all">
                Register Here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;