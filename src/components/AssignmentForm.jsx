import React, { useState } from "react";
import { Save, Calendar, FileText, CheckSquare, Settings, Sparkles, BookOpen, AlertCircle, FileUp } from "lucide-react";

const AssignmentForm = ({ onSubmit, creating, initialData }) => {
  const getDeadlineString = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      const pad = (num) => String(num).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return "";
    }
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    max_marks: initialData?.max_marks || "",
    min_words: initialData?.min_words || "",
    dead_line: getDeadlineString(initialData?.dead_line),
    required_keywords: Array.isArray(initialData?.required_keywords)
      ? initialData.required_keywords.join(", ")
      : initialData?.required_keywords || "",
    show_openai_score: initialData?.show_openai_score !== undefined ? initialData.show_openai_score : true,
    show_model_score: initialData?.show_model_score !== undefined ? initialData.show_model_score : true,
    show_teacher_marks: initialData?.show_teacher_marks !== undefined ? initialData.show_teacher_marks : true,
  });
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, file, () => {
      // Reset callback (only on create)
      if (!initialData) {
        setFormData({
          title: "",
          description: "",
          max_marks: "",
          min_words: "",
          dead_line: "",
          required_keywords: "",
          show_openai_score: true,
          show_model_score: true,
          show_teacher_marks: true,
        });
        setFile(null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
      <p className="text-xs text-slate-500 pb-2 border-b border-slate-100 mb-2">
        Configure semantic target criteria, NLP validations, and checks to build this assignment's AI grading scale.
      </p>

      {/* Core details rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Assignment Title</label>
          <input
            type="text"
            required
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Critical Analysis Essay"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Submission Deadline</label>
          <input
            type="datetime-local"
            required
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium"
            value={formData.dead_line}
            onChange={e => setFormData({ ...formData, dead_line: e.target.value })}
          />
        </div>
      </div>

      {/* Task description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Description & Rubric Guidelines</label>
        <textarea
          required
          rows={4}
          className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium resize-y"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Outline criteria, question scopes, critical points and instructions for AI rubrics..."
        />
      </div>

      {/* Target criteria rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Maximum Points</label>
          <input
            type="number"
            required
            min={1}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium text-center"
            value={formData.max_marks}
            onChange={e => setFormData({ ...formData, max_marks: e.target.value })}
            placeholder="e.g. 100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Minimum Wordcount</label>
          <input
            type="number"
            required
            min={0}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium text-center"
            value={formData.min_words}
            onChange={e => setFormData({ ...formData, min_words: e.target.value })}
            placeholder="e.g. 500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Reference Document</label>
          <div className="relative border border-slate-200 rounded-2xl bg-slate-50/50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition">
            <span className="text-xs text-slate-500 font-bold truncate max-w-[150px]">
              {file ? file.name : initialData?.file ? "Keep existing file" : "Add Attachment"}
            </span>
            <FileUp className="w-4 h-4 text-slate-450 shrink-0" />
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
        </div>
      </div>

      {/* Semantic Keyword validation */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Mandatory Vocabulary Keywords <span className="text-slate-400 font-normal">(comma-separated)</span>
        </label>
        <input
          type="text"
          className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium"
          value={formData.required_keywords}
          onChange={e => setFormData({ ...formData, required_keywords: e.target.value })}
          placeholder="e.g. Calculus, Integral, Derivative, Limits"
        />
      </div>

      {/* Dynamic configuration boxes */}
      <div className="space-y-3.5 border-t border-slate-100 pt-5">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-indigo-500" />
          Grading Engine Setup
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* OpenAI Auto Check */}
          <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
            formData.show_openai_score 
              ? 'bg-indigo-500/[0.03] border-indigo-500/35 shadow-sm shadow-indigo-500/5' 
              : 'bg-slate-50/50 border-slate-200/60'
          }`}>
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 text-indigo-650 border-slate-300 rounded focus:ring-indigo-500 shrink-0"
              checked={formData.show_openai_score}
              onChange={e => setFormData({ ...formData, show_openai_score: e.target.checked })}
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 block">AI Agent Grading</span>
              <span className="text-[9.5px] text-slate-450 leading-normal block mt-0.5">Rubrics auto-prose grading with GPT.</span>
            </div>
          </label>

          {/* Local Model Score */}
          <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
            formData.show_model_score 
              ? 'bg-indigo-500/[0.03] border-indigo-500/35 shadow-sm shadow-indigo-500/5' 
              : 'bg-slate-50/50 border-slate-200/60'
          }`}>
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 text-indigo-650 border-slate-300 rounded focus:ring-indigo-500 shrink-0"
              checked={formData.show_model_score}
              onChange={e => setFormData({ ...formData, show_model_score: e.target.checked })}
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 block">Semantic Check</span>
              <span className="text-[9.5px] text-slate-450 leading-normal block mt-0.5">Keyword detection & duplication checks.</span>
            </div>
          </label>

          {/* Teacher Manual grading */}
          <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
            formData.show_teacher_marks 
              ? 'bg-indigo-500/[0.03] border-indigo-500/35 shadow-sm shadow-indigo-500/5' 
              : 'bg-slate-50/50 border-slate-200/60'
          }`}>
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 text-indigo-650 border-slate-300 rounded focus:ring-indigo-500 shrink-0"
              checked={formData.show_teacher_marks}
              onChange={e => setFormData({ ...formData, show_teacher_marks: e.target.checked })}
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 block">Manual Override</span>
              <span className="text-[9.5px] text-slate-450 leading-normal block mt-0.5">Allows manual grade adjustments.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end pt-4 gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onSubmit(null, null, null)} // Close parent trigger
          className="btn-secondary py-3 px-6 text-xs sm:text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={creating}
          className="btn-primary py-3 px-8 text-xs sm:text-sm inline-flex items-center gap-2"
        >
          {creating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white/80" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {initialData ? "Update Assignment" : "Save Assignment"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
