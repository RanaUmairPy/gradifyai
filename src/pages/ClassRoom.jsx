import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Briefcase,
    Plus,
    X,
    AlertCircle,
    Download,
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

            // 2. Fetch Assignments
            const assignRes = await fetch(`${BASE_API}api/classassignments/?classroom=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (assignRes.ok) {
                const allAssignments = await assignRes.json();

                // 3. Client-side Filtering
                const filtered = allAssignments.filter(a => {
                    if (a.classroom_id && a.classroom_id == id) return true;
                    if (typeof a.classroom === 'string' && classData.code) {
                        return a.classroom.includes(classData.code);
                    }
                    return typeof a.classroom === 'string' && a.classroom === classData.name;
                });

                setAssignments(filtered);
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
                                        a.download = `classroom_results_${id}.csv`;
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
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

            {/* Create Form */}
            {showForm && (
                <AssignmentForm onSubmit={handleCreateAssignment} creating={creating} />
            )}

            {/* Assignments List */}
            <section>
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
        </div>
    );
};

export default ClassRoom;
