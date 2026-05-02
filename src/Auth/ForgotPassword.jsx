import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Mail,
  Lock,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import BASE_API from "../BaseApi";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // step: 1 = enter email, 2 = enter OTP + new password
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
      setMessage("❌ Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_API}api/user/forgot-password/`, {
        email: email.trim(),
      });
      if (res.status === 200) {
        setMessage(
          "✅ A reset OTP has been sent to your email. Please check your inbox (and spam)."
        );
        setStep(2);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const detail =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Could not send OTP. Please verify your email is correct.";
      setMessage(`❌ ${detail}`);
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
      setMessage("ℹ️ A new OTP has been sent to your email.");
    } catch (error) {
      const detail =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Could not resend OTP.";
      setMessage(`❌ ${detail}`);
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (otp.length !== 6) {
      setMessage("❌ Please enter the 6-digit OTP.");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
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
        setMessage("✅ Password updated successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const detail =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Could not reset password. Please try again.";
      setMessage(`❌ ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const messageBoxClass = message.includes("✅")
    ? "bg-green-100 text-green-700"
    : message.includes("ℹ️")
    ? "bg-blue-100 text-blue-700"
    : "bg-red-100 text-red-600";

  return (
    <AuthLayout bgClass="bg-gray-50">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-indigo-300/40 border border-indigo-200 p-6 sm:p-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
            {step === 1 ? (
              <KeyRound className="w-7 h-7 text-indigo-600" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-indigo-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 1 ? "Forgot Your Password?" : "Reset Your Password"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {step === 1
              ? "Enter your registered email and we'll send you a 6-digit OTP."
              : "Enter the OTP we sent to your email and choose a new password."}
          </p>
        </div>

        {message && (
          <p
            className={`text-center mb-5 text-sm font-medium p-3 rounded-lg border border-white/30 ${messageBoxClass}`}
          >
            {message}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="group">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Registered Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <Mail className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <p className="text-xs text-gray-500 -mt-2">
              Sending to{" "}
              <span className="font-semibold text-indigo-600 break-all">
                {email}
              </span>
            </p>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                6-digit OTP
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-gray-50/50 p-3 focus-within:border-indigo-500 transition-all">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  className="w-full bg-transparent outline-none text-gray-800 text-2xl font-bold tracking-[0.5em] text-center placeholder:text-gray-400"
                  placeholder="000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                New Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <Lock className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-gray-400 hover:text-indigo-600 ml-2"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Confirm New Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <Lock className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  placeholder="Re-enter the new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setOtp("");
                }}
                className="text-xs text-gray-500 hover:text-indigo-600 font-medium"
              >
                Use a different email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-3 h-3 ${resending ? "animate-spin" : ""}`}
                />
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
