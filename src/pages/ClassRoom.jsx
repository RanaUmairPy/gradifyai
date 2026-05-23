import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase, Plus, X, AlertCircle, Download, Users, 
  UserMinus, BarChart3, Calendar, Mail, Hash, RefreshCcw, 
  AlertTriangle, ArrowLeft, Sparkles, BookOpen, Trash2, CheckCircle
} from "lucide-react";
import BASE_API from "../BaseApi";
import AssignmentForm from "../components/AssignmentForm";
import AssignmentList from "../components/AssignmentList";
import { useToast } from "../context/ToastContext";
import { ShimmerDashboard } from "../components/ui/Shimmer";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

const ClassRoom = ({ classId }) => {
  const params = useParams();
  const id = classId || params.id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [classInfo, setClassInfo] = useState(null);

  // Tabs + Students panel
  const [activeTab, setActiveTab] = useState("assignments");
  const [studentsData, setStudentsData] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  
  // Custom interactive modals state
  const [removingStudent, setRemovingStudent] = useState(null);
  const [removingInProgress, setRemovingInProgress] = useState(false);
  
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);
  
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    if (id) {
      loadClassData(token);
    } else {
      setError("Invalid Class ID");
      setLoading(false);
    }
  }, [navigate, id]);

  const loadClassData = async (token) => {
    setLoading(true);
    try {
      // 1. Class Details
      const classRes = await fetch(`${BASE_API}api/classclassrooms/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!classRes.ok) throw new Error("Failed to load class details");

      const classData = await classRes.json();
      setClassInfo(classData);

      // 2. Assignments list
      const assignRes = await fetch(
        `${BASE_API}api/classassignments/?classroom=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (assignRes.ok) {
        const data = await assignRes.json();
        setAssignments(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch assignments.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load classroom records.");
    } finally {
      setLoading(false);
    }
  };

  const refreshAssignments = async () => {
    const token = localStorage.getItem("access");
    loadClassData(token);
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem("access");
    setLoadingStudents(true);
    setStudentsError("");
    try {
      const res = await fetch(`${BASE_API}api/classclassrooms/${id}/students/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudentsData(data);
      } else {
        const err = await res.json().catch(() => ({}));
        setStudentsError(err.error || err.detail || "Failed to load students.");
      }
    } catch (e) {
      setStudentsError("Network error while loading students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  // Sync students data
  useEffect(() => {
    if (
      activeTab === "students" &&
      user?.is_teacher &&
      !studentsData &&
      !loadingStudents &&
      !studentsError
    ) {
      fetchStudents();
    }
  }, [activeTab, user]);

  const handleConfirmRemoveStudent = async () => {
    if (!removingStudent) return;
    const token = localStorage.getItem("access");
    try {
      setRemovingInProgress(true);
      const res = await fetch(
        `${BASE_API}api/classclassrooms/${id}/remove-student/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ student_id: removingStudent.id }),
        }
      );
      if (res.ok) {
        setStudentsData((prev) =>
          prev
            ? {
                ...prev,
                students: prev.students.filter((s) => s.id !== removingStudent.id),
                total_students: Math.max(0, (prev.total_students || 0) - 1),
              }
            : prev
        );
        showToast("Student removed from class", "info");
        setRemovingStudent(null);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || err.detail || "Removal failed", "error");
      }
    } catch (e) {
      showToast("Network error. Try again.", "error");
    } finally {
      setRemovingInProgress(false);
    }
  };

  const formatDateTime = (s) => {
    if (!s) return "Never";
    return new Date(s).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateAssignment = async (formData, file, onSuccess) => {
    if (!formData) {
      setShowForm(false);
      return;
    }
    const token = localStorage.getItem("access");
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("max_marks", formData.max_marks);
    data.append("min_words", formData.min_words);
    data.append("show_openai_score", formData.show_openai_score);
    data.append("show_model_score", formData.show_model_score);
    data.append("show_teacher_marks", formData.show_teacher_marks);

    const keywords = formData.required_keywords.split(",").map(k => k.trim()).filter(k => k);
    keywords.forEach(k => data.append("required_keywords", k));

    data.append("classroom", id);
    data.append("classroom_id", id);

    if (formData.dead_line) {
      data.append("dead_line", new Date(formData.dead_line).toISOString());
    }

    if (file) {
      data.append("file", file);
    }

    try {
      setCreating(true);
      const res = await fetch(`${BASE_API}api/classassignments/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        showToast("Assignment created successfully!", "success");
        setShowForm(false);
        onSuccess(); // Reset inner form state
        refreshAssignments();
      } else {
        const errData = await res.json();
        showToast(errData.detail || "Failed to save assignment details", "error");
      }
    } catch (error) {
      showToast("Network error. Please verify coordinates.", "error");
    } finally {
      setCreating(false);
    }
  };

  const executeDeleteAssignment = async () => {
    if (!deletingAssignmentId) return;
    const token = localStorage.getItem("access");
    
    try {
      setDeletingInProgress(true);
      const res = await fetch(`${BASE_API}api/classassignments/${deletingAssignmentId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast("Assignment deleted.", "info");
        setDeletingAssignmentId(null);
        refreshAssignments();
      } else {
        showToast("Failed to delete assignment.", "error");
      }
    } catch (error) {
      showToast("Network error occurred.", "error");
    } finally {
      setDeletingInProgress(false);
    }
  };

  const handleDownloadCsv = async () => {
    const token = localStorage.getItem("access");
    try {
      setDownloadingCsv(true);
      const res = await fetch(`${BASE_API}api/classclassrooms/${id}/generate-result-csv/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        
        const safeName = (classInfo?.name || "classroom")
          .trim()
          .replace(/[\\/:*?"<>|]+/g, "")
          .replace(/\s+/g, "_");
        const safeCode = (classInfo?.code || id)
          .toString()
          .replace(/[\\/:*?"<>|]+/g, "")
          .replace(/\s+/g, "_");
        
        a.download = `${safeName}_${safeCode}_results.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showToast("Grades report CSV downloaded successfully!", "success");
      } else {
        showToast("No active student submissions found to download report", "warning");
      }
    } catch (err) {
      showToast("Network error downloading file.", "error");
    } finally {
      setDownloadingCsv(false);
    }
  };

  if (loading) {
    return <ShimmerDashboard />;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* ═══════════════ CLASSROOM BRANDING DETAILS PANEL ═══════════════ */}
      <header className="bg-white dark:bg-slate-900/40 border border-slate-250/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-500" />
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">CLASSROOM SYLLABUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-white leading-tight">
            {classInfo ? classInfo.name : "Classroom assignments"}
          </h1>
          {classInfo && (
            <Badge variant="indigo" className="font-mono tracking-wider !px-3 !py-1 !text-xs">
              Access Code: {classInfo.code}
            </Badge>
          )}
        </div>
        
        {user?.is_teacher && (
          <div className="flex flex-wrap gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-end">
            <button
              onClick={handleDownloadCsv}
              disabled={downloadingCsv}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/10 hover:bg-emerald-700 transition active:scale-95 text-xs sm:text-sm"
            >
              <Download className="w-4.5 h-4.5" /> {downloadingCsv ? "Downloading..." : "Export Grades (CSV)"}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition active:scale-95 text-xs sm:text-sm"
            >
              <Plus className="w-4.5 h-4.5" /> Create Assignment
            </button>
          </div>
        )}
      </header>

      {/* ═══════════════ TABS SELECTION CONTROLS ═══════════════ */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1.5 rounded-2xl inline-flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "assignments"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" /> Assignments
          </button>
          
          {user?.is_teacher && (
            <button
              onClick={() => setActiveTab("students")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === "students"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Users className="w-4.5 h-4.5" /> Students
              {studentsData?.total_students !== undefined && (
                <span
                  className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === "students"
                      ? "bg-white text-indigo-600 animate-pulse"
                      : "bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400"
                  }`}
                >
                  {studentsData.total_students}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════ TABS VIEWS PANELS ═══════════════ */}
      
      {/* 1. Assignments view */}
      {activeTab === "assignments" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Active Assignment Tasks
                <Badge variant="indigo">{assignments.length}</Badge>
              </h2>
              <p className="text-xs text-slate-500">View criteria guidelines, deadlines, and grade statuses</p>
            </div>
          </div>

          {error && !loading && (
            <div className="flex items-start p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mr-3 mt-0.5" />
              <div>
                <p className="text-rose-800 dark:text-rose-200 font-bold">Failed to load assignment list</p>
                <p className="text-rose-600 dark:text-rose-350 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {assignments.length === 0 && !error && (
            <div className="text-center bg-white dark:bg-slate-900/20 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No active assignments found</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                {user?.is_teacher 
                  ? "Initialize your classroom syllabus by adding customized keyword-scoring and handwritten OCR validations."
                  : "All quiet here. No active assignments posted by your professor yet."}
              </p>
              {user?.is_teacher && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Create First Assignment
                </button>
              )}
            </div>
          )}

          {assignments.length > 0 && (
            <div className="p-1 animate-fade-in-up">
              <AssignmentList
                assignments={assignments}
                onDelete={(assignmentId) => setDeletingAssignmentId(assignmentId)}
                isTeacher={user?.is_teacher}
              />
            </div>
          )}
        </section>
      )}

      {/* 2. Students management view */}
      {activeTab === "students" && user?.is_teacher && (
        <section className="space-y-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-250/60 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Classroom Cohort
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {studentsData
                  ? `${studentsData.total_students} student${studentsData.total_students === 1 ? "" : "s"} joined • ${studentsData.total_assignments} assignments configured`
                  : "Loading cohort records..."}
              </p>
            </div>
            
            <button
              onClick={fetchStudents}
              disabled={loadingStudents}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition border border-slate-200/60 dark:border-slate-800 disabled:opacity-60 shrink-0 self-start sm:self-auto"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${loadingStudents ? "animate-spin" : ""}`} />
              Sync Roster
            </button>
          </div>

          {loadingStudents && !studentsData && (
            <div className="text-center py-20 bg-white dark:bg-slate-900/20 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse">
              <div className="animate-spin text-indigo-650 mb-3 inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
              <p className="text-slate-400 text-xs font-bold">Synchronizing records...</p>
            </div>
          )}

          {studentsError && !loadingStudents && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-250 text-rose-700 p-5 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-rose-800 dark:text-rose-200">Could not synchronize roster</p>
                <p className="text-xs mt-1">{studentsError}</p>
                <button
                  onClick={fetchStudents}
                  className="mt-3 text-xs font-black underline hover:text-rose-900"
                >
                  Retry Now
                </button>
              </div>
            </div>
          )}

          {studentsData && studentsData.students.length === 0 && !loadingStudents && (
            <div className="text-center bg-white dark:bg-slate-900/20 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No students joined yet</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Share this classroom's unique access code <strong className="font-mono text-indigo-600 dark:text-indigo-400">{classInfo?.code}</strong> with your students to construct the cohort database.
              </p>
            </div>
          )}

          {studentsData && studentsData.students.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {studentsData.students.map((s) => {
                const submitPct = s.total_assignments > 0 
                  ? Math.round((s.submitted_count / s.total_assignments) * 100) 
                  : 0;
                  
                return (
                  <div
                    key={s.id}
                    className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-indigo-500/10 transition-all flex flex-col justify-between gap-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-indigo-150 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold text-base flex items-center justify-center shrink-0 border border-indigo-200/40 dark:border-indigo-900">
                          {s.name?.charAt(0).toUpperCase() || s.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 dark:text-white truncate text-sm">
                            {s.name || s.username}
                          </h3>
                          <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {s.email}
                          </p>
                          {s.roll_number && (
                            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {s.roll_number}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setRemovingStudent(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition shrink-0"
                        title="Remove student from class"
                      >
                        <UserMinus className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* cohort statistical card indicators */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-indigo-50/50 dark:bg-indigo-950/25 p-2 rounded-xl text-center">
                        <span className="text-[8px] uppercase font-black tracking-wider text-indigo-500 dark:text-indigo-400">SUBMITTED</span>
                        <p className="text-base font-black text-indigo-750 dark:text-indigo-300 mt-0.5">
                          {s.submitted_count}
                          <span className="text-[10px] text-indigo-400 dark:text-indigo-500 font-bold">/{s.total_assignments}</span>
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/25 p-2 rounded-xl text-center">
                        <span className="text-[8px] uppercase font-black tracking-wider text-emerald-500 dark:text-emerald-400">GRADED</span>
                        <p className="text-base font-black text-emerald-750 dark:text-emerald-300 mt-0.5">{s.graded_count}</p>
                      </div>
                      <div className="bg-purple-50/50 dark:bg-purple-950/25 p-2 rounded-xl text-center">
                        <span className="text-[8px] uppercase font-black tracking-wider text-purple-500 dark:text-purple-400">CLASS AVG</span>
                        <p className="text-base font-black text-purple-750 dark:text-purple-300 mt-0.5">{s.average_marks !== null ? s.average_marks : "—"}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" /> Submission Rate
                        </span>
                        <span className="font-black text-slate-700 dark:text-slate-300">{submitPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${submitPct}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 pt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Last active: <strong className="font-medium text-slate-650 dark:text-slate-350">{formatDateTime(s.last_submission_at)}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════ MODALS & COHORT INTERACTIVE TRIGGERS ═══════════════ */}
      
      {/* 1. Add/Create Assignment Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        maxWidth="max-w-2xl"
        title="Setup Class Assignment"
      >
        <AssignmentForm onSubmit={handleCreateAssignment} creating={creating} />
      </Modal>

      {/* 2. Delete Assignment Modal */}
      <Modal
        isOpen={!!deletingAssignmentId}
        onClose={() => setDeletingAssignmentId(null)}
        title="Delete Assignment Task?"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-7 h-7 text-rose-600 dark:text-rose-450" />
          </div>
          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
            Are you absolutely sure you want to delete this assignment? All submitted homework records, semantic NLP marks, and AI assessments linked to this task will be permanently wiped.
          </p>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setDeletingAssignmentId(null)}
              disabled={deletingInProgress}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDeleteAssignment}
              disabled={deletingInProgress}
              className="flex-1 btn-danger"
            >
              {deletingInProgress ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. Remove Student Cohort Confirm */}
      <Modal
        isOpen={!!removingStudent}
        onClose={() => setRemovingStudent(null)}
        title="Remove Student from Roster?"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserMinus className="w-7 h-7 text-rose-600 dark:text-rose-455" />
          </div>
          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
            Are you absolutely sure you want to remove{" "}
            <span className="font-extrabold text-slate-900 dark:text-white">“{removingStudent?.name || removingStudent?.username}”</span>?
            They will lose access to classroom resources and cannot view deadlines. Submissions will be preserved in DB files.
          </p>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setRemovingStudent(null)}
              disabled={removingInProgress}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRemoveStudent}
              disabled={removingInProgress}
              className="flex-1 btn-danger"
            >
              {removingInProgress ? "Removing..." : "Confirm Removal"}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ClassRoom;
