import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/TeamDetails.css'; 
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const TeamDetails = () => {
  const { id } = useParams(); // Team ID from the URL
  const [team, setTeam] = useState(null); // State to hold team data
  const [newMember, setNewMember] = useState({ email: "", role: "Member" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingRole, setEditingRole] = useState({});
  const [loading, setLoading] = useState(false);

  // for teams body class
  useEffect(() => {
    document.body.classList.add("teams-body");
    return () => {
      document.body.classList.remove("teams-body"); // Clean up when component unmounts
    };
  }, []);

  // Fetch team details when the component loads
  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/teams/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeam(response.data); // Set the team data
      setError(null);
    } catch (err) {
      console.error("Error fetching team details:", err);
      setError("Failed to fetch team details.");
    }
  };

  const handleInputChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

    const handleAddMember = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log("Adding member with data:", newMember);
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/teams/${id}/members/email`,
          newMember,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        // Fetch updated team details to ensure the UI reflects the changes
        await fetchTeamDetails();
    
        setSuccess("Member added successfully!");
        setNewMember({ email: "", role: "Member" }); // Reset the form fields
      } 
     catch (err) {
      console.error("Error adding member:", err.response?.data || err.message);
      setError("Failed to add member.");
    }
      finally {
        setLoading(false);
      }
    };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/teams/${id}/members/${memberId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeam(response.data);
      setSuccess("Role updated successfully!");
      setEditingRole({});
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/teams/${id}/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeam(response.data);
      setSuccess("Member removed successfully!");
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member.");
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", e.target.files[0]);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/teams/${id}/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTeam((prev) => ({ ...prev, photo: response.data.photo }));
      setSuccess("Photo uploaded successfully!");
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("Failed to upload photo.");
    }
  };
  

  // Handle error and loading states
  if (error) return <div>{error}</div>;
  if (!team) return <p>Loading team details...</p>;

  return (
    <div className="teams-details-container">
      <Navbar />
      <Sidebar />
      <div className="teams-details-card">
        {/* Photo Section */}
        <div className="teams-photo-section">
        {team?.photo ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${team.photo}`}
              alt="Team"
              className="team-photo"
            />
          ) : (
            <div className="team-photo-placeholder">
              <span>No Photo</span>
            </div>
          )}
          <label className="teams-custom-file-input">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            Choose Photo
          </label>
        </div>
  
        {/* Details Section */}
        <div className="teams-details-content">
          {/* Description */}
          <div className="teams-description">
            <h3>Description</h3>
            <p>{team?.description || "No description available."}</p>
          </div>
  
          {/* Members Section */}
          <div className="teams-members-section">
            <h3>Members</h3>
            <ul>
              {team?.members?.length > 0 ? (
                team.members.map((member) => (
                  <li key={member.user?._id}>
                    <strong>{member.user?.name || "Unknown Member"}</strong>
                    {member.role}
                    <button onClick={() => handleRemoveMember(member.user._id)}>
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <p>No members in this team.</p>
              )}
            </ul>
          </div>
  
          {/* Add Member Section */}
          <div className="team-add-member-section">
            <h3>Add New Member</h3>
            <form onSubmit={handleAddMember}>
              <input
                type="email"
                name="email"
                placeholder="Member Email"
                value={newMember.email}
                onChange={handleInputChange}
                required
              />
              <select
                name="role"
                value={newMember.role}
                onChange={handleInputChange}
                required
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Member"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamDetails;