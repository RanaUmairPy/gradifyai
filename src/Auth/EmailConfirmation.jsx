import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldCheck, RefreshCw, ArrowLeft, KeyRound, Sparkles } from "lucide-react"; 
import { useNavigate, Link } from "react-router-dom";
import BASE_API from "../BaseApi";
import AuthLayout from "../components/AuthLayout";
import { useToast } from "../context/ToastContext";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(null); 
  const [resendLoading, setResendLoading] = useState(false); 

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email_for_otp");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("❌ Email address not discovered in local storage. Sign up again to receive OTP.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email) {
      showToast("Email address is missing. Redirecting to signup.", "warning");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_API}api/user/verify-otp/`, {
        email: email, 
        otp: otp, 
      });

      if (response.status === 200) {
        showToast("Email verified successfully!", "success");
        localStorage.removeItem("user_email_for_otp"); 
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const detail = error.response?.data?.detail || "Invalid verification code. Please check again.";
      setMessage(`❌ ${detail}`);
      showToast(detail, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setMessage("");

    if (!email) {
      showToast("Cannot resend. Email address is missing.", "error");
      setResendLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_API}api/user/resend-otp/`, {
        email: email
      });

      if (response.status === 200) {
        showToast("A new OTP has been dispatched to your inbox!", "success");
        setMessage("ℹ️ New OTP sent! Please check your inbox and spam folder.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      showToast("Failed to resend code. Try again later.", "error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout bgClass="bg-slate-50 dark:bg-slate-950">
      <title>Verify institutional account | GradifyAI</title>
      
      {/* ═══════════════ OTP BRANDED SHELL CARD ═══════════════ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-xl shadow-slate-100 dark:shadow-none animate-fade-in-up relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">
            Security Verification
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed max-w-xs">
            To authorize your institution profile, provide the 6-digit access code sent to:
            <strong className="font-extrabold text-indigo-650 dark:text-indigo-400 block mt-1 break-all">
              {email || "your registered email"}
            </strong>
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-3.5 rounded-2xl text-xs font-bold leading-relaxed border ${
            message.includes("✅") 
              ? "bg-emerald-50 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" 
              : message.includes("ℹ️") 
              ? "bg-indigo-50 dark:bg-indigo-950/10 text-indigo-800 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30"
              : "bg-rose-50 dark:bg-rose-950/10 text-rose-800 dark:text-rose-455 border-rose-100 dark:border-rose-900/30"
          }`}>
            {message.replace(/^[✅❌ℹ️]\s*/, "")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest text-center">
              Enter 6-digit confirmation code
            </label>
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 p-3.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
              <input
                type="text"
                inputMode="numeric" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-3xl font-black tracking-[0.5em] text-center placeholder:text-slate-350 dark:placeholder:text-slate-700"
                placeholder="000000" 
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || otp.length !== 6}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 transition active:scale-95 shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {loading ? "Confirming profile..." : "Confirm Account"}
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-650 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Signup
          </Link>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading || loading || !email}
            className="text-xs text-indigo-650 dark:text-indigo-400 font-extrabold hover:text-indigo-800 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
            {resendLoading ? "Dispatching..." : "Resend OTP"}
          </button>
        </div>
        
      </div>
    </AuthLayout>
  );
};

export default EmailConfirmation;