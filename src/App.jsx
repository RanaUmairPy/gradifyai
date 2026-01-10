import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Layout/Wrapper Component
import Base from "./pages/Base";

// Import Auth Pages
import Login from "./Auth/Login";
import Signup from "./Auth/Signup"; // 👈 Add this import
import EmailConfirmation from "./Auth/EmailConfirmation"; // 👈 Add this import

import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Authentication routes that don't use the main layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />

        {/* All other routes are handled by the Base component.
          The "/*" wildcard path tells React Router to render the Base component
          for any path that hasn't been matched yet (e.g., "/", "/about", dashboard pages).
          Base.jsx will then use its internal logic to display the correct content.
        */}
        <Route path="/*" element={<Base />} />
      </Routes>
    </Router>
  );
};

export default App;