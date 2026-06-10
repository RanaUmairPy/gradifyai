import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, ChevronRight, AlertTriangle, XCircle, 
  Search, Grid, Layers, PlusCircle, Sparkles, Award, 
  CheckCircle, HelpCircle, FileText, Calendar, Clock
} from "lucide-react";
import BASE_API from "../BaseApi";
import { useToast } from "../context/ToastContext";
import { ShimmerDashboard } from "../components/ui/Shimmer";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { PerformanceGauge } from "../components/ui/Charts";
import { ActivityCalendar } from "../components/ui/ActivityCalendar";

const StudentPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  
  // Custom Join modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);

  // Calculate statistics dynamically
  const gradedSubmissions = submissions.filter(
    (s) => s.openai_score !== null && s.openai_score !== undefined
  );
  let avgPercent = 0;
  let avgScoreStr = "N/A";
  if (gradedSubmissions.length > 0) {
    let totalPercent = 0;
    gradedSubmissions.forEach((sub) => {
      const maxMarks = sub.assignment_details?.max_marks || sub.assignment?.max_marks || 100;
      const score = parseFloat(sub.openai_score);
      totalPercent += (score / maxMarks) * 100;
    });
    avgPercent = Math.round(totalPercent / gradedSubmissions.length);
    avgScoreStr = `${avgPercent}%`;
  }

  // Filter assignments that have not been submitted yet and are not closed/overdue
  const pendingAssignments = allAssignments.filter((assign) => {
    const hasSubmitted = submissions.some(
      (sub) => sub.assignmentId === assign.id
    );
    if (hasSubmitted) return false;

    const isClosed = assign.dead_line && new Date(assign.dead_line) < new Date();
    if (isClosed) return false;

    return true;
  });

  const getWeeklySubmissionActivity = (subs) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    subs.forEach((sub) => {
      const dateStr = sub.created_at || sub.submitted_at;
      if (dateStr) {
        const dayName = days[new Date(dateStr).getDay()];
        counts[dayName]++;
      }
    });
    return [
      { label: "Mon", value: counts["Mon"] },
      { label: "Tue", value: counts["Tue"] },
      { label: "Wed", value: counts["Wed"] },
      { label: "Thu", value: counts["Thu"] },
      { label: "Fri", value: counts["Fri"] },
      { label: "Sat", value: counts["Sat"] },
      { label: "Sun", value: counts["Sun"] },
    ];
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    setStudent(user);

    // Initial Cache
    const cachedClasses = localStorage.getItem(`student_classes_${user.id}`);
    if (cachedClasses) {
      const parsed = JSON.parse(cachedClasses);
      setClasses(parsed);
      setLoading(false);
      fetchSubmissions(token, parsed);
    } else {
      setLoading(true);
    }

    fetchJoinedClasses(token, user.id);
  }, [navigate]);

  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const results = classes.filter(
      (cls) =>
        cls.name.toLowerCase().includes(lowerCaseSearch) ||
        cls.created_by?.name.toLowerCase().includes(lowerCaseSearch) ||
        cls.code.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredClasses(results);
  }, [searchTerm, classes]);

  const fetchJoinedClasses = async (token, userId) => {
    try {
      const res = await fetch(`${BASE_API}api/classclassrooms/my-classes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const results = data.joined_classes || data || [];
        setClasses(results);
        localStorage.setItem(`student_classes_${userId}`, JSON.stringify(results));
        fetchSubmissions(token, results);
      } else {
        const errorData = await res.json();
        if (!localStorage.getItem(`student_classes_${userId}`)) {
          setError(errorData.detail || "Failed to load classes.");
        }
      }
    } catch {
      if (!localStorage.getItem(`student_classes_${userId}`)) {
        setError("Network error occurred. Check connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (token, loadedClasses) => {
    try {
      setSubmissionsLoaded(false);
      const activeClasses = loadedClasses || classes;
      if (!activeClasses || activeClasses.length === 0) {
        setSubmissions([]);
        setSubmissionsLoaded(true);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      
      // Parallelize fetching of assignments for each class
      const assignmentPromises = activeClasses.map(cls =>
        fetch(`${BASE_API}api/classassignments/?classroom=${cls.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : [])
      );

      const assignmentsResults = await Promise.all(assignmentPromises);
      
      // Extract all assignment IDs and flat assignments list
      const allAssignmentIds = [];
      const flatAssignments = [];
      assignmentsResults.forEach(data => {
        const list = Array.isArray(data) ? data : [];
        list.forEach(assign => {
          if (assign?.id) {
            allAssignmentIds.push(assign.id);
            flatAssignments.push(assign);
          }
        });
      });

      setAllAssignments(flatAssignments);

      if (allAssignmentIds.length === 0) {
        setSubmissions([]);
        return;
      }

      // Parallelize fetching of submissions for each assignment
      const submissionPromises = allAssignmentIds.map(assignId =>
        fetch(`${BASE_API}api/classsubmissions/?assignment_id=${assignId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(async res => {
          if (res.ok) {
            const data = await res.json();
            return { assignId, data };
          }
          return { assignId, data: [] };
        })
      );

      const submissionsResults = await Promise.all(submissionPromises);

      // Filter and accumulate the student's actual submissions
      const allSubmissions = [];
      submissionsResults.forEach(({ assignId, data }) => {
        if (Array.isArray(data)) {
          const mine = data.filter(s =>
            (s.student?.id === user.id) ||
            (s.student?.username === user.username) ||
            (s.student === user.id)
          );
          mine.forEach(s => {
            s.assignmentId = assignId;
          });
          allSubmissions.push(...mine);
        }
      });

      setSubmissions(allSubmissions);
      setSubmissionsLoaded(true);
    } catch (err) {
      console.error("Error gathering submissions dynamically:", err);
      setSubmissionsLoaded(true);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    if (!classCode.trim()) {
      showToast("Please enter a valid class code", "warning");
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
        body: JSON.stringify({ code: classCode.trim() }),
      });

      if (res.ok) {
        showToast("Successfully joined the classroom!", "success");
        setClassCode("");
        setJoinModalOpen(false);
        fetchJoinedClasses(token, student?.id);
      } else {
        const data = await res.json();
        showToast(data.detail || data.code?.[0] || "Invalid class code", "error");
      }
    } catch (err) {
      showToast("Network error. Try again.", "error");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <ShimmerDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <title>Student Dashboard | GradifyAI</title>

      {/* ═══════════════ GREETING & HERO PANEL ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-250 text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Active
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
              Welcome back, <span className="underline decoration-emerald-400 decoration-wavy">{student?.name || "Student"}</span>
            </h1>
            <p className="text-sm sm:text-base text-teal-55 max-w-xl">
              Hop into joined classes, check active homework deadlines, review semantic grading markers, and view feedback records.
            </p>
          </div>
          
          <button
            onClick={() => setJoinModalOpen(true)}
            className="self-start md:self-center shrink-0 flex items-center gap-2 bg-white text-teal-700 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg hover:bg-slate-50 transition transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-sm"
          >
            <PlusCircle className="w-5 h-5" /> Join New Class
          </button>
        </div>
      </section>

      {/* ═══════════════ STATS GRID CARD PANELS ═══════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: "Joined Classrooms", value: classes.length, icon: BookOpen, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" },
          { title: "Submitted Homeworks", value: submissions.length > 0 ? `${submissions.length} Submission${submissions.length > 1 ? "s" : ""}` : "0 Submissions", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
          { title: "Avg AI Score Received", value: avgScoreStr, icon: Award, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-300 block uppercase tracking-wider">{stat.title}</span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-tight mt-1 inline-block">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════ DYNAMIC CHARTING INSIGHTS ═══════════════ */}
      {classes.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {submissions.length > 0 ? (
            <div className="lg:col-span-2">
              <ActivityCalendar submissions={submissions} />
            </div>
          ) : (
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50/40 via-violet-50/20 to-emerald-50/30 dark:from-indigo-950/10 dark:via-violet-950/5 dark:to-emerald-950/10 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm h-full">
              <div className="space-y-3 max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/40">
                  <Sparkles className="w-3.5 h-3.5" /> AI Workspace Setup Completed
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-850 dark:text-white leading-tight">
                  Your Performance Analytics will appear here!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Once you select an active classroom from the directory below, access the syllabus details, and upload your handwritten homework images or typed essays, GradifyAI's semantic grading engine will map your weekly submission counts and analyze your Average AI Scores in real-time.
                </p>
              </div>
              
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
                <Award className="w-7 h-7" />
              </div>
            </div>
          )}

          {/* Pending Assignments Reminder */}
          <div className="bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Pending Tasks
                </h4>
                <p className="text-[10px] text-slate-500">Assignments to submit</p>
              </div>
              {!submissionsLoaded ? (
                <div className="w-16 h-5 rounded-full bg-slate-100 dark:bg-slate-850 animate-pulse" />
              ) : (
                <Badge variant={pendingAssignments.length > 0 ? "rose" : "emerald"}>
                  {pendingAssignments.length} Remaining
                </Badge>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[220px] space-y-3 pr-1 scrollbar-thin">
              {!submissionsLoaded ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 animate-pulse space-y-2">
                      <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-850 rounded" />
                    </div>
                  ))}
                </div>
              ) : pendingAssignments.length > 0 ? (
                pendingAssignments.map((assign) => {
                  const isOverdue = assign.dead_line && new Date(assign.dead_line) < new Date();
                  return (
                    <div
                      key={assign.id}
                      onClick={() => navigate(`/student/assignment/${assign.id}`)}
                      className="group p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 hover:border-indigo-150/40 dark:hover:border-indigo-900/40 transition cursor-pointer flex flex-col justify-between gap-1.5"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {assign.title}
                          </h5>
                          <span className="text-[10px] font-semibold text-indigo-500 shrink-0">
                            {assign.max_marks} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                          {assign.classroom || "General"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className={`inline-flex items-center gap-1 font-bold ${isOverdue ? "text-rose-600 dark:text-rose-455" : "text-slate-500 dark:text-slate-400"}`}>
                          <Calendar className="w-3 h-3 shrink-0" />
                          {assign.dead_line ? (
                            isOverdue ? (
                              `Overdue: ${new Date(assign.dead_line).toLocaleDateString()}`
                            ) : (
                              `Due: ${new Date(assign.dead_line).toLocaleDateString()}`
                            )
                          ) : (
                            "No Deadline"
                          )}
                        </span>
                        <span className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          Submit <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-350">All caught up!</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[180px]">You have submitted all active assignments.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ TOOLBAR SEARCH & ACTIONS ═══════════════ */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Joined Classrooms
              <Badge variant="emerald">{classes.length}</Badge>
            </h2>
            <p className="text-xs text-slate-500">Access classroom spaces and submit your assignments</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search classes or teachers..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-550 text-xs font-semibold outline-none transition text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex rounded-xl overflow-hidden border border-slate-250 dark:border-slate-800 self-stretch shrink-0 sm:self-center">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 sm:flex-initial p-2.5 transition ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-initial p-2.5 border-l border-slate-250 dark:border-slate-800 transition ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                title="List View"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-450 shrink-0 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="text-rose-800 dark:text-rose-200 font-bold">Failed to load classes</p>
              <p className="text-rose-600 dark:text-rose-350 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {classes.length === 0 && !error && (
          <div className="text-center bg-white dark:bg-slate-900/20 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No classrooms joined yet</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
              Ask your professor/teacher for the unique Classroom join code to subscribe to your syllabus.
            </p>
            <button
              onClick={() => setJoinModalOpen(true)}
              className="btn-primary"
            >
              Join Classroom
            </button>
          </div>
        )}

        {/* Dynamic classrooms lists */}
        {filteredClasses.length > 0 && (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => navigate(`/student/class/${cls.id}`)}
                className={`group relative bg-white dark:bg-slate-900/40 rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer flex ${
                  viewMode === "grid"
                    ? "flex-col border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/40"
                    : "items-center justify-between border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/40"
                }`}
              >
                <div className={`flex ${viewMode === "grid" ? "flex-col space-y-4" : "items-center gap-4 flex-1 min-w-0"}`}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                  </div>
                  
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-white truncate text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {cls.name}
                    </h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>Faculty: <strong className="font-semibold text-slate-700 dark:text-slate-300">{cls.created_by?.name || "Unknown"}</strong></span>
                      <span className="hidden sm:inline">•</span>
                      <span>Code: <strong className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{cls.code}</strong></span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center text-indigo-600 dark:text-indigo-400 text-xs font-bold ${
                  viewMode === "grid" ? "mt-6 justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80" : ""
                }`}>
                  <span>Enter Space</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════ JOIN CLASS MODAL ═══════════════ */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join Classroom"
      >
        <form onSubmit={handleJoinClass} className="space-y-4">
          <p className="text-xs text-slate-500">Enter the unique code provided by your instructor to subscribe and join.</p>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Classroom Code</label>
            <input
              type="text"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="e.g. PHY101"
              className="input-field uppercase font-mono"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setJoinModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={joining}
              className="flex-1 btn-primary"
            >
              {joining ? "Joining..." : "Join Space"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default StudentPage;