import React from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Calendar,
    Download,
    CheckCircle,
    Briefcase,
    Trash2,
    ArrowRight
} from "lucide-react";

const AssignmentList = ({ assignments, onDelete, isTeacher }) => {

    const formatDate = (dateString) => {
        if (!dateString) return "No Deadline";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all relative group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <Link to={isTeacher ? `/teacher/assignment/${assignment.id}` : `/student/assignment/${assignment.id}`} className="hover:underline">
                                    <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                                </Link>
                                {new Date(assignment.dead_line) > new Date() ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Active
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Closed</span>
                                )}
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-3 md:line-clamp-none">{assignment.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-indigo-500" />
                                    <span>Due: {formatDate(assignment.dead_line)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-indigo-500" />
                                    <span>Marks: {assignment.max_marks}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-indigo-500" />
                                    <span>Min Words: {assignment.min_words}</span>
                                </div>
                                {isTeacher && (
                                    <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded text-blue-700 font-semibold border border-blue-100">
                                        <Download className="w-3 h-3" />
                                        <span>Submissions: {assignment.submission_count !== undefined ? assignment.submission_count : 0}</span>
                                    </div>
                                )}
                            </div>

                            {assignment.required_keywords?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {assignment.required_keywords.map((kw, idx) => (
                                        <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold border border-indigo-100">
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {!isTeacher && (
                                <div className="mt-4">
                                    <Link
                                        to={`/student/assignment/${assignment.id}`}
                                        className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        View Details & Submit <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                            {isTeacher && assignment.file && (
                                <a
                                    href={assignment.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all text-sm shrink-0"
                                >
                                    <Download className="w-4 h-4" /> Download File
                                </a>
                            )}

                            {isTeacher && (
                                <button
                                    onClick={() => onDelete(assignment.id)}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Assignment"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AssignmentList;
