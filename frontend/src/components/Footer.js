import React from "react";
import "../css/Footer.css";
import logo2 from "../components/images/logo2.png";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-main">
        <div className="footer-column">
          <img src={logo2} alt="logo2" className="footer-logo" />
          <p>Vilnius, Lithuania</p>
        </div>

        <div className="footer-column">
          <h4>Contact Us</h4>
          <div className="footer-contact-row">
            <a href="tel:+37062054502" className="footer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="white"
                  d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1.5 1.5 0 011.6-.34 11.72 11.72 0 003.7.59 1.5 1.5 0 011.5 1.5v3.36a1.5 1.5 0 01-1.34 1.5A19.87 19.87 0 012 4.34 1.5 1.5 0 013.5 3h3.36a1.5 1.5 0 011.5 1.5 11.72 11.72 0 00.59 3.7 1.5 1.5 0 01-.34 1.6l-2.2 2.2z"
                />
              </svg>
            </a>
            <a href="mailto:tomas.tvarijonavicius@gmail.com" className="footer-icon" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
               <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#ffffff"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/tomastt"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="white"
                  d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8.1 19H5V9h3.1zm-.06-11.21A1.74 1.74 0 016.35 6 1.74 1.74 0 018.1 4.25a1.74 1.74 0 011.75 1.75 1.74 1.74 0 01-1.75 1.79zM19 19h-3.1v-5.21c0-1.26-.94-2.29-2.19-2.29s-2.19 1-2.19 2.29V19H8.1V9H11v1.5a4.07 4.07 0 013.69-2.25c2.39 0 4.31 1.91 4.31 4.31z"
                />
              </svg>
            </a>
            <a
              href="https://github.com/tomastt123"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="white"
                  d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.6v-2.3c-3.4.7-4.1-1.6-4.1-1.6a3.1 3.1 0 00-1.3-1.7c-1-.7.1-.7.1-.7a2.5 2.5 0 011.8 1.2c1 .1 1.6-.7 1.9-1.2a2.6 2.6 0 01.9-1.2c-2.7-.3-5.5-1.3-5.5-5.9a4.6 4.6 0 011.2-3.2 4.3 4.3 0 01.1-3.2s1-.3 3.4 1.3a11.8 11.8 0 016.2 0c2.3-1.6 3.4-1.3 3.4-1.3a4.3 4.3 0 01.1 3.2 4.6 4.6 0 011.2 3.2c0 4.6-2.9 5.6-5.6 5.9a2.6 2.6 0 01.7 2c0 1.4-.1 2.5-.1 2.9 0 .3.2.7.8.6A12 12 0 0012 .5z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Announcement</h4>
          <p>
            <strong>Early Access:</strong> This is a beta build. Features are
            still being tested and refined. Thank you for your feedback!
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <a href="https://ticketly.uk/">Home</a>
        <a href="https://ticketly.uk/#about">About</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-and-conditions">Terms & Conditions</a>
        </div>
    </footer>
  );
};

export default Footer;
