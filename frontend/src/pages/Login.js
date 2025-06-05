import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Login.css";
import LandingNavbar from "../components/Navbar-landing.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;

      if (!token) {
        throw new Error("Login failed: No token received");
      }

      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Server error. Please try again later."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const token = response.credential;
      const backendResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token: jwtToken } = backendResponse.data;

      if (!jwtToken) {
        throw new Error("Google login failed: No token received");
      }

      localStorage.setItem("token", jwtToken);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
    }
  };

  useEffect(() => {
    const initializeGoogleLogin = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
  
        window.google.accounts.id.renderButton(document.getElementById("google-login"), {
          theme: "outline",
          size: "large",
        });
      } else {
        console.error("Google API script not loaded.");
      }
    };
  
    if (document.readyState === "complete") {
      initializeGoogleLogin();
    } else {
      window.addEventListener("load", initializeGoogleLogin);
      return () => window.removeEventListener("load", initializeGoogleLogin);
    }
  }, []);

  return (
  <div className="login-page">
    <LandingNavbar></LandingNavbar>
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Good to see you again</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <button type="submit" className="login-button">
              Login
            </button>
          )}
        </form>
        {error && <div className="error-message">{error}</div>}
        <hr />
        <div id="google-login" className="google-login-button"></div>
      </div>
    </div>
  </div>
  );
};

export default Login;
