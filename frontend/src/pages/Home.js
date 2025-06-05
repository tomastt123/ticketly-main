import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../css/LandingPage.css";
import LandingNavbar from "../components/Navbar-landing.js";
import recording1 from "../components/images/recording1.mp4";
import EEteam from "../components/images/EEteam.jpg";
import interfacephoto from "../components/images/interface.jpg";
import officecollab from "../components/images/officecollab.jpg";
import aiss from "../components/images/aiss.jpg";
import emailjs from "@emailjs/browser";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`} onClick={onClick}>
      <div className="faq-question">
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

const LandingPage = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [location.hash]);

  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How do I get started?",
      answer: "Sign up for a free account and start managing your projects in minutes!",
    },
    { question: "Is Ticketly free to use?", answer: "Yes, Ticketly currently is fully free." },
    {
      question: "What features does Ticketly offer?",
      answer: "Ticketly provides bug tracking, real-time collaboration, and customizable workflows.",
    },
    {
      question: "Why some functions are missing or not fully working?",
      answer: "Since the app is still in beta, some features may not be fully available yet.",
    },
    { question: "How secure is my data on Ticketly?", answer: "We use industry-standard encryption to ensure your data is safe and secure." },
    { question: "Can I integrate Ticketly with Slack?", answer: "Yes, Ticketly integrates seamlessly with Slack for better collaboration." },
    { question: "Does Ticketly support mobile devices?", answer: "Yes, Ticketly is fully responsive and works on all devices." },
    { question: "How can I contact support?", answer: "You can reach out to support via the 'Contact Us' section of our website." },
  ];

  /** Contact Form State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);

  /** Handles Email Sending */
  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    
    try {
      const result = await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setStateMessage("Message sent successfully!");
      e.target.reset(); // Clear form after submission
    } catch (error) {
      console.error("Email sending error:", error);
      setStateMessage("Failed to send the message. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStateMessage(null), 5000); // Hide message after 5 sec
    }
  };

  return (
    <div className="landing-page">
      <LandingNavbar />

      <section id="hero" className="landing-page-hero">
        <div className="hero-container">
          <div className="landing-page-hero-content">
            <h1>Effortless Bug Tracking with Ticketly</h1>
            <hr />
            <p>Simplify bug tracking and focus on building amazing products.</p>
            <a href="/register" className="landing-page-btn get-started">
              Get Started
            </a>
          </div>
          <div className="landing-page-hero-image">
            <video className="hero-video" src={recording1} type="video/mp4" autoPlay loop muted playsInline />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-page-features">
        <div className="landing-page-feature">
          <div className="landing-page-feature-image">
            <img className="feature-image" src={interfacephoto} alt="Interface" />
          </div>
          <div className="landing-page-feature-content">
            <h2>Intuitive Layout</h2>
            <hr />
            <p>Manage bugs effortlessly with a clean, modern design tailored to your needs.</p>
          </div>
        </div>

        <div className="landing-page-feature">
          <div className="landing-page-feature-content">
            <h2>Real-Time Collaboration</h2>
            <hr />
            <p>Work seamlessly with your team to resolve bugs faster than ever.</p>
          </div>
          <div className="landing-page-feature-image">
            <img className="feature-image" src={EEteam} alt="Eastern European Team" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-page-about">
        <div className="about-container">
          <div className="landing-page-about-image">
            <img className="about-image" src={officecollab} alt="Office Collaboration" />
          </div>
          <div className="landing-page-about-content">
            <h2>Why Ticketly?</h2>
            <hr />
            <p>Ticketly empowers developers and businesses to manage bugs effortlessly. Built with simplicity and scalability in mind, it adapts to teams of all sizes.</p>
          </div>
        </div>

        <div className="landing-page-feature">
          <div className="landing-page-feature-content">
            <h2>AI-Powered Bug Insights</h2>
            <hr />
            <p>Let our intelligent AI analyze your code and generate smart, actionable insights—helping your team resolve issues faster and more efficiently.</p>
          </div>
          <div className="landing-page-feature-image">
            <img className="feature-image" src={aiss} alt="AI assistant" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="landing-page-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="landing-page-contact">
        <h2>Contact Us</h2>
        <p className="contact-description">Need to get in touch with us? Fill out the form below with your inquiry, and we’ll get back to you as soon as possible.</p>
        <div className="contact-container">
          <form className="contact-form" onSubmit={sendEmail}>
            <div className="form-group">
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="first-name">First Name</label>
                  <input type="text" id="first-name" name="user_firstName" classname="contact-form-input-section" required />
                </div>
                <div className="form-column">
                  <label htmlFor="last-name">Last Name</label>
                  <input type="text" id="last-name" name="user_lastName" classname="contact-form-input-section" required />
                </div>
              </div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="user_email" classname="contact-form-input-section" required />
              <label htmlFor="message">What can we help you with?</label>
              <textarea id="message" name="message" rows="4" classname="contact-form-input-section" required />
              <button type="submit" className="contact-submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </div>
            {stateMessage && <p>{stateMessage}</p>}
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
