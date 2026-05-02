import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Briefcase,
    Plus,
    X,
    AlertCircle,
    Download,
    Users,
    UserMinus,
    BarChart3,
    Calendar,
    Mail,
    Hash,
    RefreshCcw,
    AlertTriangle,
    ArrowLeft,
} from "lucide-react";
import BASE_API from "../BaseApi";
import AssignmentForm from "../components/AssignmentForm";
import AssignmentList from "../components/AssignmentList";

const ClassRoom = ({ classId }) => {
    const params = useParams();
    const id = classId || params.id;
    const navigate = useNavigate();

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
    const [removingStudent, setRemovingStudent] = useState(null);
    const [removingInProgress, setRemovingInProgress] = useState(false);

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
            // 1. Fetch Class Details
            const classRes = await fetch(`${BASE_API}api/classclassrooms/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!classRes.ok) throw new Error("Failed to load class details");

            const classData = await classRes.json();
            setClassInfo(classData);

            // 2. Fetch assignments (already filtered server-side via ?classroom=)
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
            setError("Failed to load class data"); // Generic message for user
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

    // Auto-load students when teacher opens that tab the first time.
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            students: prev.students.filter(
                                (s) => s.id !== removingStudent.id
                            ),
                            total_students: Math.max(0, (prev.total_students || 0) - 1),
                        }
                        : prev
                );
                setRemovingStudent(null);
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.error || err.detail || "Failed to remove student.");
            }
        } catch (e) {
            alert("Network error while removing student.");
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
        const token = localStorage.getItem("access");
        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("max_marks", formData.max_marks);
        data.append("min_words", formData.min_words);

        const keywords = formData.required_keywords.split(",").map(k => k.trim()).filter(k => k);
        keywords.forEach(k => data.append("required_keywords", k));

        // Use the ID from the URL/Props, not formData
        // Sending both "classroom" and "classroom_id" to ensure compatibility with DRF serializers
        data.append("classroom", id);
        data.append("classroom_id", id);

        // Ensure Date is in ISO format
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
                alert("Assignment created successfully!");
                setShowForm(false);
                onSuccess(); // Reset form
                refreshAssignments();
            } else {
                const errData = await res.json();
                // Check specifically for classroom ID error or generic errors
                const errMsg = JSON.stringify(errData);
                if (errMsg.includes("classroom")) {
                    alert("Error: The system could not link the assignment to this class. Using ID: " + id);
                } else {
                    alert("Failed to create assignment: " + errMsg);
                }
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;

        const token = localStorage.getItem("access");
        try {
            const res = await fetch(`${BASE_API}api/classassignments/${assignmentId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert("Assignment deleted.");
                refreshAssignments();
            } else {
                alert("Failed to delete assignment.");
            }
        } catch (error) {
            alert("Error deleting assignment.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 space-y-8">
            {/* Back navigation */}
            <button
                type="button"
                onClick={() =>
                    navigate(user?.is_teacher ? "/teacher" : "/student")
                }
                className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-700 font-medium text-sm transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
            </button>

            {/* Header */}
            <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-indigo-600" />
                        {classInfo ? classInfo.name : "Classroom Assignments"}
                    </h1>
                    {classInfo && (
                        <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded text-sm mt-1 inline-block">
                            {classInfo.code}
                        </span>
                    )}
                    <p className="text-gray-500 mt-2">
                        {classInfo ? `Manage assignments for ${classInfo.name}` : "Manage and view assignments for this class."}
                    </p>
                </div>
                {user?.is_teacher && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem("access");
                                try {
                                    const res = await fetch(`${BASE_API}api/classclassrooms/${id}/generate-result-csv/`, {
                                        headers: { Authorization: `Bearer ${token}` },
                                    });
                                    if (res.ok) {
                                        const blob = await res.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        // Build a friendly filename like
                                        // "Electronics_Lab_PHYS-6115_results.csv".
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
                                    } else {
                                        alert("Failed to download results. ensure there are submissions.");
                                    }
                                } catch (err) {
                                    alert("Error downloading file.");
                                }
                            }}
                            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-green-700 transition-all"
                        >
                            <Download className="w-5 h-5" /> Download Results
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-indigo-700 transition-all"
                        >
                            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            {showForm ? "Cancel" : "Create Assignment"}
                        </button>
                    </div>
                )}
            </header>

            {/* Tabs (centered on every screen) */}
            <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 inline-flex gap-1">
                    <button
                        onClick={() => setActiveTab("assignments")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            activeTab === "assignments"
                                ? "bg-indigo-600 text-white shadow"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <span className="text-base leading-none" aria-hidden="true">📔</span>
                        Assignments
                    </button>
                    {user?.is_teacher && (
                        <button
                            onClick={() => setActiveTab("students")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                activeTab === "students"
                                    ? "bg-indigo-600 text-white shadow"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <span className="text-base leading-none" aria-hidden="true">🎓</span>
                            Students
                            {studentsData?.total_students !== undefined && (
                                <span
                                    className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                                        activeTab === "students"
                                            ? "bg-white text-indigo-600"
                                            : "bg-indigo-100 text-indigo-700"
                                    }`}
                                >
                                    {studentsData.total_students}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* === Assignments Tab === */}
            {activeTab === "assignments" && (
                <>
                    {showForm && (
                        <AssignmentForm onSubmit={handleCreateAssignment} creating={creating} />
                    )}

                    {/* Wrapped in the same attractive gradient panel as the dashboard class lists */}
                    <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl border border-indigo-100/80 shadow-sm p-5 sm:p-8">
                        <div className="flex items-center justify-between mb-5 sm:mb-6">
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-base sm:text-lg" aria-hidden="true">
                                    📔
                                </span>
                                Assignments
                                <span className="bg-indigo-600 text-white text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full">
                                    {assignments.length}
                                </span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin text-indigo-600 mb-4 inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
                                <p className="text-gray-500">Loading assignments...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                                <AlertCircle /> {error}
                            </div>
                        ) : assignments.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No active assignments found.</p>
                                {user?.is_teacher && <p className="text-sm text-gray-400 mt-2">Create one to get started!</p>}
                            </div>
                        ) : (
                            <AssignmentList
                                assignments={assignments}
                                onDelete={handleDeleteAssignment}
                                isTeacher={user?.is_teacher}
                            />
                        )}
                    </section>
                </>
            )}

            {/* === Students Tab (teacher only) === */}
            {activeTab === "students" && user?.is_teacher && (
                <section className="space-y-6">
                    {/* Header / overview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                Enrolled Students
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {studentsData
                                    ? `${studentsData.total_students} student${studentsData.total_students === 1 ? "" : "s"} • ${studentsData.total_assignments} assignment${studentsData.total_assignments === 1 ? "" : "s"} in this class`
                                    : "Loading…"}
                            </p>
                        </div>
                        <button
                            onClick={fetchStudents}
                            disabled={loadingStudents}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition disabled:opacity-60"
                        >
                            <RefreshCcw className={`w-4 h-4 ${loadingStudents ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>

                    {/* States */}
                    {loadingStudents && !studentsData && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <div className="animate-spin text-indigo-600 mb-4 inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
                            <p className="text-gray-500">Loading students…</p>
                        </div>
                    )}

                    {studentsError && !loadingStudents && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">Could not load students</p>
                                <p className="text-sm">{studentsError}</p>
                                <button
                                    onClick={fetchStudents}
                                    className="mt-2 text-sm font-bold underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    {studentsData && studentsData.students.length === 0 && !loadingStudents && (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                            <Users className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg font-semibold">No students yet</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Share class code{" "}
                                <span className="text-indigo-700 font-bold">
                                    {classInfo?.code}
                                </span>{" "}
                                with your students so they can join.
                            </p>
                        </div>
                    )}

                    {studentsData && studentsData.students.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {studentsData.students.map((s) => {
                                const submitPct =
                                    s.total_assignments > 0
                                        ? Math.round(
                                            (s.submitted_count / s.total_assignments) * 100
                                        )
                                        : 0;
                                return (
                                    <div
                                        key={s.id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                                    >
                                        {/* Top row: avatar + name + remove */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden border border-indigo-200">
                                                    {s.profile_picture ? (
                                                        <img
                                                            src={s.profile_picture}
                                                            alt={s.name || s.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        (s.name || s.username || "?")
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-900 truncate">
                                                        {s.name || s.username}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {s.email}
                                                    </p>
                                                    {s.roll_number && (
                                                        <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                                            <Hash className="w-3 h-3" /> {s.roll_number}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setRemovingStudent(s)}
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                                                title="Remove from class"
                                                aria-label="Remove student from class"
                                            >
                                                <UserMinus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Stats grid */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-indigo-50 rounded-lg p-2 text-center">
                                                <p className="text-[10px] uppercase tracking-wide text-indigo-700 font-semibold">
                                                    Submitted
                                                </p>
                                                <p className="text-lg font-extrabold text-indigo-700">
                                                    {s.submitted_count}
                                                    <span className="text-xs text-indigo-400 font-medium">
                                                        /{s.total_assignments}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-2 text-center">
                                                <p className="text-[10px] uppercase tracking-wide text-green-700 font-semibold">
                                                    Graded
                                                </p>
                                                <p className="text-lg font-extrabold text-green-700">
                                                    {s.graded_count}
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-2 text-center">
                                                <p className="text-[10px] uppercase tracking-wide text-purple-700 font-semibold">
                                                    Avg
                                                </p>
                                                <p className="text-lg font-extrabold text-purple-700">
                                                    {s.average_marks !== null
                                                        ? s.average_marks
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                                                    <BarChart3 className="w-3 h-3" /> Submission progress
                                                </span>
                                                <span className="text-[11px] font-bold text-gray-700">
                                                    {submitPct}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                                    style={{ width: `${submitPct}%` }}
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Last submission:{" "}
                                            <span className="font-medium text-gray-700">
                                                {formatDateTime(s.last_submission_at)}
                                            </span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* ===== Remove Student Confirmation Modal ===== */}
            {removingStudent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => !removingInProgress && setRemovingStudent(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UserMinus className="w-7 h-7 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Remove Student?
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm">
                                Are you sure you want to remove{" "}
                                <span className="font-bold text-gray-900">
                                    {removingStudent.name || removingStudent.username}
                                </span>{" "}
                                from this class? Their submissions will remain on record,
                                but they will lose access to this classroom.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRemovingStudent(null)}
                                disabled={removingInProgress}
                                className="flex-1 py-2.5 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRemoveStudent}
                                disabled={removingInProgress}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {removingInProgress ? (
                                    "Removing..."
                                ) : (
                                    <>
                                        <UserMinus className="w-4 h-4" /> Remove
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassRoom;
