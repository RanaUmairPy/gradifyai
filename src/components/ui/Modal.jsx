import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/25 backdrop-blur-[3px] p-4 flex justify-center items-start animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 relative transform scale-100 animate-fade-in-up duration-300 my-8 sm:my-12`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {title && (
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
