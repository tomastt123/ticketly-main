import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/ManageTeams.css";

const ManageTeams = () => {
  const [teams, setTeams] = useState([]);
  const [teamForms, setTeamForms] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/teams`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeams(response.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to fetch teams.");
      }
    };

    fetchTeams();
  }, []);

  const addMemberToTeamByEmail = async (teamId, email, role = "Member") => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/teams/${teamId}/members/email`,
        { email, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Member added successfully!");
    } catch (err) {
      console.error("Error adding member by email:", err.response?.data || err.message);
      alert("Failed to add member to the team.");
    }
  };

  const toggleAddMemberForm = (teamId) => {
    setTeamForms((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        showForm: !prev[teamId]?.showForm,
        email: prev[teamId]?.email || "",
        role: prev[teamId]?.role || "Member",
      },
    }));
  };

  const updateFormData = (teamId, field, value) => {
    setTeamForms((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: value,
      },
    }));
  };

  if (error) return <p>{error}</p>;

  if (!teams || teams.length === 0) {
    return <p>Loading teams...</p>;
  }

  return (
   <div className="layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="content">
        {/* Navbar */}
        <Navbar />

    <div className="manage-teams-container">
      <h1 className="page-title">Manage Teams</h1>
      <div className="teams-section">
        {teams.length === 0 ? (
          <p className="no-teams-text">No teams found. Create a new team to get started!</p>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <div key={team?._id} className="team-card">
                <h2 className="team-name">{team?.name || "Unnamed Team"}</h2>
                <p className="team-description">
                  {team?.description || "No description available."}
                </p>
                <button
                  onClick={() => navigate(`/team/${team._id}`)}
                  className="manage-teams-details-button"
                >
                  View Details
                </button>
                <button
                  onClick={() => toggleAddMemberForm(team._id)}
                  className="add-member-button"
                >
                  Add Member
                </button>
                {teamForms[team._id]?.showForm && (
                  <div className="add-member-form">
                    <input
                      type="email"
                      placeholder="Enter Member Email"
                      value={teamForms[team._id]?.email || ""}
                      onChange={(e) =>
                        updateFormData(team._id, "email", e.target.value)
                      }
                    />
                    <select
                      value={teamForms[team._id]?.role || "Member"}
                      onChange={(e) =>
                        updateFormData(team._id, "role", e.target.value)
                      }
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button
                      onClick={() => {
                        addMemberToTeamByEmail(
                          team._id,
                          teamForms[team._id]?.email,
                          teamForms[team._id]?.role
                        );
                        toggleAddMemberForm(team._id);
                      }}
                      className="submit-button"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  </div>
  );
};

export default ManageTeams;
