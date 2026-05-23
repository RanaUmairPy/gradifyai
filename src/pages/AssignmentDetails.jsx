import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText, Calendar, Download, CheckCircle, Briefcase, 
  Upload, ArrowLeft, AlertTriangle, Image as ImageIcon, 
  Trash2, Sparkles, Plus, Check, Award, Eye, FileDown
} from "lucide-react";
import BASE_API from "../BaseApi";
import { useToast } from "../context/ToastContext";
import { ShimmerCard } from "../components/ui/Shimmer";
import { Badge } from "../components/ui/Badge";

const AssignmentDetails = ({ assignmentId }) => {
  const params = useParams();
  const id = assignmentId || params.id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Submission State
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Handwritten Submission State
  const [submissionMethod, setSubmissionMethod] = useState("file"); // "file" or "handwritten"
  const [handwrittenImages, setHandwrittenImages] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [mySubmission, setMySubmission] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    if (id) {
      fetchAssignmentDetails(token);
    } else {
      setError("Invalid Assignment ID");
      setLoading(false);
    }
  }, [navigate, id]);

  const fetchAssignmentDetails = async (token) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_API}api/classassignments/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAssignment(data);

        // Fetch student's submission
        const cu = JSON.parse(localStorage.getItem("user"));
        if (cu && !cu.is_teacher) {
          const subRes = await fetch(`${BASE_API}api/classsubmissions/?assignment_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            const mine = subData.find(s =>
              (s.student?.id === cu.id) ||
              (s.student?.username === cu.username) ||
              (s.student === cu.id)
            );
            if (mine) setMySubmission(mine);
          }
        }
      } else {
        setError("Failed to load assignment details.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setHandwrittenImages(prev => [...prev, ...newImages]);
    showToast(`Added ${files.length} pages. Use AI OCR to extract.`, "info");
  };

  const handleRemoveImage = (indexToRemove) => {
    setHandwrittenImages(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      URL.revokeObjectURL(prev[indexToRemove].preview);
      return updated;
    });
  };

  const handleExtractText = async () => {
    if (handwrittenImages.length === 0) {
      showToast("Please upload at least one image first", "warning");
      return;
    }

    const token = localStorage.getItem("access");
    const formData = new FormData();
    handwrittenImages.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    try {
      setOcrLoading(true);
      setSubmissionError("");
      const res = await fetch(`${BASE_API}api/classsubmissions/extract-handwriting/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setExtractedText(data.text || "");
        showToast("Text extracted! Please review the draft.", "success");
      } else {
        const errData = await res.json();
        setSubmissionError(errData.error || "Failed to extract text from images.");
        showToast("AI OCR was unable to decipher handwriting.", "error");
      }
    } catch (err) {
      setSubmissionError("OCR Error: " + err.message);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    
    if (submissionMethod === "file" && !submissionFile) {
      setSubmissionError("Please select a valid document file.");
      return;
    }
    if (submissionMethod === "handwritten") {
      if (handwrittenImages.length === 0) {
        setSubmissionError("Please attach handwritten pages.");
        return;
      }
      if (!extractedText.trim()) {
        setSubmissionError("Extract text using AI OCR before submitting.");
        return;
      }
    }

    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("assignment_id", id);
    
    if (submissionMethod === "file") {
      formData.append("submitted_file", submissionFile);
    } else {
      formData.append("extracted_text", extractedText);
      handwrittenImages.forEach((imgObj) => {
        formData.append("images", imgObj.file);
      });
    }

    if (user && user.id) {
      formData.append("student", user.id);
    }

    try {
      setSubmitting(true);
      setSubmissionError("");
      const res = await fetch(`${BASE_API}api/classsubmissions/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setSubmissionSuccess(true);
        setSubmissionFile(null);
        setHandwrittenImages([]);
        setExtractedText("");
        showToast("Assignment submitted successfully!", "success");
        fetchAssignmentDetails(token);
      } else {
        const errData = await res.json();
        setSubmissionError(errData.detail || "Failed to submit assignment.");
      }
    } catch (err) {
      setSubmissionError("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="py-8">
        <ShimmerCard />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="text-center p-8 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 rounded-3xl max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <p className="text-slate-800 dark:text-white font-bold">{error || "Assignment not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 btn-primary text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isTeacher = user?.is_teacher;
  const isPastDeadline = new Date(assignment.dead_line) < new Date();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <title>Assignment details | GradifyAI</title>

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs sm:text-sm transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Classroom
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ═══════════════ LEFT COLUMN: ASSIGNMENT INFORMATION ═══════════════ */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white dark:bg-slate-900/45 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {assignment.title}
              </h1>
              {!isPastDeadline ? (
                <Badge variant="emerald" className="shrink-0 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </Badge>
              ) : (
                <Badge variant="rose" className="shrink-0">Closed</Badge>
              )}
            </div>

            <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/80 pt-5">
              <div className="flex items-center gap-3 text-xs">
                <Calendar className="w-4.5 h-4.5 text-indigo-500" />
                <span className="text-slate-500"><strong className="font-bold text-slate-700 dark:text-slate-300">Due Date:</strong> {formatDate(assignment.dead_line)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <FileText className="w-4.5 h-4.5 text-indigo-500" />
                <span className="text-slate-500"><strong className="font-bold text-slate-700 dark:text-slate-300">Total Marks:</strong> {assignment.max_marks} points</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Award className="w-4.5 h-4.5 text-indigo-500" />
                <span className="text-slate-500"><strong className="font-bold text-slate-700 dark:text-slate-300">Minimum Wordcount:</strong> {assignment.min_words} words</span>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-5">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Grading Criteria</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {assignment.description || "No description provided."}
              </p>
            </div>

            {assignment.file && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
                <a
                  href={assignment.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 p-3 rounded-2xl font-extrabold text-xs hover:bg-indigo-100 transition border border-indigo-150"
                >
                  <Download className="w-4.5 h-4.5" /> Reference Attachment
                </a>
              </div>
            )}
          </section>
        </div>

        {/* ═══════════════ RIGHT COLUMN: SUBMISSIONS OR GRADINGS ═══════════════ */}
        <div className="lg:col-span-2">
          
          {/* TEACHER DASHBOARD SHORTCUT */}
          {isTeacher ? (
            <div className="bg-white dark:bg-slate-900/40 border border-indigo-500/10 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-850 dark:text-white">Cohort grading desk</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  Review student documents, edit NLP marks, examine plagiarism feedback and override scores.
                </p>
              </div>
              <button
                onClick={() => navigate(`/teacher/assignment/${id}/submissions`)}
                className="w-full btn-primary py-3"
              >
                Grade Student Cohort
              </button>
            </div>
          ) : (
            
            // STUDENT WORKSPACE SUBMISSION PANEL
            <div className={`bg-white dark:bg-slate-900/40 rounded-3xl border p-6 sm:p-8 shadow-sm transition-colors ${
              submissionSuccess || mySubmission 
                ? "border-emerald-500/20" 
                : "border-slate-200/60 dark:border-slate-800"
            }`}>
              
              <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-6 flex items-center gap-2">
                <Upload className="w-5.5 h-5.5 text-indigo-500" />
                Submit Assignment Work
              </h3>

              {submissionSuccess || mySubmission ? (
                <div className="space-y-6">
                  <div className="text-center bg-emerald-500/[0.03] dark:bg-emerald-950/10 p-6 rounded-2xl border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-400">Submission Recorded Successfully!</h4>
                    <p className="text-slate-500 text-xs mt-1">Your documents have been processed and uploaded.</p>
                  </div>

                  {mySubmission && (
                    <div className="bg-slate-50 dark:bg-slate-950/30 rounded-2xl p-6 border border-slate-200/40 dark:border-slate-850 space-y-4 text-xs">
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200/40 dark:border-slate-800/40">
                        <span className="text-slate-400 dark:text-slate-500 font-bold">DATE SUBMITTED</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{formatDate(mySubmission.created_at || mySubmission.submitted_at)}</span>
                      </div>
                      
                      {mySubmission.submitted_file && (
                        <div className="flex justify-between items-center py-2.5 border-b border-slate-200/40 dark:border-slate-800/40">
                          <span className="text-slate-400 dark:text-slate-500 font-bold">SUBMITTED FILE</span>
                          <a
                            href={mySubmission.submitted_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Uploaded File
                          </a>
                        </div>
                      )}

                      {/* Display scanned handwritten pictures if any */}
                      {mySubmission.images && mySubmission.images.length > 0 && (
                        <div className="py-2.5 border-b border-slate-200/40 dark:border-slate-800/40">
                          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">SCANNED HANDWRITTEN PAGES</span>
                          <div className="flex flex-wrap gap-2.5">
                            {mySubmission.images.map((imgObj, idx) => (
                              <a
                                key={imgObj.id || idx}
                                href={imgObj.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group block w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:scale-105 transition-all shadow-sm shrink-0"
                              >
                                <img src={imgObj.image} alt={`Handwriting Page ${idx + 1}`} className="w-full h-full object-cover" />
                                <span className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-all">Page {idx + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Agent Score vs Teacher override display */}
                      {(assignment.show_openai_score || assignment.show_teacher_marks) && (
                        <div className={`grid ${assignment.show_openai_score && assignment.show_teacher_marks ? "grid-cols-2" : "grid-cols-1"} gap-4 pt-4`}>
                          {assignment.show_openai_score && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-4 rounded-xl text-center shadow-sm">
                              <span className="block text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">AI AGENT SCORE</span>
                              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 inline-block">
                                {mySubmission.openai_score !== null && mySubmission.openai_score !== undefined
                                  ? `${mySubmission.openai_score} / ${assignment.max_marks}`
                                  : "Calculating..."}
                              </span>
                            </div>
                          )}
                          {assignment.show_teacher_marks && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-4 rounded-xl text-center shadow-sm">
                              <span className="block text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">TEACHER OVERRIDE</span>
                              <span className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 inline-block">
                                {mySubmission.teacher_marks !== null && mySubmission.teacher_marks !== undefined
                                  ? `${mySubmission.teacher_marks} / ${assignment.max_marks}`
                                  : "Pending Review"}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {assignment.show_model_score && (
                        <div className="flex justify-between items-center py-2.5 mt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                          <span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">SYSTEM MODEL SCORE</span>
                          <span className="font-extrabold text-sm text-indigo-500">
                            {mySubmission.marks !== undefined && mySubmission.marks !== null ? `${mySubmission.marks} / ${assignment.max_marks}` : "Pending Evaluation"}
                          </span>
                        </div>
                      )}

                      {mySubmission.feedback && (
                        <div className="bg-yellow-500/[0.03] dark:bg-slate-900 border border-yellow-500/10 p-4 rounded-2xl mt-4">
                          <strong className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> AI Feedback & Plagiarism Audit
                          </strong>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                            {mySubmission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                
                // SUBMISSION FORM
                <form onSubmit={handleSubmission} className="space-y-6">
                  {submissionError && (
                    <div className="flex items-start p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 text-rose-700 rounded-2xl text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 mr-2" />
                      <span>{submissionError}</span>
                    </div>
                  )}

                  {/* SUBMISSION STYLE SELECTOR TABS */}
                  <div className="flex border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-xs font-bold rounded-xl text-center transition-all ${
                        submissionMethod === "file"
                          ? "bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                      onClick={() => setSubmissionMethod("file")}
                    >
                      Upload Digital File
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                        submissionMethod === "handwritten"
                          ? "bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                      onClick={() => setSubmissionMethod("handwritten")}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> AI OCR Handwriting
                    </button>
                  </div>

                  {/* STANDARD FILE UPLOADS */}
                  {submissionMethod === "file" ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-350">UPLOAD CORE DOCUMENT</label>
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all cursor-pointer relative group">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSubmissionFile(e.target.files[0]);
                              showToast(`Loaded ${e.target.files[0].name}`, "info");
                            }
                          }}
                        />
                        <Upload className="w-9 h-9 text-slate-400 mx-auto mb-3 group-hover:scale-110 transition" />
                        <p className="text-xs text-slate-500 font-semibold">
                          {submissionFile ? (
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{submissionFile.name}</span>
                          ) : "Browse files or drag & drop here"}
                        </p>
                      </div>
                      <p className="text-[10px] text-center text-slate-450 dark:text-slate-500">
                        Accepted formats: PDF, DOCX, ZIP. Maximum size allocation: 10MB.
                      </p>
                    </div>
                  ) : (
                    
                    // HANDWRITING IMAGE SCANS + AI OCR EXTRACTION
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-350">ATTACH HANDWRITTEN PAGES</label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all cursor-pointer relative group">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleAddImage}
                          />
                          <Plus className="w-8 h-8 text-slate-450 mx-auto mb-2 group-hover:scale-110 transition" />
                          <p className="text-xs text-slate-500 font-semibold">Attach handwriting snaps</p>
                        </div>
                      </div>

                      {/* Display added image thumbnail preview deck */}
                      {handwrittenImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 border border-slate-200/50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl max-h-44 overflow-y-auto">
                          {handwrittenImages.map((imgObj, idx) => (
                            <div key={idx} className="relative group w-full aspect-square bg-slate-200 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-300/40">
                              <img src={imgObj.preview} alt={`Upload preview ${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="absolute bottom-1.5 left-1.5 bg-black/60 px-2 py-0.5 rounded-md text-[8px] text-white font-extrabold">Page {idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleExtractText}
                        disabled={ocrLoading || handwrittenImages.length === 0}
                        className={`w-full py-3 rounded-2xl font-extrabold flex items-center justify-center gap-2 border shadow-sm transition-all text-xs ${
                          handwrittenImages.length === 0
                            ? "bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 border-slate-200/50 dark:border-slate-800 cursor-not-allowed"
                            : ocrLoading
                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border-indigo-200/30"
                            : "bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-750 dark:text-indigo-400 border-indigo-200/60 hover:shadow"
                        }`}
                      >
                        {ocrLoading ? (
                          <>
                            <div className="w-4 h-4 animate-spin border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                            Analyzing handwritten notes...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-indigo-500" /> Extract Text using AI OCR
                          </>
                        )}
                      </button>

                      {extractedText && (
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">EXTRACTED DRAFT (REVIEW & ADJUST)</label>
                          <textarea
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                            rows={7}
                            className="w-full p-4 border border-indigo-100 dark:border-slate-850 bg-indigo-500/[0.01] rounded-2xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-y shadow-inner font-mono leading-relaxed"
                            placeholder="Fine-tune extracted text so AI semantic rubrics can score perfectly..."
                          />
                        </div>
                      )}
                      
                      <p className="text-[10px] text-center text-slate-450 dark:text-slate-500">
                        Accepted snap formats: PNG, JPG, JPEG. Ensure handwriting is legible.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || isPastDeadline || ocrLoading}
                    className={`w-full py-3.5 rounded-2xl font-extrabold shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
                      isPastDeadline || ocrLoading
                        ? "bg-slate-200 dark:bg-slate-850 text-slate-400 dark:text-slate-650 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95 transform"
                    }`}
                  >
                    {submitting ? "Uploading Documents..." : isPastDeadline ? "Submission deadline passed" : "Submit Assignment Work"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
