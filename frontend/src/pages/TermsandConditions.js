import React from "react";
import "../css/TermsAndConditions.css"; // Optional for styling
import LandingNavbar from "../components/Navbar-landing";

const TermsAndConditions = () => {
  return (
    <div className="terms-conditions">
      <LandingNavbar />
      <div className="terms-container">
        <h1>Terms & Conditions</h1>
        <p>Last updated: [Insert Date]</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Ticketly! These Terms & Conditions outline the rules and
          regulations for using our platform. By accessing or using Ticketly, you agree
          to these terms.
        </p>

        <h2>2. Use of Our Service</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the platform for lawful purposes only.</li>
          <li>Not misuse or exploit the service in any unauthorized way.</li>
          <li>Provide accurate information when registering or using the service.</li>
        </ul>

        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials. Notify us immediately if you suspect unauthorized use of your
          account.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content on Ticketly, including logos and software, is owned by us or our
          licensors. You may not copy, modify, or distribute our content without
          permission.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          Ticketly is provided "as is" without warranties. We are not responsible for any
          damages resulting from your use of the platform.
        </p>

        <h2>6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to Ticketly if you
          violate these terms.
        </p>

        <h2>7. Changes to These Terms</h2>
        <p>
          We may update these Terms & Conditions from time to time. Continued use of
          Ticketly after changes means you accept the revised terms.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about our Terms & Conditions, please contact us at:
          <br />
          📧 <a href="mailto:tomas.tvarijonavicius@gmail.com">tomas.tvarijonavicius@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
