// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
// Create a Context for theme
const ThemeContext = createContext();
// Create a provider component
export const ThemeProvider = ({ children }) => {
  // Set initial state based on localStorage or default to light mode
  const savedTheme = localStorage.getItem("theme");
  const [darkMode, setDarkMode] = useState(
    savedTheme === "dark" ? true : false
  );

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    // Apply the theme to the body of the document
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeContext;
