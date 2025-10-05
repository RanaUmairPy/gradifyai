import React, { useEffect, useState } from "react";
import { User, RefreshCcw, PlusCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BASE_API from "../BaseApi";

const TeacherPage = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // 🔹 Fetch teacher’s classes
  const fetchClasses = async (token) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_API}api/classclassrooms/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const teacherClasses = data.filter(
          (cls) => cls.created_by && Number(cls.created_by.id) === Number(JSON.parse(localStorage.getItem("user")).id)
        );
        setClasses(teacherClasses);
      } else {
        setError("Failed to load classes.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create a new class
  const handleCreate = async () => {
    const token = localStorage.getItem("access");
    const name = prompt("Enter class name:");
    if (!name) return;

    try {
      const res = await fetch(
        `${BASE_API}api/classclassrooms/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (res.ok) {
        alert("✅ Class created successfully!");
        fetchClasses(token);
      } else {
        alert("❌ Failed to create class.");
      }
    } catch {
      alert("Network error occurred.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Teacher Info Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center gap-4">
          <User className="w-12 h-12 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {teacher?.name || "Teacher"}
            </h2>
            <p className="text-gray-600">{teacher?.email}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-indigo-700 transition-all"
          >
            <PlusCircle className="w-5 h-5" /> Create Class
          </button>
          <button
            onClick={() => fetchClasses(localStorage.getItem("access"))}
            className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
          >
            <RefreshCcw className="w-5 h-5" /> Refresh
          </button>
        </div>
      </div>

      {/* Class List */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" /> Your Created Classes
        </h3>

        {loading ? (
          <p className="text-gray-500 text-center">Loading classes...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : classes.length === 0 ? (
          <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-indigo-100">
            <p className="text-gray-500 text-lg">
              You haven’t created any classes yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {cls.name}
                </h4>
                <p className="text-gray-600 mt-1 text-sm">
                  Code: <span className="font-medium">{cls.code}</span>
                </p>
                <p className="text-gray-500 mt-2 text-sm">
                  Students: {cls.students?.length || 0}
                </p>
                <button className="mt-4 text-indigo-600 text-sm font-medium hover:underline">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherPage;
