import React from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Calendar,
    Download,
    CheckCircle,
    Briefcase,
    Trash2,
    ArrowRight,
} from "lucide-react";

const AssignmentList = ({ assignments, onDelete, isTeacher }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "No Deadline";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {assignments.map((assignment) => {
                const isActive = new Date(assignment.dead_line) > new Date();
                const detailUrl = isTeacher
                    ? `/teacher/assignment/${assignment.id}`
                    : `/student/assignment/${assignment.id}`;
                const keywords = assignment.required_keywords || [];

                return (
                    <div
                        key={assignment.id}
                        className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-indigo-300 transition-all flex flex-col group"
                    >
                        {/* Status pill — top right */}
                        <span
                            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {isActive && <CheckCircle className="w-3 h-3" />}
                            {isActive ? "Active" : "Closed"}
                        </span>

                        {/* Title */}
                        <Link to={detailUrl} className="block pr-20 mb-2 hover:text-indigo-700 transition-colors">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-snug">
                                {assignment.title}
                            </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                            {assignment.description || "No description provided."}
                        </p>

                        {/* Stats */}
                        <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span className="truncate">
                                    Due: <span className="font-medium">{formatDate(assignment.dead_line)}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-indigo-500" /> {assignment.max_marks} marks
                                </span>
                                <span className="flex items-center gap-1">
                                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> {assignment.min_words} words
                                </span>
                            </div>
                            {isTeacher && (
                                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-100 mt-1">
                                    <Download className="w-3 h-3" />
                                    Submissions:{" "}
                                    {assignment.submission_count !== undefined
                                        ? assignment.submission_count
                                        : 0}
                                </div>
                            )}
                        </div>

                        {/* Keywords (max 3 visible, +N for the rest) */}
                        {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {keywords.slice(0, 3).map((kw, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-indigo-100"
                                    >
                                        #{kw}
                                    </span>
                                ))}
                                {keywords.length > 3 && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                                        +{keywords.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Footer actions */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                            <Link
                                to={detailUrl}
                                className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                            >
                                {isTeacher ? "Manage" : "View & Submit"}
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {isTeacher && (
                                <div className="flex items-center gap-1">
                                    {assignment.file && (
                                        <a
                                            href={assignment.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                            title="Download attachment"
                                            aria-label="Download attachment"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onDelete(assignment.id)}
                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                        title="Delete assignment"
                                        aria-label="Delete assignment"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AssignmentList;
