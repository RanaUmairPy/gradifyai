import React, { useEffect, useState } from "react";
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

  // 🔹 Auth & Initial Load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    setTeacher(user);
    fetchClasses(token);
  }, [navigate]);

  // 🔹 Fetch classes
  const fetchClasses = async (token) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BASE_API}api/classclassrooms/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const currentUserId = Number(JSON.parse(localStorage.getItem("user")).id);
        const teacherClasses = data.filter(
          (cls) => cls.created_by && Number(cls.created_by.id) === currentUserId
        );
        setClasses(teacherClasses);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to load classes from server.");
      }
    } catch {
      setError("Network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750513018123303"
     crossorigin="anonymous"></script>
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
        fetchClasses(token);
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

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 space-y-8 sm:space-y-10 transition-all">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg border-t-8 border-indigo-600 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Teacher Info */}
          <div className="flex items-center gap-4 sm:gap-5 flex-grow">
            <div className="p-3 bg-indigo-100 rounded-full border-4 border-indigo-50 flex-shrink-0">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                Welcome,{" "}
                <span className="text-indigo-600">
                  {teacher?.name || "Teacher"}
                </span>
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1 font-medium">
                {teacher?.email || "teacher@gradify.ai"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" /> New Class
            </button>

            <button
              onClick={() => fetchClasses(localStorage.getItem("access"))}
              disabled={loading}
              className="flex items-center justify-center gap-2 border border-indigo-300 text-indigo-700 px-5 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-50 transition-all w-full sm:w-auto"
            >
              <RefreshCcw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-50 hover:text-red-700 transition-all"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {/* Inline Create Class Form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          >
            <input
              type="text"
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Class Code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        )}
      </header>

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
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-t-4 border-indigo-100 hover:border-indigo-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
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
    </div>
  );
};

export default TeacherPage;
