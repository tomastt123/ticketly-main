import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Navbar.css";
import logo2 from ".//images/logo2.png";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ selectedTeam, onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/teams`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        <a href="https://ticketly.uk/dashboard">
          <img className="navbar-logo" src={logo2} alt="Ticketly-navbar-logo" />
        </a>
      </div>

      <button
        className="burger-menu-button"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        ref={buttonRef}
      >
        ☰
      </button>

      <div ref={menuRef} className={`navbar-actions ${isMenuOpen ? "mobile-menu-open" : ""}`}>
      <ThemeToggle />
        <button onClick={() => navigate("/manage-teams")} className="manage-teams-button">
          Manage Teams
        </button>
        <button onClick={() => navigate("/create-team")} className="create-team-button">
          Create Team
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>

        <div className="mobile-only">
          <button onClick={() => navigate("/dashboard")} className="dashboard-button">
            Dashboard
          </button>
          <button onClick={() => navigate("/profile")} className="profile-button">
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
