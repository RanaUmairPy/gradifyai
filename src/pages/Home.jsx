import React, { useState } from "react";
import { GraduationCap, Users, PlusCircle, LogIn } from "lucide-react";

const Home = () => {
  const [classes] = useState([
    { id: 1, name: "Web Development", code: "WD101" },
    { id: 2, name: "Data Science", code: "DS202" },
    { id: 3, name: "AI & Machine Learning", code: "AI303" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-indigo-600 w-10 h-10" />
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Welcome to <span className="text-indigo-600">GradifyEdu</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-300">
              <PlusCircle className="w-5 h-5" /> Create Class
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300">
              <LogIn className="w-5 h-5" /> Join Class
            </button>
          </div>
        </div>

        {/* Classes Section */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Your Classes
          </h3>

          {classes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-indigo-100">
              <p className="text-gray-500 text-lg">
                No classes yet. Click{" "}
                <span className="font-medium text-indigo-600">Create</span> or{" "}
                <span className="font-medium text-indigo-600">Join</span> to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-transparent hover:border-indigo-200 hover:-translate-y-1"
                >
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {cls.name}
                  </h4>
                  <p className="text-gray-500 mb-4">Class Code: {cls.code}</p>
                  <button className="text-indigo-600 text-sm font-medium hover:underline">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
