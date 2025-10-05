import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./pages/Base";
import Login from "./Auth/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Base handles all authenticated pages */}
        <Route path="/" element={<Base />}>
          <Route index element={<Home />} />
        </Route>

        {/* Public route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
