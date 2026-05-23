import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, Lock, ShieldCheck, ArrowLeft, RefreshCw, Eye, EyeOff } from "lucide-react";
import BASE_API from "../BaseApi";
import AuthLayout from "../components/AuthLayout";
import { useToast } from "../context/ToastContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // step: 1 = enter email, 2 = enter OTP + new password reset
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      showToast("Please provide a valid email.", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_API}api/user/forgot-password/`, {
        email: email.trim(),
      });
      if (res.status === 200) {
        showToast("Reset OTP has been sent!", "success");
        setMessage("✅ Reset OTP has been sent to your email. Check inbox & spam.");
        setStep(2);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const detail = error.response?.data?.error || error.response?.data?.detail || "Verify email correct and active.";
      setMessage(`❌ ${detail}`);
      showToast(detail, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim() || resending) return;
    setMessage("");
    try {
      setResending(true);
      await axios.post(`${BASE_API}api/user/forgot-password/`, {
        email: email.trim(),
      });
      showToast("New OTP dispatched!", "info");
      setMessage("ℹ️ A new OTP has been sent to your email.");
    } catch (error) {
      const detail = error.response?.data?.error || "Unable to dispatch code.";
      showToast(detail, "error");
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (otp.length !== 6) {
      showToast("Please enter a valid 6-digit code.", "warning");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_API}api/user/reset-password/`, {
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      if (res.status === 200) {
        showToast("Password updated successfully!", "success");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const detail = error.response?.data?.error || error.response?.data?.detail || "Reset rejected. Verify OTP code.";
      setMessage(`❌ ${detail}`);
      showToast(detail, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout bgClass="bg-slate-50 dark:bg-slate-950">
      <title>Reset secure credentials | GradifyAI</title>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100 dark:shadow-none animate-fade-in-up relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-4">
            {step === 1 ? (
              <KeyRound className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white">
            {step === 1 ? "Forgot Password?" : "Reset Credentials"}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed max-w-xs">
            {step === 1
              ? "Provide your institutional email and we'll dispatch a secure recovery OTP code."
              : "Verify OTP code and create a new secure password."}
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

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350">
                Institutional Email Address
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <Mail className="text-slate-400 w-5 h-5 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/10 disabled:opacity-60 text-xs sm:text-sm"
            >
              {loading ? "Requesting OTP..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <p className="text-[11px] text-slate-400 -mt-2">
              Sending access keys to:{" "}
              <span className="font-extrabold text-indigo-650 dark:text-indigo-400 break-all">
                {email}
              </span>
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350">
                6-digit Recovery OTP
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 p-3 focus-within:border-indigo-500 transition-all">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-2xl font-black tracking-[0.5em] text-center placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350">
                New Password
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Lock className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-slate-400 hover:text-indigo-600 ml-2"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-350">
                Confirm New Password
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Lock className="text-slate-400 w-5 h-5 mr-3 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/10 disabled:opacity-60 text-xs sm:text-sm"
            >
              {loading ? "Updating credentials..." : "Update Password"}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setOtp("");
                }}
                className="text-[11px] text-slate-450 hover:text-indigo-650 font-bold"
              >
                Use different email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-[11px] text-indigo-650 dark:text-indigo-400 font-extrabold hover:text-indigo-800 flex items-center gap-1 disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center border-t border-slate-150/40 dark:border-slate-800/80 pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-650 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
