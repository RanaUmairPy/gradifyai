import React, { useEffect, useState, useRef } from "react";
import {
  BookOpen, PlusCircle, AlertTriangle, Users, Book,
  MoreVertical, Edit3, Trash2, Save, Sparkles, Copy,
  Check, ArrowRight, BarChart2, Calendar, Search,
  Clock, ArrowUpRight, FileText, CheckCircle2
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import BASE_API from "../BaseApi";
import { useToast } from "../context/ToastContext";
import { ShimmerDashboard } from "../components/ui/Shimmer";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

const TeacherPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [creating, setCreating] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingClass, setDeletingClass] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const menuRef = useRef(null);

  const [rawAssignments, setRawAssignments] = useState([]);
  const [rawSubmissions, setRawSubmissions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadDashboardStats = async (currentClasses) => {
    const token = localStorage.getItem("access");
    if (!token || !currentClasses || currentClasses.length === 0) {
      setRawAssignments([]);
      setRawSubmissions([]);
      setLoadingStats(false);
      return;
    }

    try {
      setLoadingStats(true);

      const assignRes = await fetch(`${BASE_API}api/classassignments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let allAssignments = [];
      if (assignRes.ok) {
        const data = await assignRes.json();
        allAssignments = Array.isArray(data) ? data.map(assign => ({
          ...assign,
          classroomId: assign.classroom_id_val
        })) : [];
      }

      const subsRes = await fetch(`${BASE_API}api/classsubmissions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let allSubmissions = [];
      if (subsRes.ok) {
        const data = await subsRes.json();
        allSubmissions = Array.isArray(data) ? data.map(sub => ({
          ...sub,
          assignmentMaxMarks: sub.assignment_max_marks || 100,
          classroomId: sub.classroom_id_val
        })) : [];
      }

      setRawAssignments(allAssignments);
      setRawSubmissions(allSubmissions);
      setLoadingStats(false);
    } catch (e) {
      console.error("Error loading dashboard stats:", e);
      setLoadingStats(false);
    }
  };

  const computedStats = React.useMemo(() => {
    const filteredAssignments = selectedClassId === "all"
      ? rawAssignments
      : rawAssignments.filter(a => a.classroomId === Number(selectedClassId));

    const filteredSubmissions = selectedClassId === "all"
      ? rawSubmissions
      : rawSubmissions.filter(s => s.classroomId === Number(selectedClassId));

    const gradedSubmissions = filteredSubmissions.filter(
      (sub) => sub.teacher_marks !== null || sub.openai_score !== null || sub.marks !== null
    );

    const ocrTasksActive = filteredSubmissions.filter(
      sub => sub.images && sub.images.length > 0
    ).length;

    const totalSubmissions = filteredSubmissions.length;
    const gradedCount = gradedSubmissions.length;
    const pendingCount = totalSubmissions - gradedCount;

    let distribution = [
      { label: "A+ (85-100)", count: 0, color: "bg-emerald-600" },
      { label: "A (80-84)", count: 0, color: "bg-emerald-500" },
      { label: "B (65-79)", count: 0, color: "bg-indigo-500" },
      { label: "C (55-64)", count: 0, color: "bg-purple-500" },
      { label: "D (50-54)", count: 0, color: "bg-amber-500" },
      { label: "F (<50)", count: 0, color: "bg-rose-500" },
    ];

    gradedSubmissions.forEach((sub) => {
      const score = sub.teacher_marks !== null
        ? sub.teacher_marks
        : (sub.openai_score !== null ? sub.openai_score : sub.marks);

      if (score === null || score === undefined) return;
      const max = sub.assignmentMaxMarks || 100;
      const pct = max > 0 ? (score / max) * 100 : 0;
      if (pct >= 85) distribution[0].count++;
      else if (pct >= 80) distribution[1].count++;
      else if (pct >= 65) distribution[2].count++;
      else if (pct >= 55) distribution[3].count++;
      else if (pct >= 50) distribution[4].count++;
      else distribution[5].count++;
    });

    return {
      totalAssignments: filteredAssignments.length,
      totalSubmissions,
      gradedCount,
      pendingCount,
      activeOcrTasks: ocrTasksActive,
      gradeDistribution: distribution,
    };
  }, [selectedClassId, rawAssignments, rawSubmissions]);

  // Close options menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // Auth and Cache loading
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    setTeacher(user);

    // Cache load
    const cachedClasses = localStorage.getItem(`teacher_classes_${user.id}`);
    if (cachedClasses) {
      const parsed = JSON.parse(cachedClasses);
      setClasses(parsed);
      loadDashboardStats(parsed);
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetchClasses(token, user.id);
  }, [navigate]);

  const fetchClasses = async (token, userId) => {
    try {
      const res = await fetch(`${BASE_API}api/classclassrooms/my-classes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const teacherClasses = data.created_classes || [];
        setClasses(teacherClasses);
        loadDashboardStats(teacherClasses);
        if (userId) {
          localStorage.setItem(
            `teacher_classes_${userId}`,
            JSON.stringify(teacherClasses)
          );
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (!userId || !localStorage.getItem(`teacher_classes_${userId}`)) {
          setError(errorData.detail || "Failed to load classes from server.");
        }
      }
    } catch {
      if (!userId || !localStorage.getItem(`teacher_classes_${userId}`)) {
        setError("Network error occurred. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Create class
  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    if (!className.trim() || !classCode.trim()) {
      showToast("Please fill in all classroom details", "warning");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch(`${BASE_API}api/classclassrooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: className.trim(),
          code: classCode.trim(),
        }),
      });

      if (res.ok) {
        setClassName("");
        setClassCode("");
        setShowCreateModal(false);
        showToast("Classroom created successfully!", "success");
        fetchClasses(token, teacher?.id);
      } else {
        const data = await res.json();
        showToast(
          data.name?.[0] || data.code?.[0] || data.detail || "Failed to create class",
          "error"
        );
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setCreating(false);
    }
  };

  // Open Edit modal
  const openEditModal = (cls) => {
    setEditingClass(cls);
    setEditName(cls.name);
    setEditCode(cls.code);
    setEditError("");
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingClass) return;
    const token = localStorage.getItem("access");

    if (!editName.trim() || !editCode.trim()) {
      setEditError("Class name and code cannot be empty.");
      return;
    }

    try {
      setSavingEdit(true);
      setEditError("");
      const res = await fetch(`${BASE_API}api/classclassrooms/${editingClass.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          code: editCode.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setClasses((prev) => {
          const next = prev.map((c) =>
            c.id === editingClass.id ? { ...c, ...updated } : c
          );
          if (teacher?.id) {
            localStorage.setItem(`teacher_classes_${teacher.id}`, JSON.stringify(next));
          }
          return next;
        });
        showToast("Classroom settings updated", "success");
        setEditingClass(null);
      } else {
        const data = await res.json();
        setEditError(data.name?.[0] || data.code?.[0] || data.detail || "Update failed.");
      }
    } catch (err) {
      setEditError("Network error occurred.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete execution
  const handleConfirmDelete = async () => {
    if (!deletingClass) return;
    const token = localStorage.getItem("access");

    try {
      setDeleting(true);
      const res = await fetch(`${BASE_API}api/classclassrooms/${deletingClass.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok || res.status === 204) {
        setClasses((prev) => {
          const next = prev.filter((c) => c.id !== deletingClass.id);
          if (teacher?.id) {
            localStorage.setItem(`teacher_classes_${teacher.id}`, JSON.stringify(next));
          }
          return next;
        });
        showToast("Classroom deleted successfully", "info");
        setDeletingClass(null);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.detail || "Failed to delete classroom", "error");
      }
    } catch (err) {
      showToast("Network error during deletion", "error");
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (e, code, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    showToast("Classroom join code copied!", "success");
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const openDeleteConfirm = (cls) => {
    setDeletingClass(cls);
    setOpenMenuId(null);
  };

  // Derived dashboard statistics
  const totalStudents = classes.reduce((acc, c) => acc + (c.students?.length || 0), 0);

  const filteredClasses = classes.filter(cls => {
    const matchesClass = selectedClassId === "all" || cls.id === Number(selectedClassId);
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-4">
        <ShimmerDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* ═══════════════ GREETING & HERO PANEL ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-750 via-indigo-650 to-violet-800 dark:from-slate-900 dark:via-indigo-950/70 dark:to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-indigo-500/20 dark:border-slate-800/80 transition-all duration-300">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/20 to-violet-600/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-indigo-500/10 text-indigo-100 dark:text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider border border-white/10 dark:border-indigo-500/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" /> Workspace Active
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-slate-50 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-50 dark:via-indigo-100 dark:to-white">
              Welcome back, <span className="text-white font-extrabold border-b-4 border-dashed border-indigo-400/60 pb-1">{teacher?.name || "Professor"}</span>
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 dark:text-slate-350 max-w-2xl font-medium leading-relaxed font-sans">
              Track student enrollment, assignment criteria, and review semantic AI auto-grading results inside your classrooms.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="self-start lg:self-center shrink-0 flex items-center gap-2.5 bg-white dark:bg-indigo-600 hover:bg-slate-50 dark:hover:bg-indigo-500 text-indigo-700 dark:text-white font-black px-6 py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-xs uppercase tracking-wider border border-indigo-100/20 dark:border-indigo-500"
          >
            <PlusCircle className="w-5 h-5" /> Create New Class
          </button>
        </div>
      </section>

      {/* ═══════════════ INTERACTIVE ANALYTICS FILTER ═══════════════ */}
      {classes.length > 0 && (
        <section className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-150 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
              Interactive Analytics Panel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">Filter all dashboard statistics and distribution metrics by classroom</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Classroom:</span>
            <div className="relative">
              <select
                id="classroom-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="appearance-none pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm transition-all"
              >
                <option value="all">All Classrooms</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ STATS GRID CARD PANELS ═══════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: selectedClassId === "all" ? "Active Classrooms" : "Class Code",
            value: selectedClassId === "all" ? classes.length : (classes.find(c => c.id === Number(selectedClassId))?.code || "N/A"),
            icon: BookOpen,
            color: "text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/40"
          },
          {
            title: selectedClassId === "all" ? "Total Students Joined" : "Enrolled Students",
            value: selectedClassId === "all" ? totalStudents : (classes.find(c => c.id === Number(selectedClassId))?.students?.length || 0),
            icon: Users,
            color: "text-emerald-650 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-155/40"
          },
          {
            title: "Total Assignments",
            value: loadingStats ? "..." : computedStats.totalAssignments,
            icon: BarChart2,
            color: "text-purple-650 bg-purple-50 dark:bg-purple-950/40 border border-purple-150/40"
          },
          {
            title: "OCR Tasks Active",
            value: loadingStats ? "..." : computedStats.activeOcrTasks,
            icon: Calendar,
            color: "text-amber-650 bg-amber-50 dark:bg-amber-950/40 border border-amber-150/40"
          }
        ].map((stat, idx) => {
          const isClassCode = stat.title === "Class Code";
          return (
            <div
              key={idx}
              onClick={() => {
                if (isClassCode && stat.value !== "N/A") {
                  navigator.clipboard.writeText(stat.value);
                  showToast("Class code copied!", "success");
                }
              }}
              className={`bg-white/90 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-150 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all duration-300 ${isClassCode && stat.value !== "N/A"
                  ? "cursor-pointer hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50/50 dark:hover:bg-slate-850/30"
                  : "hover:shadow-md hover:-translate-y-1"
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color} transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex-grow min-w-0">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 block uppercase tracking-wider">{stat.title}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white leading-tight truncate">
                    {stat.value}
                  </span>
                  {isClassCode && stat.value !== "N/A" && (
                    <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-slate-550 hover:text-indigo-500 cursor-pointer shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ═══════════════ CLASSROOM PANELS GRID LISTING ═══════════════ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
              All Created Classrooms
              <Badge variant="indigo" className="px-2.5 py-0.5 text-[10px] font-black">{filteredClasses.length}</Badge>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-450 font-semibold">Manage classroom configurations and assignment workflows</p>
          </div>

          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search classrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 dark:text-slate-200 shadow-sm transition-all placeholder-slate-400 dark:placeholder-slate-600"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl animate-shake">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="text-rose-800 dark:text-rose-200 font-bold">Failed to load classes</p>
              <p className="text-rose-600 dark:text-rose-350 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {filteredClasses.length === 0 && !error && (
          <div className="text-center bg-white/50 dark:bg-slate-900/20 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Book className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {searchTerm || selectedClassId !== "all" ? "No matching classrooms" : "No classrooms available"}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6 font-medium">
              {searchTerm || selectedClassId !== "all"
                ? "Try adjusting your search query or selecting a different classroom filter."
                : "Create your first online classroom structure to set up keyword constraints, AI auto-evaluations, and direct CSV grading results."}
            </p>
            {(!searchTerm && selectedClassId === "all") && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary px-6 py-3 text-xs uppercase tracking-wider font-extrabold"
              >
                Set up First Classroom
              </button>
            )}
          </div>
        )}

        {filteredClasses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((cls, idx) => {
              const borderAccents = [
                "border-t-indigo-500 dark:border-t-indigo-500",
                "border-t-emerald-500 dark:border-t-emerald-500",
                "border-t-purple-500 dark:border-t-purple-500",
                "border-t-amber-500 dark:border-t-amber-500",
              ];
              const accentClass = borderAccents[idx % borderAccents.length];

              return (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/teacher/class/${cls.id}`)}
                  className={`group relative bg-white/95 dark:bg-slate-900/60 rounded-2xl p-6 border-t-4 ${accentClass} border-x border-b border-slate-150 dark:border-slate-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col`}
                >
                  {/* 3-dot Options menu trigger */}
                  <div
                    className="absolute top-4 right-4 z-10"
                    ref={openMenuId === cls.id ? menuRef : null}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cls.id ? null : cls.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-slate-550 hover:text-indigo-650 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200"
                      aria-label="Class Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === cls.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl py-1 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(cls);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-550" /> Settings
                        </button>
                        <hr className="border-slate-100 dark:border-slate-800/85" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirm(cls);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete Classroom
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Main classroom information */}
                  <div className="flex-grow space-y-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center group-hover:scale-110 transition duration-300">
                      <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition duration-200">
                        {cls.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-450 mt-1.5 font-medium">
                        <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <span>{cls.students?.length || 0} students enrolled</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer and Code Shortcut */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={(e) => copyToClipboard(e, cls.code, cls.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-650 dark:text-slate-350 font-extrabold text-xs transition duration-200 border border-slate-200/40 dark:border-slate-800"
                      title="Copy Join Code"
                    >
                      {copiedCodeId === cls.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                          <span className="font-mono text-slate-800 dark:text-white">{cls.code}</span>
                        </>
                      )}
                    </button>

                    <span className="text-indigo-600 dark:text-indigo-400 text-xs font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Manage <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════ MODALS & DIALOGS ═══════════════ */}
      {/* 1. Create Class Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Classroom"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <p className="text-xs text-slate-500 mb-2">Initialize a digital workspace. Students will use the code to join.</p>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Classroom Name</label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Physics Section B"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Join Code</label>
            <input
              type="text"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="e.g. PHY101"
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 btn-primary"
            >
              {creating ? "Creating..." : "Save Classroom"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Edit Settings Modal */}
      <Modal
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
        title="Classroom Settings"
      >
        {editError && (
          <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-xs text-rose-700 dark:text-rose-350">{editError}</p>
          </div>
        )}
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Classroom Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Classroom Code</label>
            <input
              type="text"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditingClass(null)}
              className="flex-1 btn-secondary"
              disabled={savingEdit}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="flex-1 btn-primary"
            >
              {savingEdit ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingClass}
        onClose={() => setDeletingClass(null)}
        title="Delete Classroom?"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-7 h-7 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
            Are you absolutely sure you want to delete classroom{" "}
            <span className="font-extrabold text-slate-900 dark:text-white">“{deletingClass?.name}”</span>?
            This will permanently remove all student submissions, homework tasks, grades, and reference attachments. This cannot be undone.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setDeletingClass(null)}
              disabled={deleting}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="flex-1 btn-danger"
            >
              {deleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default TeacherPage;
