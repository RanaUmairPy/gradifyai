import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext({
  showToast: (message, type) => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200",
          icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
        };
      case "error":
        return {
          bg: "bg-rose-50/90 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-200",
          icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200",
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        };
      case "info":
      default:
        return {
          bg: "bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800/40 text-indigo-800 dark:text-indigo-200",
          icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const styles = getToastStyles(t.type);
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto transition-all duration-300 transform translate-x-0 animate-slide-in-right ${styles.bg}`}
            >
              {styles.icon}
              <p className="flex-1 text-sm font-medium leading-relaxed">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
