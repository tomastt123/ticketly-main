import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import BugDetails from "./pages/BugDetails";
import ProtectedRoute from "./context/ProtectedRoute"; // Import ProtectedRoute
import TeamDetails from "./pages/TeamDetails";
import CreateTeam from "./pages/CreateTeam";
import ManageTeams from "./pages/ManageTeams";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Footer from "./components/Footer"; // Import Footer
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsandConditions from "./pages/TermsandConditions";


const App = () => {
  return (
    <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsandConditions />} />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bug/:id"
            element={
              <ProtectedRoute>
                <BugDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/:id"
            element={
              <ProtectedRoute>
                <TeamDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-teams"
            element={
              <ProtectedRoute>
                <ManageTeams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-team"
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
            />
        </Routes>
        <Footer />
      </Router>
  );
};

export default App;
