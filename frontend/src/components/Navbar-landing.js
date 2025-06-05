import React, { useState } from "react";
import "../css/Navbar-landing.css";
import logo2 from "../../src/components/images/logo2.png";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="landing-page-navbar">
      <div className="landing-page-navbar-logo-container">
        <a href="https://ticketly.uk/">
          <img
            className="landing-page-navbar-logo"
            src={logo2}
            alt="Ticketly-navbar-logo"
          />
        </a>
      </div>

      {/* Hamburger Menu Button (Visible only on mobile) */}
      <button
        className="landing-page-navbar-hamburger"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      {/* Navigation Menu */}
      <ul
        className={`landing-page-navbar-menu ${
          isMenuOpen ? "open" : ""
        }`}
      >
        <li>
          <a href="/#features">Features</a>
        </li>
        <li>
          <a href="/#about">About</a>
        </li>
        <li>
          <a href="/#faq">FAQ</a>
        </li>
        <li>
          <a href="/#contact">Contact</a>
        </li>
        <li className="mobile-only">
          <a href="/register">Register</a>
        </li>
        <li className="mobile-only">
          <a href="/login">Login</a>
        </li>
      </ul>

      {/* Buttons (Visible on desktop only) */}
      <div className="landing-page-navbar-buttons desktop-only">
        <a href="/register" className="landing-page-btn get-started">
          Get Started
        </a>
        <a href="/login" className="desktop-login-btn">
          Login
        </a>
      </div>
    </nav>
  );
};

export default LandingNavbar;
