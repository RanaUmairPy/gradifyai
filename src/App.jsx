import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./pages/Base";
import Login from "./Auth/Login";
import TeacherPage from "./pages/Teacher";
import Home from "./pages/Home";
import StudentPage from "./pages/Student";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Base />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student" element={<StudentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
