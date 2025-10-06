import React, { useState, useEffect } from "react";
import axios from "axios";
// Updated icons for a stronger security theme
import { MailCheck, Key, RefreshCw, ShieldCheck } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(null); 
  const [resendLoading, setResendLoading] = useState(false); 

  // Get the email from local storage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email_for_otp");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("❌ Email not found. Please sign up again to receive a confirmation code.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email) {
        setMessage("❌ User email is missing. Please sign up again.");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${BASE_API}api/user/verify-otp/`, {
        email: email, 
        otp: otp, 
      });

      if (response.status === 200) {
        setMessage("✅ Email confirmed successfully! Redirecting to login...");
        
        localStorage.removeItem("user_email_for_otp"); 

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage(`❌ ${error.response.data.detail}`);
      } else {
        setMessage("❌ Invalid OTP or network error. Please try again.");
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
      setResendLoading(true);
      setMessage("");

      if (!email) {
        setMessage("❌ Cannot resend. Email address is missing.");
        setResendLoading(false);
        return;
      }

      try {
          // Assuming backend has a resend endpoint
          const response = await axios.post(`${BASE_API}api/user/resend-otp/`, {
              email: email
          });

          if (response.status === 200) {
              setMessage("ℹ️ New OTP sent! Please check your inbox and spam folder.");
          }
      } catch (error) {
          console.error("Resend OTP error:", error);
          setMessage("❌ Failed to resend OTP. Please check the email address or contact support.");
      } finally {
          setResendLoading(false);
      }
  };

  return (
    // Consistent Background: Matches Login/Signup
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      
      {/* Consistent Card Styling: Professional shadow and border */}
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl shadow-indigo-200 rounded-xl p-6 sm:p-8 w-full max-w-sm border border-indigo-200">
        
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-indigo-600 w-12 h-12 mb-3" /> {/* Premium Icon */}
          <h2 className="text-2xl font-bold text-gray-800">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            To secure your account, please enter the 6-digit code sent to: 
            <span className="font-semibold text-indigo-600 block mt-1">
              {email || "..."}
            </span>
          </p>
        </div>

        {/* Message Display: Consistent styling */}
        {message && (
          <p
            className={`text-center mb-5 text-sm font-medium p-3 rounded-lg ${
              message.includes("✅") ? "bg-green-100 text-green-700" : (message.includes("ℹ️") ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600")
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* OTP Input Field - The visual centerpiece */}
          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-indigo-600 transition-colors">
              Confirmation Code (OTP)
            </label>
            <div className="flex items-center border-4 border-gray-200 rounded-xl bg-gray-50/50 p-3 focus-within:border-indigo-500 transition-all duration-300">
                <input
                    type="text"
                    inputMode="numeric" 
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    // PREMIUM OTP STYLING: Large, bold, centered, wide spacing
                    className="w-full bg-transparent outline-none text-gray-800 text-3xl font-bold tracking-[0.5em] text-center placeholder:text-gray-400"
                    placeholder="000000" 
                />
            </div>
          </div>

          {/* Verify Button - Primary Action */}
          <button
            type="submit"
            disabled={loading || !email || otp.length !== 6}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-300 shadow-md shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Confirm Account"}
          </button>
        </form>

        {/* Resend OTP Link - Secondary Action */}
        <div className="mt-6 text-center">
            <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading || loading || !email}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center justify-center mx-auto gap-2 disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                {resendLoading ? "Sending New Code..." : "Resend OTP"}
            </button>
        </div>
        
      </div>
    </div>
  );
};

export default EmailConfirmation;