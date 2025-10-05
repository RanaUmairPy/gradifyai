import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./pages/Base";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Base wraps all public and dashboard pages */}
        <Route path="/" element={<Base />}>
          {/* Public home (landing page) */}
          <Route index element={<Home />} />

          {/* About page route inside Base */}
          <Route path="/about" element={<About />} />
        </Route>

        {/* Login page (outside layout) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
