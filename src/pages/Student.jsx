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
    fetchJoinedClasses(token);
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

  const fetchJoinedClasses = async (token) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BASE_API}api/classclassrooms/my-classes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setClasses(data.joined_classes || data || []);
      } else {
        const errorData = await res.json();
        setError(
          errorData.detail || "Failed to load classes. Status: " + res.status
        );
      }
    } catch {
      setError(
        "Network error occurred. Please check your connection and try again."
      );
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
        <header className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 border-l-8 border-indigo-600">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            {/* Student Info */}
            <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
              <div className="p-3 bg-indigo-100 rounded-full border-4 border-indigo-50 flex-shrink-0">
                <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                {/* ✅ Changed Text to “Welcome, Username!” */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">
                  Welcome,{" "}
                  <span className="text-indigo-600">
                    {student?.username || "Student"}
                  </span>
                  !
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium truncate">
                  {student?.email || "student@domain.com"}
                </p>
              </div>
            </div>

            {/* Action Buttons (Mobile friendly) */}
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto mt-4 xl:mt-0">
              <button
                onClick={handleJoin}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold text-sm sm:text-base shadow-md hover:bg-indigo-700 transition-all w-full sm:w-auto"
              >
                <LogIn className="w-5 h-5" /> Join New Class
              </button>

              <button
                onClick={() => fetchJoinedClasses(localStorage.getItem("access"))}
                className="flex items-center justify-center gap-2 border border-indigo-300 text-indigo-600 px-4 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-50 transition-all w-full sm:w-auto"
                disabled={loading}
              >
                <RefreshCcw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 border border-red-300 text-red-600 px-4 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-50 transition-all w-full sm:w-auto"
              >
                <XCircle className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>
        </header>

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
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 border-l ${
                    viewMode === "list"
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
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }`}
            >
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`bg-white rounded-xl p-5 shadow-md border-l-4 transition-all cursor-pointer ${
                    viewMode === "grid"
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