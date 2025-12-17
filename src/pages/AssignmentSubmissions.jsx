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
            // Assuming filter by assignment_id is supported
            const res = await fetch(`${BASE_API}api/classsubmissions/?assignment_id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            } else {
                setError("Failed to fetch submissions.");
            }
        } catch (err) {
            setError("Network error occurred.");
        } finally {
            setLoading(false);
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
                                    <th className="p-4 font-semibold text-gray-600">Student ID</th>
                                    <th className="p-4 font-semibold text-gray-600">Submitted At</th>
                                    <th className="p-4 font-semibold text-gray-600">File</th>
                                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                <User className="w-4 h-4 text-indigo-400" />
                                                {sub.student || "Unknown Student"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {formatDate(sub.created_at || sub.submitted_at)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {sub.submitted_file ? (
                                                <a
                                                    href={sub.submitted_file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    <FileText className="w-4 h-4" /> View File
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic">No file</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {sub.submitted_file && (
                                                <a
                                                    href={sub.submitted_file}
                                                    download
                                                    className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 inline-block transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </a>
                                            )}
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
