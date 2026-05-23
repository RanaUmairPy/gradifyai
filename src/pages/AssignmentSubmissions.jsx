import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, FileText, User, Calendar, Image, X, 
  ChevronLeft, ChevronRight, AlertTriangle, Check, Award, Sparkles, Edit
} from "lucide-react";
import BASE_API from "../BaseApi";
import { useToast } from "../context/ToastContext";
import { ShimmerDashboard } from "../components/ui/Shimmer";
import { Badge } from "../components/ui/Badge";

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignment, setAssignment] = useState(null);

  // Handwritten submissions carousel state
  const [activeImageSub, setActiveImageSub] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gradingScores, setGradingScores] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSubmissions(token);
  }, [id, navigate]);

  const fetchSubmissions = async (token) => {
    try {
      setLoading(true);
      
      // 1. Fetch Assignment Info
      const assignRes = await fetch(`${BASE_API}api/classassignments/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (assignRes.ok) {
        const assignData = await assignRes.json();
        setAssignmentTitle(assignData.title);
        setAssignment(assignData);
      }

      // 2. Fetch Submissions
      const res = await fetch(`${BASE_API}api/classsubmissions/?assignment_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);

        // Initialize local grading states
        const initialScores = {};
        data.forEach(sub => {
          initialScores[sub.id] = sub.teacher_marks !== null ? sub.teacher_marks : "";
        });
        setGradingScores(initialScores);
      } else {
        setError("Failed to fetch submissions.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeUpdate = async (submissionId) => {
    const token = localStorage.getItem("access");
    const score = gradingScores[submissionId];

    if (score !== "" && (isNaN(score) || score < 0 || (assignment && score > assignment.max_marks))) {
      showToast(`Please enter a valid grade between 0 and ${assignment?.max_marks || "max"}`, "warning");
      return;
    }

    try {
      const res = await fetch(`${BASE_API}api/classsubmissions/${submissionId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ teacher_marks: score === "" ? null : score })
      });

      if (res.ok) {
        const updatedSub = await res.json();
        setSubmissions(prev => prev.map(s => s.id === submissionId ? updatedSub : s));
        showToast("Grade updated successfully!", "success");
      } else {
        const errData = await res.json();
        showToast(errData.detail || "Failed to update grade.", "error");
      }
    } catch (err) {
      showToast("Network error. Try again.", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <ShimmerDashboard />;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <title>Grades Cohort Desk | GradifyAI</title>

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs sm:text-sm transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Assignment
      </button>

      {/* ═══════════════ GRADING DESK HEADER ═══════════════ */}
      <header className="bg-white dark:bg-slate-900/40 border border-slate-250/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
            <Award className="w-5 h-5 text-indigo-500" />
          </span>
          <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">COHORT GRADING DESK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-white leading-tight">
          Submissions: <span className="text-indigo-600 dark:text-indigo-400">{assignmentTitle || "Assignment Tasks"}</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">Manage student uploaded files, check semantic OCR keywords, and lock down final grades.</p>
      </header>

      {error && (
        <div className="flex items-start p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 text-rose-700 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mr-3 mt-0.5" />
          <div>
            <p className="font-bold">Failed to load student cohort</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {submissions.length === 0 && !error && (
        <div className="text-center bg-white dark:bg-slate-900/20 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No submissions uploaded</h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
            Active students in this classroom have not submitted any digital documents or handwritten OCR sheets for this task yet.
          </p>
        </div>
      )}

      {/* ═══════════════ COHORT WORK matrix TABLE ═══════════════ */}
      {submissions.length > 0 && (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                  <th className="p-5">Student</th>
                  <th className="p-5">Date Uploaded</th>
                  {(!assignment || assignment.show_openai_score) && (
                    <th className="p-5 text-center">AI Agent score</th>
                  )}
                  {(!assignment || assignment.show_model_score) && (
                    <th className="p-5 text-center">Semantic Index</th>
                  )}
                  <th className="p-5">AI Critiques / Plagiarism</th>
                  <th className="p-5">Attached Files</th>
                  {(!assignment || assignment.show_teacher_marks) && (
                    <th className="p-5">Override Marks</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition-all">
                    
                    {/* Student metadata */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm flex items-center justify-center border border-indigo-200/40 dark:border-indigo-900 shrink-0">
                          {(sub.student?.name || sub.student?.username || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-800 dark:text-white truncate block">{sub.student?.name || sub.student?.username}</span>
                          <span className="text-[10px] text-slate-400 truncate block">@{sub.student?.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Date submitted */}
                    <td className="p-5 text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                      {formatDate(sub.created_at || sub.submitted_at)}
                    </td>

                    {/* AI automated agent grade */}
                    {(!assignment || assignment.show_openai_score) && (
                      <td className="p-5 text-center">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-lg font-mono font-bold border border-indigo-150/40 text-xs">
                          {sub.openai_score !== null ? `${sub.openai_score}/${assignment?.max_marks || "max"}` : "Pending"}
                        </span>
                      </td>
                    )}

                    {/* Backend system model score */}
                    {(!assignment || assignment.show_model_score) && (
                      <td className="p-5 text-center font-black text-indigo-650 dark:text-indigo-400 text-sm">
                        {sub.marks !== null ? `${sub.marks}/${assignment?.max_marks || "max"}` : "Pending"}
                      </td>
                    )}

                    {/* AI Feedback critique column */}
                    <td className="p-5 max-w-xs">
                      <div 
                        className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed" 
                        title={sub.feedback || "No feedback generated yet"}
                      >
                        {sub.feedback || "No feedback audit available."}
                      </div>
                    </td>

                    {/* Documents View links */}
                    <td className="p-5">
                      <div className="flex flex-col gap-2 min-w-[125px]">
                        {sub.submitted_file ? (
                          <a
                            href={sub.submitted_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-extrabold text-[10px] bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/80 px-3 py-2 rounded-xl transition border border-indigo-200/40 dark:border-indigo-900"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Student file
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic text-[10px] text-center">No digital attachment</span>
                        )}
                        
                        {sub.images && sub.images.length > 0 && (
                          <button
                            onClick={() => {
                              setActiveImageSub(sub);
                              setCurrentImageIndex(0);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-extrabold text-[10px] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 px-3 py-2 rounded-xl transition border border-emerald-200/40 dark:border-emerald-900"
                          >
                            <Image className="w-3.5 h-3.5" /> Scanned Handwriting
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Override inputs */}
                    {(!assignment || assignment.show_teacher_marks) && (
                      <td className="p-5 min-w-[185px]">
                        <div className="flex items-center gap-2">
                          <div className="relative shrink-0">
                            <input
                              type="number"
                              value={gradingScores[sub.id] !== undefined ? gradingScores[sub.id] : ""}
                              onChange={(e) => setGradingScores({ ...gradingScores, [sub.id]: e.target.value })}
                              placeholder="Marks"
                              max={assignment?.max_marks}
                              min={0}
                              className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                            {sub.teacher_marks !== null && (
                              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black shadow shadow-emerald-500/20 flex items-center justify-center">
                                SAVED
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleGradeUpdate(sub.id)}
                            className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-xl font-extrabold text-[10px] hover:bg-indigo-700 transition"
                          >
                            <Check className="w-3.5 h-3.5" /> Save
                          </button>
                        </div>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════ LIGHTBOX IMAGES MODAL CAROUSEL ═══════════════ */}
      {activeImageSub && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
            
            {/* Header toolbar */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  AI OCR Handwriting Viewer
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Student: <strong className="font-bold text-slate-700 dark:text-slate-350">{activeImageSub.student?.name || activeImageSub.student?.username}</strong> • Page {currentImageIndex + 1} of {activeImageSub.images.length}
                </p>
              </div>
              <button
                onClick={() => setActiveImageSub(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-655 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core black canvas space */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center min-h-[360px] relative p-8 select-none">
              {activeImageSub.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : activeImageSub.images.length - 1))}
                    className="absolute left-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition backdrop-blur-sm active:scale-95 border border-white/5 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev < activeImageSub.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition backdrop-blur-sm active:scale-95 border border-white/5 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <img
                src={activeImageSub.images[currentImageIndex]?.image}
                alt={`Page ${currentImageIndex + 1}`}
                className="max-h-[58vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/5 transition-all duration-300"
              />
            </div>

            {/* Thumb deck & high-res links */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col gap-4">
              {activeImageSub.images.length > 1 && (
                <div className="flex justify-center gap-2.5 overflow-x-auto py-1">
                  {activeImageSub.images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        idx === currentImageIndex
                          ? 'border-indigo-650 scale-105 shadow'
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image} alt={`Thumb page ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center text-[10px] text-slate-450 dark:text-slate-500 px-1">
                <span>Uploaded: {formatDate(activeImageSub.images[currentImageIndex]?.uploaded_at)}</span>
                <a
                  href={activeImageSub.images[currentImageIndex]?.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-extrabold flex items-center gap-1 transition"
                >
                  Open high-resolution tab
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AssignmentSubmissions;
