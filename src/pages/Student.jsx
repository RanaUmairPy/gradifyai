import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCcw,
  LogIn,
  BookOpen,
  ChevronRight,
  UserCircle,
  AlertTriangle,
  XCircle,
  Search,
  Layers,
  Grid,
} from "lucide-react";
import BASE_API from "../BaseApi";

const StudentPage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    setStudent(user);

    // Initial Cache Load
    const cachedClasses = localStorage.getItem(`student_classes_${user.id}`);
    if (cachedClasses) {
      setClasses(JSON.parse(cachedClasses));
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetchJoinedClasses(token, user.id);
  }, [navigate]);

  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const results = classes.filter(
      (cls) =>
        cls.name.toLowerCase().includes(lowerCaseSearch) ||
        cls.created_by?.name.toLowerCase().includes(lowerCaseSearch) ||
        cls.code.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredClasses(results);
  }, [searchTerm, classes]);

  const fetchJoinedClasses = async (token, userId) => {
    try {
      const res = await fetch(`${BASE_API}api/classclassrooms/my-classes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const results = data.joined_classes || data || [];
        setClasses(results);
        // Cache data
        localStorage.setItem(`student_classes_${userId}`, JSON.stringify(results));
      } else {
        const errorData = await res.json();
        if (!localStorage.getItem(`student_classes_${userId}`)) {
          setError(errorData.detail || "Failed to load classes. Status: " + res.status);
        }
      }
    } catch {
      if (!localStorage.getItem(`student_classes_${userId}`)) {
        setError("Network error occurred. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    const token = localStorage.getItem("access");
    const code = prompt(
      "Enter the unique Class Code provided by your teacher:"
    );

    if (!code || code.trim() === "") {
      alert("Class code cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`${BASE_API}api/classclassrooms/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (res.ok) {
        alert("✅ Success! You have joined the class.");
        fetchJoinedClasses(token);
      } else {
        const data = await res.json();
        const errorMessage =
          data.code?.[0] ||
          data.detail ||
          data.error ||
          "Failed to join class.";
        alert(`❌ Error joining class: ${errorMessage}`);
      }
    } catch {
      alert(
        "Network error occurred. Please ensure your device is connected to the internet."
      );
    }
  };
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750513018123303"
    crossorigin="anonymous"></script>
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <>
      <title>Student Dashboard | GradifyAI</title>

      <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
        {/* ===================== HEADER ===================== */}
        {/* ===================== HEADER REMOVED - NOW IN GLOBAL HEADER ===================== */}
        <h1 className="text-2xl font-bold bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-600">
          Dashboard
        </h1>

        <hr className="border-gray-200" />

        {/* ===================== CLASS LIST ===================== */}
        <section>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600" /> My Classes (
              <span className="text-indigo-600">{classes.length}</span>)
            </h2>

            {/* Search + View Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes or teachers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex rounded-lg overflow-hidden border border-gray-300 self-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 border-l ${viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  title="List View"
                >
                  <Layers className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ===================== STATES ===================== */}
          {loading && (
            <div className="text-center p-8 bg-white rounded-xl shadow-md border-l-4 border-indigo-400">
              <RefreshCcw className="animate-spin h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-gray-600 text-sm sm:text-base">
                Fetching your classes...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="p-6 bg-red-50 border border-red-400 rounded-xl shadow-md">
              <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
              <p className="text-red-700 font-semibold text-base">
                {error}
              </p>
              <button
                onClick={() => fetchJoinedClasses(localStorage.getItem("access"))}
                className="mt-2 text-sm text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && classes.length === 0 && (
            <div className="text-center bg-white rounded-2xl p-8 shadow-md border-2 border-dashed border-indigo-300/50">
              <XCircle className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg font-semibold mb-2">
                You haven’t joined any classes yet.
              </p>
              <p className="text-gray-500 text-sm sm:text-base">
                Ask your teacher for a{" "}
                <span className="text-indigo-700 font-semibold">
                  Class Code
                </span>{" "}
                and click{" "}
                <span className="text-indigo-700 font-semibold">
                  “Join New Class”
                </span>{" "}
                above.
              </p>
            </div>
          )}

          {!loading && filteredClasses.length > 0 && (
            <div
              className={`${viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
                }`}
            >
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`bg-white rounded-xl p-5 shadow-md border-l-4 transition-all cursor-pointer ${viewMode === "grid"
                    ? "border-indigo-200 hover:border-indigo-600 hover:shadow-lg"
                    : "border-indigo-400 hover:bg-indigo-50"
                    }`}
                  onClick={() => navigate(`/student/class/${cls.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900 truncate text-lg">
                      {cls.name}
                    </h4>
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-gray-700">
                      Teacher:
                    </span>{" "}
                    {cls.created_by?.name || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-gray-700">Code:</span>{" "}
                    <span className="text-indigo-600 font-bold">
                      {cls.code}
                    </span>
                  </p>

                  <div className="mt-4 flex items-center justify-between text-indigo-600 text-sm font-semibold">
                    <span>Go to Class</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default StudentPage;