import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import DashboardChartsSection from './../components/DashboardChartsSection'


function truncateText(text, limit) {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
}

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectData, setProjectData] = useState({ name: "", description: "", team: "", priority: "Low" });
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(localStorage.getItem("selectedTeam") || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardColors, setCardColors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(null);

  const colorOptions = [
    { name: "Light Yellow", value: "#fff9c4" },
    { name: "Light Red", value: "#ffcdd2" },
    { name: "Light Green", value: "#c8e6c9" },
    { name: "Default White", value: "#ffffff" },
    { name: "Light Blue", value: "#bbdefb" },
  ];

    const handleColorChange = async (color, projectId) => {
      try {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectId}/color`,
          { color },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
  
        setCardColors((prevColors) => ({
          ...prevColors,
          [projectId]: color,
        }));
  
        setShowColorPicker(null);
      } catch (error) {
        console.error("Error updating color:", error);
        setError("Failed to update project color. Please try again.");
      }
    };
  
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching projects with selectedTeam:", selectedTeam);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: selectedTeam ? { teamId: selectedTeam } : {},
        });
  
        console.log("Projects fetched successfully:", response.data);
        setProjects(response.data);
  
        const colors = {};
        response.data.forEach((project) => {
          colors[project._id] = project.color || "#ffffff";
        });
        setCardColors(colors);
      } catch (error) {
        console.error("Error fetching projects:", error.response || error.message);
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/teams`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError("Failed to fetch teams. Please try again later.");
      }
    };
  
    useEffect(() => {
      console.log("Selected team in navbar:", selectedTeam);
      fetchProjects();
      fetchTeams();
    }, [selectedTeam]);

  
    const handleTeamSelect = (teamId) => {
      console.log("Team selected:", teamId);
      setSelectedTeam(teamId);
      localStorage.setItem("selectedTeam", teamId);
    };
  
    const handleCreateProject = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/projects`,
          {
            name: projectData.name,
            description: projectData.description,
            team: projectData.team || null,
            priority: projectData.priority || null,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        fetchProjects();
        setIsCreatingProject(false);
        setProjectData({ name: "", description: "", team: "" });
      } catch (error) {
        console.error("Error creating project:", error);
        setError("Failed to create project. Please try again.");
      }
    };
  
    const confirmDelete = async (projectId) => {
      if (!window.confirm("Are you sure you want to delete this project?")) {
        return;
      }
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Failed to delete project. Please try again.");
      }
    };
  
    const handleDeleteProject = async () => {
      if (!projectToDelete) return;
  
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projectToDelete}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProjects((prevProjects) =>
          prevProjects.filter((p) => p._id !== projectToDelete)
        );
        setShowConfirm(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Failed to delete project. Please try again.");
      }
    };
  
    const handleChange = (e) => {
      setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };


  return (
  <div className="flex">
    <Sidebar />
        <div className="flex-grow p-4">
          <Navbar
            teams={teams}
            selectedTeam={selectedTeam}
            onTeamSelect={handleTeamSelect}
          />
          <h1 className="text-2xl font-bold mb-4">Projects</h1>

          {error && <div className="error-message mb-4">{error}</div>}

          <div className="dashboard-actions">
          <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}></div>

            <button
              className="create-project-button"
              onClick={() => setIsCreatingProject(!isCreatingProject)}
            >
              {isCreatingProject ? "Cancel" : "Create New Project"}
            </button>

            <div className="dashboard-team-dropdown">
              <select
                id="team-select"
                value={selectedTeam}
                onChange={(e) => handleTeamSelect(e.target.value)}
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isCreatingProject && (
            <div className="form-container">
              <form onSubmit={handleCreateProject} className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={projectData.name}
                  onChange={handleChange}
                  className="project-input-field, project-input-field-name"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={projectData.description}
                  onChange={handleChange}
                  className="project-input-field, project-input-field-description"
                  required
                />
                <select
                  name="team"
                  value={projectData.team}
                  onChange={handleChange}
                  className="team-dropdown"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <select
                  name="priority"
                  value={projectData.priority}
                  onChange={handleChange}
                  className="team-dropdown"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <button className="submit-button">Submit</button>
              </form>
            </div>
          )}

          {loading ? (
            <div>Loading projects...</div>
          ) : (
            <div className="grid">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="project-card"
                  style={{
                    backgroundColor: cardColors[project._id] || "#ffffff",
                  }}
                >
                  <h2>{truncateText(project.name, 20)}</h2>
                  <p className="project-description-text">
                    {truncateText(project.description, 50)}
                  </p>
                  <p className="team-name-text">
                    <strong>Team:</strong> {project.team?.name || "None"}
                  </p>
                  <p className="status-text">
                    <strong>Status:</strong> {project.status || "Open"}
                  </p>
                  <p className="status-text">
                    <strong>Priority:</strong> {project.priority || "Low"}
                  </p>
                  <Link to={`/project/${project._id}`}>
                    <button className="details-button">View Details</button>
                  </Link>
                  <button
                    onClick={() => confirmDelete(project._id)}
                    className="delete-button"
                  >
                    Delete Project
                  </button>

                  <div className="three-dots-menu">
                    <button onClick={() => setShowColorPicker(project._id)}>...</button>
                    {showColorPicker === project._id && (
                      <div className="color-picker-dropdown">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            className="color-swatch"
                            style={{
                              backgroundColor: color.value,
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                            }}                            
                            onClick={() => handleColorChange(color.value, project._id)}
                            title={color.name}
                          ></button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <DashboardChartsSection />

                {showConfirm && (
                  <div className="confirm-dialog">
                    <p>Are you sure you want to delete this project?</p>
                    <button onClick={handleDeleteProject} className="confirm-yes">
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                        setProjectToDelete(null);
                      }}
                      className="confirm-no"
                    >
                      No
                    </button>
                  </div>
                )}
        </div>
      </div>
    );
  }

export default Dashboard;