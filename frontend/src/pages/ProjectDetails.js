import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [error, setError] = useState(null);
  const [isAddingBug, setIsAddingBug] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the ID of the comment being edited
  const [editingBugId, setEditingBugId] = useState(null);
  const [editingBugData, setEditingBugData] = useState({ title: "", description: "" }); // Stores temporary edits
  const [commentText, setCommentText] = useState({}); // Store temporary text for comments being edited
  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Open",
    createdBy: "",
  });
  const navigate = useNavigate();
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [bugImages, setBugImages] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");


  const openModal = (imgSrc) => {
    setModalImage(imgSrc);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setModalImage("");
  };

  const handleSaveCommentEdit = async (bugId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to edit comments.");
        return;
      }
  
      // Use the correct endpoint with bugId and commentId
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments/${commentId}`,
        { text: commentText[commentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Refresh data to reflect changes
      await fetchProjectData();
      setEditingCommentId(null); // Exit edit mode
    } catch (error) {
      console.error("Error saving comment:", error);
      alert("Failed to save comment.");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    // Update local state immediately so the UI reflects the change
    setProject((prev) => ({ ...prev, status: newStatus }));
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
    
    try {
      // Send a PATCH request to update the status on the backend.
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project status updated successfully!");
      // Optionally re-fetch the project data to ensure the UI is up-to-date
      fetchProjectData();
    } catch (error) {
      console.error("Error updating project status:", error.response?.data || error.message);
      alert("Failed to update project status.");
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
  
    setProject((prev) => ({ ...prev, priority: newPriority }));
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
  
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}/priority`,
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project priority updated successfully!");
      fetchProjectData();
    } catch (error) {
      console.error("Error updating project priority:", error.response?.data || error.message);
      alert("Failed to update project priority.");
    }
  };


  const handleAskAI = async (bugDescription, existingComments, bugId, projectName, projectDescription) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to use this feature.");
        return;
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-comment`,
        { projectDescription, bugDescription, existingComments, projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.comment) {
        setAiSuggestions((prev) => ({ ...prev, [bugId]: response.data.comment }));
      } else {
        alert("AI could not generate a comment.");
      }
    } catch (error) {
      console.error("Error generating AI comment:", error.message);
      alert("Error generating AI comment. Please try again later.");
    }
  };

  const handleSubmitAiComment = async (bugId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to use this feature.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments`,
        { text: aiSuggestions[bugId] }, // Submit the AI suggestion
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setBugs((prevBugs) =>
        prevBugs.map((bug) =>
          bug._id === bugId
            ? { ...bug, comments: [...bug.comments, response.data] }
            : bug
        )
      );
  
      setAiSuggestions((prev) => {
        const updated = { ...prev };
        delete updated[bugId]; // Remove the temporary AI suggestion
        return updated;
      });
    } catch (error) {
      console.error("Error submitting AI comment:", error.message);
    }
  };
  
  const handleDeclineAiComment = (bugId) => {
    setAiSuggestions((prev) => {
      const updated = { ...prev };
      delete updated[bugId]; // Remove the temporary AI suggestion
      return updated;
    });
  };

  const fetchProjectData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const projectResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(projectResponse.data);

      const bugsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs?project=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBugs(bugsResponse.data);
    }
    catch (error) { 
      console.error("Error fetching project data:", error);
    } // <- Missing closing bracket was added here
  };
    

  useEffect(() => {
    fetchProjectData();
  }, [id, navigate]);

  const handleAddBug = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs`,
        { ...bugData, project: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProjectData();
      setIsAddingBug(false);
      setBugData({
        title: "",
        description: "",
        priority: "Low",
        status: "Open",
        createdBy: "",
      });
    } catch (error) {
      console.error("Error adding bug:", error);
    }
  };

  const handleChange = (e) => {
    setBugData({ ...bugData, [e.target.name]: e.target.value });
  };

  const handleAddComment = async (e, bugId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments`,
        { text: commentText[bugId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBugs((prevBugs) =>
        prevBugs.map((bug) =>
          bug._id === bugId
            ? { ...bug, comments: [...bug.comments, response.data] }
            : bug
        )
      );

      setCommentText((prev) => ({ ...prev, [bugId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  /*images*/
  const handleUploadBugImage = async (event, bugId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("bugImage", event.target.files[0]); // Ensure this matches backend expectations
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("🔍 Backend Response:", response.data); // Debugging
  
      if (!response.data.filePath) {
        console.error("❌ No filePath returned from backend");
        alert("Upload successful, but no filePath returned from backend.");
        return;
      }

      // Fetch updated bug data after successful upload
      fetchProjectData();
    } catch (error) {
      console.error("❌ Error uploading bug image:", error);
      alert("Failed to upload bug image.");
    }
  };
  
  const handleUploadCommentImage = async (event, commentId, bugId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("commentImage", event.target.files[0]);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments/${commentId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("🔍 Backend Response:", response.data);
  
      if (!response.data.filePath) {
        console.error("❌ No filePath returned from backend");
        alert("Upload successful, but no filePath returned from backend.");
        return;
      }
  
      fetchProjectData(); // Refresh UI after upload
    } catch (error) {
      console.error("❌ Error uploading comment image:", error);
      alert("Failed to upload comment image.");
    }
  };

  const handleDeleteBugImage = async (bugId, filePath) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/images`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { filePath }  // Axios allows sending data in DELETE requests via the "data" property
        }
      );
      alert("Bug image deleted successfully!");
      fetchProjectData(); // Refresh the data to update the images array
    } catch (error) {
      console.error("Error deleting bug image:", error.response?.data || error.message);
      alert("Failed to delete bug image.");
    }
  };

  const handleDeleteCommentImage = async (bugId, commentId, filePath) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments/${commentId}/images`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { filePath }
        }
      );
      alert("Comment image deleted successfully!");
      fetchProjectData(); // Refresh data to update the comment's images array
    } catch (error) {
      console.error("Error deleting comment image:", error.response?.data || error.message);
      alert("Failed to delete comment image.");
    }
  };

  const startEditBug = (bug) => {
    setEditingBugId(bug._id);
    setEditingBugData({ title: bug.title, description: bug.description });
  };

  const handleEditBug = async (bugId) => {
    try {
      const token = localStorage.getItem("token");
      const { title, description } = editingBugData;
  
      // Validate inputs
      if (!title.trim() || !description.trim()) {
        alert("Title and description cannot be empty!");
        return;
      }
  
      // Send update request to backend
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Optimistically update the UI (update only the edited bug)
      setBugs((prevBugs) =>
        prevBugs.map((bug) =>
          bug._id === bugId ? { ...bug, title, description } : bug
        )
      );
  
      // Exit edit mode and reset editing state
      setEditingBugId(null);
      setEditingBugData({ title: "", description: "" });
    } catch (error) {
      console.error("Error updating bug:", error);
      alert("Failed to update bug.");
    }
  };

    const handleStartEditComment = (commentId, currentText) => {
      setEditingCommentId(commentId);
      setCommentText((prev) => ({
        ...prev,
        [commentId]: currentText, // Initialize with current comment text
      }));
    };

    
  const handleDeleteBug = async (bugId) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Bug deleted successfully!");
      fetchProjectData(); // Refresh data
    } catch (error) {
      console.error("Error deleting bug:", error.message);
      alert("Failed to delete bug.");
    }
  };

  const handleEditComment = async (bugId, commentId) => {
    const newCommentText = prompt("Enter new comment:");
  
    if (!newCommentText) {
      alert("Comment cannot be empty.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments/${commentId}`,
        { text: newCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Comment updated successfully!");
      fetchProjectData(); // Refresh data
    } catch (error) {
      console.error("Error updating comment:", error.message);
      alert("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (bugId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }
  
      // Send DELETE request
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/bugs/${bugId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("Comment deleted successfully!");
      fetchProjectData(); // Refresh data to update UI
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      alert(`Failed to delete comment: ${error.response?.data?.message || "Unknown error"}`);
    }
  };


  return (
    <div className="project-details-container">
      <Sidebar />
      <div className="project-details-content">
        <Navbar />
        <div className="project-details-wrapper">
        <Breadcrumbs
          paths={[
            { to: "/dashboard", label: "Dashboard" },
            { label: project?.name || "Project Details" }
          ]}
        />
          <p className="project-name">
            <strong>Project name:</strong> {project?.name}
          </p>
          <p className="project-description">
            <strong>Description:</strong> {project?.description || "No description available"}
          </p>
          <div className="status-section">
            <h3 className="status-header">Update Status</h3>
            <select
              id="status"
              value={project?.status || "Open"}
              onChange={handleStatusChange}
              className="status-dropdown"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
            <h3 className="status-header">Change Priority</h3>
          <select
            id="priority"
            value={project?.priority || "Low"}
            onChange={handlePriorityChange}
            className="status-dropdown"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          </div>
        </div>
  
        <button
          className="add-bug-button"
          onClick={() => setIsAddingBug(!isAddingBug)}
        >
          {isAddingBug ? "Cancel" : "Add Bug"}
        </button>
  
        {isAddingBug && (
          <form onSubmit={handleAddBug} className="add-bug-form">
            <input
              name="title"
              placeholder="Bug Title"
              value={bugData.title}
              onChange={handleChange}
              className="bug-form-input"
              required
            />
            <textarea
              name="description"
              placeholder="Bug Description"
              value={bugData.description}
              onChange={handleChange}
              className="bug-form-input"
              required
            />
            <select
              name="priority"
              value={bugData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button type="submit" className="submit-bug-button">
              Submit Bug
            </button>
          </form>
        )}
  
          {bugs.map((bug) => (
          <div key={bug._id} className="bug-card">
            <div className="bug-header">
              {editingBugId === bug._id ? (
                <>
                  <input
                    type="text"
                    value={editingBugData.title}
                    onChange={(e) =>
                      setEditingBugData((prev) => ({ ...prev, title: e.target.value, description: e.target.value }))
                    }
                    className="bug-edit-input"
                  />
                  <input
                  type="text"
                  value={editingBugData.description}
                  onChange={(e) =>
                    setEditingBugData((prev) => ({ ...prev, description: e.target.value }))
                  }
                    className="bug-edit-input"
                  />

                  <button onClick={() => handleEditBug(bug._id)} className="save-btn">
                    Save
                  </button>
                  <button onClick={() => setEditingBugId(null)} className="cancel-btn">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>Title: {bug.title}</h3>
                  <button onClick={() => startEditBug(bug)} className="edit-btn">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDeleteBug(bug._id)} className="delete-btn">
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>

            {editingBugId !== bug._id && (
              <p className="bug-text">
                <strong>Description:</strong> {bug.description}
              </p>
            )}

            {editingBugId !== bug._id && (
              <p className="bug-text">
                <strong>Priority:</strong> {bug.priority}
              </p>
            )}

            {/* Bug Images Thumbnails */}
              {bug.images && bug.images.length > 0 && (
                <div className="bug-images-thumbnails">
                  {bug.images.map((img, index) => (
                    <div
                      key={index}
                      className="thumbnail"
                      onClick={() =>
                      openModal(`${process.env.REACT_APP_BACKEND_URL}${img}`)
                      }
                    >
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${img}`}
                        alt={`Bug image ${index + 1}`}
                      />
                      <button
                                    className="delete-image-btn"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents the click from bubbling up
                                      handleDeleteBugImage(bug._id, img);
                                    }}
                                  >
                                    X
                                  </button>
                    </div>
                  ))}
                </div>
              )}


          {/* File Upload Input for Bug Images */}
          <label className="custom-file-upload">
            Choose File
            <input
              type="file"
              onChange={(e) => handleUploadBugImage(e, bug._id)}
              className="upload-file"
            />
          </label>


            <p className="bug-created-by">
              <strong>Created by:</strong>{" "}
              <Link to={`/profile/${bug.createdBy?._id}`} className="user-link">
                {bug.createdBy?.name || "Unknown"}
              </Link>
            </p>
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content">
                    <img src={modalImage} alt="Full view" />
                  </div>
                </div>
              )}

            
            <div className="comments-section">
              <h4>Comments:</h4>

              {bug.comments.length > 0 ? (
                bug.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    {/* Comment Text or Editing Textarea */}
                    {editingCommentId === comment._id ? (
                      <textarea
                        value={commentText[comment._id] || comment.text}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                        className="comment-edit-textarea"
                      />
                    ) : (
                      <p>
                        <strong>Comment: </strong>
                        {comment.text}
                      </p>
                    )}

                     {/* Display Comment Thumbnails if Available */}
                        {comment.images && comment.images.length > 0 && (
                          <div className="comment-images-thumbnails">
                            {comment.images.map((img, index) => (
                              <div key={index} className="thumbnail" onClick={() => openModal(`${process.env.REACT_APP_BACKEND_URL}${img}`)}>
                                <img src={`${process.env.REACT_APP_BACKEND_URL}${img}`} alt={`Comment image ${index + 1}`} />
                                <button
                                    className="delete-image-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCommentImage(bug._id, comment._id, img);
                                    }}
                                  >
                                    X
                                  </button>
                              </div>
                            ))}
                          </div>
                        )}

                    {/* Buttons for Edit, Save, Delete */}
                    {editingCommentId === comment._id ? (
                      <button
                        onClick={() => handleSaveCommentEdit(bug._id, comment._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                      onClick={() => handleStartEditComment(comment._id, comment.text)}
                      className="edit-btn">
                        Edit Comment
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteComment(bug._id, comment._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>


                    {/* File Upload Button */}
                    <label className="custom-file-upload">
                      Choose File
                      <input
                        type="file"
                        onChange={(e) => handleUploadCommentImage(e, comment._id, bug._id)}
                        className="upload-file"
                      />
                    </label>


                    {/* Comment Author */}
                    <p>
                      <strong>Author:</strong>{" "}
                      <Link to={`/profile/${comment.author?._id}`} className="user-link">
                        {comment.author?.name || "Unknown"}
                      </Link>
                    </p>
                  </div>
                ))
              ) : (
                <p>No comments yet</p>
              )
              }
              {modalOpen && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content">
                  <img src={modalImage} alt="Full view" />
                </div>
              </div>
            )}
              
              {aiSuggestions[bug._id] && (
                <div className="ai-suggestion-container">
                <div className="ai-suggestion">
                  <p>
                    <strong>AI Suggestion: </strong>
                    {aiSuggestions[bug._id]}
                  </p>
                  <div className="ai-buttons">
                    <button
                      onClick={() => handleSubmitAiComment(bug._id)}
                      className="submit-ai-button"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => handleDeclineAiComment(bug._id)}
                      className="decline-ai-button"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            )}
  
              <textarea
                value={commentText[bug._id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({ ...prev, [bug._id]: e.target.value }))
                }
                placeholder="Add a comment..."
                className="comment-textarea"
              />
              <button
                onClick={(e) => handleAddComment(e, bug._id)}
                className="add-comment-button"
              >
                Add Comment
              </button>
              <button
                onClick={() => handleAskAI(bug.description, bug.comments, bug._id, project?.name, project?.description)}
                className="ask-ai-button"
              >
                Ask AI for help
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetails;
