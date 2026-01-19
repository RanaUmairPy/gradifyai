import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, User, Calendar } from "lucide-react";
import BASE_API from "../BaseApi";

const AssignmentSubmissions = () => {
    const { id } = useParams(); // Assignment ID
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assignmentTitle, setAssignmentTitle] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchSubmissions(token);
    }, [id, navigate]);

    const [gradingScores, setGradingScores] = useState({});

    const fetchSubmissions = async (token) => {
        try {
            setLoading(true);
            // Fetch Assignment Info for Title
            const assignRes = await fetch(`${BASE_API}api/classassignments/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (assignRes.ok) {
                const assignData = await assignRes.json();
                setAssignmentTitle(assignData.title);
            }

            // Fetch Submissions
            const res = await fetch(`${BASE_API}api/classsubmissions/?assignment_id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);

                // Initialize grading scores from fetched data
                const initialScores = {};
                data.forEach(sub => {
                    initialScores[sub.id] = sub.teacher_marks || "";
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

        try {
            const res = await fetch(`${BASE_API}api/classsubmissions/${submissionId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ teacher_marks: score })
            });

            if (res.ok) {
                const updatedSub = await res.json();
                // Update local state without re-fetching everything
                setSubmissions(prev => prev.map(s => s.id === submissionId ? updatedSub : s));

                // Show a quick success feedback (could be a toast, but using alert for consistency for now)
                // alert("Grade updated successfully!"); 
            } else {
                const errData = await res.json();
                alert("Error: " + (errData.detail || JSON.stringify(errData)));
            }
        } catch (err) {
            alert("Network error: " + err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Assignment
            </button>

            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Submissions: <span className="text-indigo-600">{assignmentTitle || "Loading..."}</span>
                </h1>
                <p className="text-gray-500 mt-2">View and manage student work.</p>
            </header>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin text-indigo-600 mb-4 inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
                    <p>Loading submissions...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No submissions received yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Student</th>
                                    <th className="p-4 font-semibold text-gray-600">Submitted At</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">OpenAI Score</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">Semantic Index</th>
                                    <th className="p-4 font-semibold text-gray-600">Feedback</th>
                                    <th className="p-4 font-semibold text-gray-600">File</th>
                                    <th className="p-4 font-semibold text-gray-600">Teacher Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{sub.student?.name || sub.student?.username || "Unknown"}</span>
                                                <span className="text-xs text-gray-400">@{sub.student?.username}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {formatDate(sub.created_at || sub.submitted_at)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 italic">
                                                {sub.openai_score !== null ? sub.openai_score : "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-extrabold text-indigo-600 text-lg">
                                            {sub.marks !== null ? sub.marks : "-"}
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="text-xs text-gray-600 line-clamp-2" title={sub.feedback}>
                                                {sub.feedback || "No feedback"}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {sub.submitted_file ? (
                                                <a
                                                    href={sub.submitted_file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    <FileText className="w-4 h-4" /> View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic text-sm">No file</span>
                                            )}
                                        </td>
                                        <td className="p-4 min-w-[180px]">
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={gradingScores[sub.id] || ""}
                                                        onChange={(e) => setGradingScores({ ...gradingScores, [sub.id]: e.target.value })}
                                                        placeholder="Marks"
                                                        className="w-20 px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                                                    />
                                                    {sub.teacher_marks !== null && (
                                                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                                                            Set
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleGradeUpdate(sub.id)}
                                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 hover:shadow-md active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentSubmissions;
