import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./pages/Base";
import Login from "./Auth/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Base />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
