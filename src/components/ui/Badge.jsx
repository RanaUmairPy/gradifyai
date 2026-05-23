import React from "react";

export const Badge = ({ children, variant = "indigo", className = "" }) => {
  const getStyles = () => {
    switch (variant) {
      case "indigo":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/30";
      case "emerald":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30";
      case "rose":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900/30";
      case "amber":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/30";
      case "violet":
        return "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-900/30";
      case "slate":
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-750";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition ${getStyles()} ${className}`}
    >
      {children}
    </span>
  );
};
