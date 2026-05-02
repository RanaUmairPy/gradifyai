import React, { useEffect, useState, useRef } from "react";
import {
  User,
  RefreshCcw,
  PlusCircle,
  BookOpen,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Users,
  Book,
  MoreVertical,
  Edit3,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const TeacherPage = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [creating, setCreating] = useState(false);

  // 🔹 Edit / Delete state
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingClass, setDeletingClass] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // 🔹 Auth & Initial Load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    setTeacher(user);

    // Initial Cache Load
    const cachedClasses = localStorage.getItem(`teacher_classes_${user.id}`);
    if (cachedClasses) {
      setClasses(JSON.parse(cachedClasses));
      setLoading(false); // Don't show loading if we have cache
    } else {
      setLoading(true); // Show loading only if no cache
    }

    fetchClasses(token, user.id);
  }, [navigate]);

  // 🔹 Fetch classes (server-side scoped to this teacher via my-classes/)
  const fetchClasses = async (token, userId) => {
    try {
      const res = await fetch(`${BASE_API}api/classclassrooms/my-classes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // my-classes/ returns { created_classes: [...], joined_classes: [...] }
        const teacherClasses = data.created_classes || [];
        setClasses(teacherClasses);
        if (userId) {
          localStorage.setItem(
            `teacher_classes_${userId}`,
            JSON.stringify(teacherClasses)
          );
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (!userId || !localStorage.getItem(`teacher_classes_${userId}`)) {
          setError(errorData.detail || "Failed to load classes from server.");
        }
      }
    } catch {
      if (!userId || !localStorage.getItem(`teacher_classes_${userId}`)) {
        setError("Network error occurred. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create Class
  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    if (!className.trim() || !classCode.trim()) {
      setError("Please fill in both class name and class code.");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch(`${BASE_API}api/classclassrooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: className.trim(),
          code: classCode.trim(),
        }),
      });

      if (res.ok) {
        setClassName("");
        setClassCode("");
        setShowForm(false);
        setError("");
        fetchClasses(token, teacher?.id);
      } else {
        const data = await res.json();
        setError(
          data.name?.[0] || data.code?.[0] || data.detail || "Unexpected error."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred. Try again.");
    } finally {
      setCreating(false);
    }
  };

  // 🔹 Open Edit modal
  const openEditModal = (cls) => {
    setEditingClass(cls);
    setEditName(cls.name);
    setEditCode(cls.code);
    setEditError("");
    setOpenMenuId(null);
  };

  const closeEditModal = () => {
    setEditingClass(null);
    setEditName("");
    setEditCode("");
    setEditError("");
  };

  // 🔹 Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingClass) return;
    const token = localStorage.getItem("access");

    if (!editName.trim() || !editCode.trim()) {
      setEditError("Class name and code cannot be empty.");
      return;
    }

    try {
      setSavingEdit(true);
      setEditError("");
      const res = await fetch(`${BASE_API}api/classclassrooms/${editingClass.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          code: editCode.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setClasses((prev) => {
          const next = prev.map((c) =>
            c.id === editingClass.id ? { ...c, ...updated } : c
          );
          if (teacher?.id) {
            localStorage.setItem(`teacher_classes_${teacher.id}`, JSON.stringify(next));
          }
          return next;
        });
        closeEditModal();
      } else {
        const data = await res.json();
        setEditError(
          data.name?.[0] ||
            data.code?.[0] ||
            data.detail ||
            data.error ||
            "Failed to update class."
        );
      }
    } catch (err) {
      console.error(err);
      setEditError("Network error occurred. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  // 🔹 Confirm + execute Delete
  const openDeleteConfirm = (cls) => {
    setDeletingClass(cls);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClass) return;
    const token = localStorage.getItem("access");

    try {
      setDeleting(true);
      const res = await fetch(`${BASE_API}api/classclassrooms/${deletingClass.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok || res.status === 204) {
        setClasses((prev) => {
          const next = prev.filter((c) => c.id !== deletingClass.id);
          if (teacher?.id) {
            localStorage.setItem(`teacher_classes_${teacher.id}`, JSON.stringify(next));
          }
          return next;
        });
        setDeletingClass(null);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.detail || data.error || "Failed to delete class.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 space-y-8 sm:space-y-10 transition-all">
      {/* Header */}
      {/* Header Removed */}
      <h1 className="text-2xl font-bold bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-600">
        Dashboard
      </h1>

      {/* Class List */}
      <section>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Your Created Classes
          <span className="text-indigo-600 text-base">
            ({classes.length})
          </span>
        </h2>

        {/* Loading */}
        {loading && (
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border-l-4 border-indigo-400">
            <RefreshCcw className="animate-spin h-6 w-6 text-indigo-600 mx-auto mb-3" />
            <p className="text-gray-600 text-sm sm:text-base">
              Loading classes...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-start p-6 bg-red-50 border border-red-400 rounded-xl shadow-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mr-3" />
            <div>
              <p className="text-red-700 font-bold text-lg mb-1">
                Error Loading Data
              </p>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => fetchClasses(localStorage.getItem("access"))}
                className="mt-2 text-red-700 hover:text-red-900 underline text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && classes.length === 0 && (
          <div className="text-center bg-white rounded-2xl p-10 shadow-lg border-2 border-dashed border-indigo-300/50">
            <Book className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold mb-2">
              No Classes Yet
            </p>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Click the{" "}
              <span className="text-indigo-700 font-semibold">
                “New Class”
              </span>{" "}
              button to create your first classroom.
            </p>
          </div>
        )}

        {/* Classes Grid */}
        {!loading && !error && classes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => navigate(`/teacher/class/${cls.id}`)}
                className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-t-4 border-indigo-100 hover:border-indigo-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
              >
                {/* 3-dot menu (top-right) */}
                <div
                  className="absolute top-3 right-3 z-10"
                  ref={openMenuId === cls.id ? menuRef : null}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === cls.id ? null : cls.id);
                    }}
                    className="p-1.5 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-700 transition"
                    title="Class options"
                    aria-label="Class options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === cls.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(cls);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      >
                        <Edit3 className="w-4 h-4" /> Edit Class
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirm(cls);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Class
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-3 pr-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    {cls.name}
                  </h3>
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-sm space-y-2 mt-3">
                  <p className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Students:{" "}
                    <span className="font-medium text-gray-800">
                      {cls.students?.length || 0}
                    </span>
                  </p>
                  <p className="text-gray-500 flex items-center justify-between border-t pt-2">
                    <span className="font-bold text-indigo-600 text-base">
                      {cls.code}
                    </span>
                    <span className="text-gray-700 text-xs sm:text-sm font-medium">
                      Class Code
                    </span>
                  </p>
                </div>
                <div className="mt-4 text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:text-indigo-800">
                  Manage Class <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Edit Class Modal ===== */}
      {editingClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeEditModal}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Edit3 className="w-7 h-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Edit Class</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Update the class name or code.
              </p>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{editError}</p>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Code
                </label>
                <input
                  type="text"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-2.5 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {savingEdit ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation Modal ===== */}
      {deletingClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => !deleting && setDeletingClass(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Class?</h2>
              <p className="text-gray-600 mt-2 text-sm">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900">
                  {deletingClass.name}
                </span>
                ? This will also remove all assignments and submissions inside
                it. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPage;
