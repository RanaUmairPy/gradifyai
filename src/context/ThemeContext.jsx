import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const toggleTheme = () => {
    // Lock to light mode, no-op
  };

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
