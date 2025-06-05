import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="toggle-container" onClick={toggleTheme}>
      <span className={`icon moon ${darkMode ? "active" : ""}`}>🌙</span>
      <div className={`toggle-switch ${darkMode ? "dark" : ""}`}>
        <div className="toggle-circle"></div>
      </div>
      <span className={`icon sun ${darkMode ? "" : "active"}`}>☀️</span>
    </div>
  );
};

export default ThemeToggle;
