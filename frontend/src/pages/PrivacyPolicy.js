import React from "react";
import "../css/PrivacyPolicy.css";
import LandingNavbar from "../components/Navbar-landing";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
        <LandingNavbar />
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p>Last updated: [17.02.2025]</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Ticketly! Your privacy is important to us. This Privacy Policy
          explains how we collect, use, and protect your information.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We may collect the following information when you use our service:</p>
        <ul>
          <li>Personal details (name, email, etc.) when you contact us.</li>
          <li>Usage data to improve the platform.</li>
          <li>Any information you voluntarily provide.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Respond to inquiries and support requests.</li>
          <li>Enhance security and prevent fraud.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data.</p>

        <h2>5. Third-Party Services</h2>
        <p>We do not sell your data. However, we may use third-party tools like EmailJS.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information.</p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          📧 <a href="mailto:tomas.tvarijonavicius@gmail.com">tomas.tvarijonavicius@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
