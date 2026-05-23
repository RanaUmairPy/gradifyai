import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import BASE_API from "../BaseApi";
import { useToast } from "../context/ToastContext";

const JoinClass = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    setError("");

    if (!code.trim()) {
      showToast("Please enter your 6-digit class join code.", "warning");
      return;
    }

    try {
      setJoining(true);
      const res = await fetch(`${BASE_API}api/classclassrooms/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (res.ok) {
        showToast("Successfully enrolled in class!", "success");
        navigate("/student");
      } else {
        const data = await res.json();
        const msg = data.code?.[0] || data.detail || data.error || "Enrollment code rejected or invalid.";
        setError(msg);
        showToast(msg, "error");
      }
    } catch {
      const msg = "Network latency issue. Check connection.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* ═══════════════ BACKGROUND ACCENT BUBBLES ═══════════════ */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[55%] h-[55%] rounded-full bg-gradient-to-b from-indigo-200/25 to-purple-100/10 blur-[100px] dark:from-indigo-950/20" />
        <div className="absolute -bottom-[15%] -left-[5%] w-[45%] h-[45%] rounded-full bg-gradient-to-t from-emerald-100/20 to-teal-50/10 blur-[90px] dark:from-emerald-950/10" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-10 shadow-xl shadow-slate-100 dark:shadow-none animate-fade-in-up relative z-10">
        
        {/* Navigation back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-650 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">Join a Class</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed max-w-xs mx-auto">
            Input the specific enrollment code dispatched by your faculty instructor.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-455 mt-0.5 shrink-0" />
            <p className="text-xs font-bold text-rose-800 dark:text-rose-455 leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 text-center uppercase tracking-widest">
              Unique Classroom Code
            </label>
            <div className="flex items-center border border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 p-3.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-2xl font-black tracking-[0.5em] text-center placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:font-sans placeholder:tracking-normal uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={joining}
            className="w-full bg-indigo-600 text-white py-3.5 mt-2 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition shadow-lg shadow-indigo-500/10 disabled:opacity-75 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {joining ? "Enrolling code..." : "Join Classroom Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinClass;
