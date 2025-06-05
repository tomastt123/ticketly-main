import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = ({ currentProject }) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li className={`sidebar-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <Link to="/profile" className="sidebar-link">Profile</Link>
        </li>
        <li className={`sidebar-item ${location.hash === "/#about" ? "active" : ""}`}>
          <Link to="/#about" className="sidebar-link">About</Link>
        </li>
        <li className={`sidebar-item ${location.hash === "/#faq" ? "active" : ""}`}>
          <Link to="/#faq" className="sidebar-link">FAQ</Link>
        </li>
        <li className={`sidebar-item ${location.pathname === "/#contact" ? "active" : ""}`}>
          <Link to="/#contact" className="sidebar-link">Contact support</Link>
        </li>
      </ul>
      {currentProject && (
        <div className="sidebar-project">
          <h3>Current Project</h3>
          <p className="project-name">{currentProject.name}</p>
          <p className="project-description">{currentProject.description}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
