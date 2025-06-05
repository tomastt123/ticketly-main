import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Register.css";
import LandingNavbar from "../components/Navbar-landing";
import { jwtDecode } from "jwt-decode";


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignUp"),
        { theme: "outline", size: "large" }
      );
    }
  }, [clientId]);

    // Add body class on mount and remove on unmount
    useEffect(() => {
      document.body.classList.add('register-page-body');
      
      return () => {
        document.body.classList.remove('register-page-body');
      };
    }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { name, surname, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`, // Correctly formatted URL
        {
          name,
          surname,
          email,
          password,
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/login"); // Redirect to login after registration
      }, 3000);
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  // ✅ Handle Google Signup
  const handleGoogleResponse = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      console.log("Google User:", decoded);

      const { email, given_name: name, family_name: surname } = decoded;

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/google`, {
        token: response.credential,
      });

      console.log("Google Register Response:", res.data);

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard"); // Redirect after successful signup
      }, 2000);
    } catch (error) {
      setError("Google signup failed. Try again.");
      console.error("Google signup error:", error);
    }
  };

  return (
  <div className="register-page">
          <LandingNavbar/>

    {/* Logo Container */}
  <div className="logo-container">
  </div>

    <div className="register-container">
      <h1 className="register-title">Create an Account</h1>
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Registration successful! Redirecting to login...
        </div>
      )}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="form-input-text"
          required
        />
        <input
         type="text"
         name="surname"
         placeholder="Surname"
         value={formData.surname}
         onChange={handleChange}
         className="form-input-text"
         required
       />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input"
          required
        />
        <button type="submit" className="register-button">
          Register
        </button>
      </form>

      <hr />
        <div className="google-signup" id="googleSignUp"></div> {/* Google Signup Button */}
      <p className="login-link">
        Already have an account? <a href="/login">Log in here</a>.
      </p>
    </div>
  </div>
  );
};

export default Register;
