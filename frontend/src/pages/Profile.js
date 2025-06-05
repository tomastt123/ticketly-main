import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../css/Profile.css";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [photo, setPhoto] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    if (loggedInUserId !== null) {
      fetchProfile();
    }
  }, [id, loggedInUserId]);

  const fetchLoggedInUserId = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoggedInUserId(response.data.id);
    } catch (err) {
      console.error("Error fetching logged-in user ID:", err.message);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = id
        ? `${process.env.REACT_APP_BACKEND_URL}/api/users/${id}/profile`
        : `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`;

        console.log("Fetched profile data:", profile);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      const profilePhoto = data.profilePhoto
        ? data.profilePhoto.startsWith("http")
          ? data.profilePhoto
          : `${process.env.REACT_APP_BACKEND_URL}/${data.profilePhoto.replace(/^undefined\//, "").replace(/\\/g, "/")}`
        : null;

      setProfile({ ...data, profilePhoto });
      setFormData({
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        phone: data.phone || "",
      });
      setIsOwnProfile(!id || id === loggedInUserId);
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError("Failed to update profile");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]; // Access the selected file
    if (!file) return; 
  
    const formData = new FormData();
    formData.append("photo", file);
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile photo uploaded successfully");
      fetchProfile();
    } catch (err) {
      console.error("Error uploading photo:", err.message);
      setError("Failed to upload profile photo");
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <Sidebar />
      <Navbar />
      <div className="profile-content">
        <div className="profile-container">
          <div className="profile-box">
            <div className="profile-header">
              <h1>
                {profile.name} {profile.surname}
              </h1>
            </div>
            <div className="profile-photo-section">
              {profile.profilePhoto ? (
                <img
                src={profile.profilePhoto || "fallback-image-url"}
                alt="Profile"
                className="profile-photo"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                />
              ) : (
                <p>No profile photo uploaded</p>
              )}
              {isOwnProfile && (
                <label htmlFor="photoUpload" className="profile-upload-button">
                  Upload Photo
                  <input
                    id="photoUpload"
                    type="file"
                    className="profile-upload-input"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
            {isOwnProfile ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="profile-form"
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="profile-input-class"
                />
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Surname"
                  className="profile-input-class"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  disabled
                  className="profile-input-class"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="profile-input-class"
                />
                <button type="submit" className="profile-save-button">
                  Save
                </button>
              </form>
            ) : (
              <div className="profile-details">
                <p><b>Email:</b> {profile.email}</p>
                <p><b>Phone:</b> {profile.phone}</p>
              </div>
            )}
            <div className="profile-team-section">
              <h3>Teams</h3>
              <ul>
                {profile?.teams.map((team) => (
                  <li key={team._id} className="profile-team-item">
                    <span>{team.name}</span>
                    {isOwnProfile && (
                      <button
                        className="profile-manage-teams-button"
                        onClick={() => (window.location.href = `/team/${team._id}`)}
                      >
                        Manage
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
