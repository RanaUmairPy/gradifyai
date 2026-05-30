import React from "react";
import { Link } from "react-router-dom";
import { FileText, Calendar, Download, CheckCircle, Briefcase, Trash2, ArrowRight, Edit } from "lucide-react";
import { Badge } from "./ui/Badge";

const AssignmentList = ({ assignments, onDelete, onEdit, isTeacher }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {assignments.map((assignment) => {
        const isActive = new Date(assignment.dead_line) > new Date();
        const detailUrl = isTeacher
          ? `/teacher/assignment/${assignment.id}`
          : `/student/assignment/${assignment.id}`;
        const keywords = assignment.required_keywords || [];

        return (
          <div
            key={assignment.id}
            className="relative bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group shadow-sm overflow-hidden"
          >
            {/* Background dynamic glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

            <div>
              {/* Status Indicator */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {isActive && <CheckCircle className="w-3.5 h-3.5" />}
                  {isActive ? "Active" : "Closed"}
                </span>

                {isTeacher && (
                  <Badge variant="indigo" className="font-mono text-[9px]">
                    Submissions: {assignment.submission_count !== undefined ? assignment.submission_count : 0}
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 mb-4">
                <Link to={detailUrl} className="block group-hover:text-indigo-600 transition-colors">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-850 dark:text-white line-clamp-2 leading-snug">
                    {assignment.title}
                  </h3>
                </Link>
                <p className="text-slate-500 text-[11px] sm:text-xs line-clamp-2 leading-relaxed">
                  {assignment.description || "No description provided."}
                </p>
              </div>

              {/* Metadata stats */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4 mb-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Due: {formatDate(assignment.dead_line)}</span>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {assignment.max_marks} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {assignment.min_words} words
                  </span>
                </div>
              </div>

              {/* Vocabulary keywords pill deck */}
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {keywords.slice(0, 3).map((kw, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-500/[0.04] text-indigo-650 dark:text-indigo-400 px-2 py-0.5 rounded-lg text-[9px] font-extrabold border border-indigo-150/40 dark:border-indigo-900/40"
                    >
                      #{kw}
                    </span>
                  ))}
                  {keywords.length > 3 && (
                    <span className="bg-slate-100 dark:bg-slate-850 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[9px] font-black border border-slate-200/40 dark:border-slate-800">
                      +{keywords.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom panel actions */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center justify-between gap-3 mt-auto">
              <Link
                to={detailUrl}
                className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs inline-flex items-center gap-1 group/btn hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                {isTeacher ? "Manage Desk" : "Workspace"}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>

              {isTeacher && (
                <div className="flex items-center gap-1.5">
                  {assignment.file && (
                    <a
                      href={assignment.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition border border-slate-200/40 dark:border-slate-800"
                      title="Download reference assignment file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit(assignment)}
                    className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-650 dark:text-indigo-400 transition border border-indigo-150/40 dark:border-indigo-900/30"
                    title="Edit classroom assignment"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(assignment.id)}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-455 transition border border-rose-150/40 dark:border-rose-900/30"
                    title="Delete classroom assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
