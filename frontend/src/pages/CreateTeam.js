import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/CreateTeams.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const CreateTeam = () => {
  const [teamData, setTeamData] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/teams`,
        teamData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Team created successfully!");
      setTimeout(() => {
        navigate(`/team/${response.data._id}`);
      }, 1500);
    } catch (err) {
      console.error("Error creating team:", err);
      setError("Failed to create team. Please try again.");
    }
  };

  return (
    <div className="create-teams-container">
      <Navbar />
      <Sidebar />
      <div className="create-teams-card">
        <h1 className="create-teams-title">Create a New Team</h1>
        <form onSubmit={handleCreateTeam} className="create-teams-form">
          <input
            type="text"
            name="name"
            placeholder="Team Name"
            value={teamData.name}
            onChange={handleInputChange}
            className="create-teams-input"
            required
          />
          <textarea
            name="description"
            placeholder="Team Description"
            value={teamData.description}
            onChange={handleInputChange}
            className="create-teams-textarea"
            required
          />
          <button type="submit" className="create-teams-submit-button">
            Create Team
          </button>
        </form>
        {error && <p className="create-teams-error">{error}</p>}
        {success && <p className="create-teams-success">{success}</p>}
      </div>
    </div>
  );
};

export default CreateTeam;
