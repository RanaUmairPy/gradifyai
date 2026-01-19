import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FileText,
    Calendar,
    Download,
    CheckCircle,
    Briefcase,
    Upload,
    ArrowLeft,
    AlertTriangle
} from "lucide-react";
import BASE_API from "../BaseApi";

const AssignmentDetails = ({ assignmentId }) => {
    const params = useParams();
    const id = assignmentId || params.id;
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Submission State
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState("");
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

    const [mySubmission, setMySubmission] = useState(null);

    const fetchAssignmentDetails = async (token) => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_API}api/classassignments/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setAssignment(data);

                // Fetch student's submission if not a teacher
                const cu = JSON.parse(localStorage.getItem("user"));
                if (cu && !cu.is_teacher) {
                    const subRes = await fetch(`${BASE_API}api/classsubmissions/?assignment_id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (subRes.ok) {
                        const subData = await subRes.json();
                        // Filter for the current user's submission
                        // The serializer returns 'student' as a nested User object, so we access s.student.username or s.student.id
                        const mine = subData.find(s =>
                            (s.student?.id === cu.id) ||
                            (s.student?.username === cu.username) ||
                            (s.student === cu.id) // Fallback if it returns just ID
                        );

                        if (mine) setMySubmission(mine);
                        // If the backend filters for us (ideal), setMySubmission(subData[0]).
                        // Let's assume we filter.
                        // Actually, let's try to pass student ID to filter if backend supports it.
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

    const handleSubmission = async (e) => {
        e.preventDefault();
        if (!submissionFile) {
            setSubmissionError("Please select a file to upload.");
            return;
        }

        const token = localStorage.getItem("access");
        const formData = new FormData();
        // Based on backend error: {"assignment_id":["This field is required."],"submitted_file":["No file was submitted."]}
        formData.append("assignment_id", id);
        formData.append("submitted_file", submissionFile);
        // Add student ID if backend requires it explicitly, usually derived from token
        if (user && user.id) {
            formData.append("student", user.id);
        }

        try {
            setSubmitting(true);
            setSubmissionError("");
            const res = await fetch(`${BASE_API}api/classsubmissions/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (res.ok) {
                setSubmissionSuccess(true);
                setSubmissionFile(null);
                alert("Assignment submitted successfully!");
                // Auto-refresh to show marks and submission info
                fetchAssignmentDetails(token);
            } else {
                const errData = await res.json();
                setSubmissionError(JSON.stringify(errData) || "Failed to submit assignment.");
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="p-8 text-center text-red-600">
                <p>{error || "Assignment not found."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-indigo-600 underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const isTeacher = user?.is_teacher;
    const isPastDeadline = new Date(assignment.dead_line) < new Date();

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Class
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assignment Details */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{assignment.title}</h1>
                            {!isPastDeadline ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Active
                                </span>
                            ) : (
                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Closed</span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                                <span><span className="font-semibold text-gray-700">Due:</span> {formatDate(assignment.dead_line)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                <span><span className="font-semibold text-gray-700">Marks:</span> {assignment.max_marks}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-500" />
                                <span><span className="font-semibold text-gray-700">Min Words:</span> {assignment.min_words}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600 mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Instructions</h3>
                            <p className="whitespace-pre-wrap">{assignment.description}</p>
                        </div>

                        {isTeacher && assignment.file && (
                            <div className="flex items-center gap-4">
                                <a
                                    href={assignment.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                                >
                                    <Download className="w-5 h-5" /> Download Attachment
                                </a>
                            </div>
                        )}
                    </section>
                </div>

                {/* Submission Sidebar */}
                <div className="lg:col-span-1">
                    {isTeacher ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8 text-center">
                            <Briefcase className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800">Student Submissions</h3>
                            <p className="text-gray-500 mt-2">View and grade student submissions for this assignment.</p>
                            <button
                                onClick={() => navigate(`/teacher/assignment/${id}/submissions`)}
                                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                            >
                                View Submissions
                            </button>
                        </div>
                    ) : (
                        <div className={`bg-white rounded-2xl shadow-lg border p-8 ${submissionSuccess || mySubmission ? "border-green-200" : "border-indigo-100"}`}>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Upload className="w-6 h-6 text-indigo-600" />
                                Submit Assignment
                            </h3>

                            {submissionSuccess || mySubmission ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-bold text-green-700">Submitted!</h4>
                                    <p className="text-gray-500 mt-2">Your work has been uploaded successfully.</p>

                                    {mySubmission && (
                                        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left space-y-3 border border-gray-200">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Submitted on:</span>
                                                <span className="font-medium text-gray-800">{formatDate(mySubmission.created_at || mySubmission.submitted_at)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">File:</span>
                                                <a href={mySubmission.submitted_file} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate max-w-[150px] font-medium">View File</a>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-4 border-t border-gray-200 pt-3">
                                                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                                                    <span className="block text-xs text-gray-500 uppercase font-semibold">AI Agent Score</span>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {mySubmission.openai_score !== null ? mySubmission.openai_score : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                                                    <span className="block text-xs text-gray-500 uppercase font-semibold">Teacher Marks</span>
                                                    <span className="text-lg font-bold text-purple-600">
                                                        {mySubmission.teacher_marks !== null ? mySubmission.teacher_marks : "Pending"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 my-2 pt-3 flex justify-between items-center">
                                                <span className="text-gray-700 font-bold">Model Score:</span>
                                                <span className={`font-bold text-lg ${mySubmission.marks ? "text-indigo-600" : "text-gray-400"}`}>
                                                    {mySubmission.marks !== undefined && mySubmission.marks !== null ? `${mySubmission.marks} / ${assignment.max_marks}` : "Pending"}
                                                </span>
                                            </div>
                                            {mySubmission.feedback && (
                                                <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                                    <strong className="block text-gray-700 mb-1">Feedback / Plagiarism Report:</strong>
                                                    <p className="whitespace-pre-line">{mySubmission.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmission} className="space-y-6">
                                    {submissionError && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                            {submissionError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => setSubmissionFile(e.target.files[0])}
                                            />
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">
                                                {submissionFile ? (
                                                    <span className="text-indigo-600 font-semibold">{submissionFile.name}</span>
                                                ) : "Click to browse or drag file here"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || isPastDeadline}
                                        className={`w-full py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${isPastDeadline
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                                            }`}
                                    >
                                        {submitting ? "Uploading..." : isPastDeadline ? "Deadline Passed" : "Submit Assignment"}
                                    </button>

                                    <p className="text-xs text-center text-gray-400">
                                        Allowed formats: PDF, DOCX, ZIP. Max size: 10MB.
                                    </p>
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
