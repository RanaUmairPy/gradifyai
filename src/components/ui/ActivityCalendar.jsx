import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText, CheckCircle2, Award } from "lucide-react";
import { Badge } from "./Badge";

export const ActivityCalendar = ({ submissions = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 1. Group submissions by date key: YYYY-MM-DD
  const activityMap = useMemo(() => {
    const map = {};
    submissions.forEach((sub) => {
      const dateStr = sub.submitted_at || sub.created_at;
      if (dateStr) {
        const d = new Date(dateStr);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push(sub);
      }
    });
    return map;
  }, [submissions]);

  // 2. Calendar grid math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const gridCells = useMemo(() => {
    const cells = [];
    // Padding for previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, isCurrentMonth: false, dateKey: null });
    }
    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        isCurrentMonth: true,
        dateKey: `${year}-${month}-${d}`,
        date: new Date(year, month, d)
      });
    }
    return cells;
  }, [year, month, daysInMonth, firstDayIndex]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayKey(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayKey(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayKey(null);
  };

  // 3. Styling based on activity count (Heatmap logic)
  const getHeatmapClass = (count) => {
    if (count === 0) {
      return "bg-slate-50/60 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800";
    }
    if (count === 1) {
      return "bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30 font-bold";
    }
    if (count <= 3) {
      return "bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-250/50 dark:hover:bg-emerald-900/65 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/50 font-bold";
    }
    return "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-sm";
  };

  const selectedSubmissions = selectedDayKey ? activityMap[selectedDayKey] || [] : [];
  const selectedDateLabel = useMemo(() => {
    if (!selectedDayKey) return "";
    const [y, m, d] = selectedDayKey.split("-").map(Number);
    return new Date(y, m, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }, [selectedDayKey]);

  return (
    <div className="bg-white dark:bg-slate-900/40 p-3 sm:p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-3">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-indigo-500" /> Submission Activity
          </h4>
          <p className="text-[9px] text-slate-500">Track and scroll through your daily upload history</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
          <span className="text-[11px] font-black text-slate-800 dark:text-white min-w-[85px] text-center">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-1 border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToday}
              className="px-1.5 py-0.5 text-[9px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-l border-r border-slate-200/60 dark:border-slate-800 transition"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column split layout for compact sizing */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        
        {/* Left Column: Compact Calendar (takes 3 columns) */}
        <div className="md:col-span-3 space-y-2 max-w-[280px] w-full mx-auto md:mx-0">
          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysOfWeek.map((day) => (
              <span
                key={day}
                className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase py-0.5"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {gridCells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="aspect-square bg-slate-50/5 dark:bg-slate-950/5 rounded-lg"
                  />
                );
              }

              const count = activityMap[cell.dateKey]?.length || 0;
              const isSelected = selectedDayKey === cell.dateKey;
              
              const today = new Date();
              const isToday =
                today.getFullYear() === cell.date.getFullYear() &&
                today.getMonth() === cell.date.getMonth() &&
                today.getDate() === cell.date.getDate();

              return (
                <div
                  key={cell.dateKey}
                  onClick={() => setSelectedDayKey(cell.dateKey)}
                  className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer transition text-[11px] ${getHeatmapClass(
                    count
                  )} ${
                    isSelected
                      ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 border-transparent scale-[1.03]"
                      : ""
                  } ${
                    isToday && !isSelected
                      ? "border-indigo-500 dark:border-indigo-400 shadow-sm"
                      : ""
                  }`}
                  title={`${count} submission${count !== 1 ? "s" : ""} on ${cell.date.toLocaleDateString()}`}
                >
                  <span>{cell.day}</span>
                  {count > 0 && (
                    <span
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                        count >= 4 ? "bg-white" : "bg-emerald-500 dark:bg-emerald-400"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic details container (takes 2 columns) */}
        <div className="md:col-span-2 h-full flex flex-col justify-start">
          {selectedDayKey ? (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2.5 max-h-[220px] overflow-y-auto w-full">
              <div className="flex justify-between items-center pb-1 border-b border-slate-200/50 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                  {selectedDateLabel} uploads
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 rounded-md">
                  {selectedSubmissions.length} events
                </span>
              </div>

              <div className="space-y-1.5">
                {selectedSubmissions.length > 0 ? (
                  selectedSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-150/40 dark:border-slate-900 shadow-sm flex items-center justify-between gap-2 text-[10px]"
                    >
                      <div className="min-w-0 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-250 truncate">
                          {sub.assignment || "Class Assignment"}
                        </span>
                      </div>
                      {sub.openai_score !== null && sub.openai_score !== undefined && (
                        <span className="font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                          {sub.openai_score} pts
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center py-4">
                    No uploads on this date.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 text-slate-400 dark:text-slate-550 h-full min-h-[140px] w-full">
              <CalendarIcon className="w-7 h-7 text-indigo-400/80 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Select a Date</p>
              <p className="text-[9px] max-w-[150px] leading-relaxed">Click any day on the calendar to see details</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
