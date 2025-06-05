const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectColor,
  updateProjectPriority,
  getProjectPrioritySummary,
  getProjectCountByTeam,
} = require("../controllers/projectController");
const authenticate = require("../middleware/authMiddleware");
const Project = require("../models/Project"); // Import Project model
const { getProjectStatusSummary } = require("../controllers/projectController");
const router = express.Router();

// Routes for projects
router.post("/", authenticate, createProject); // Create a project
router.get("/", authenticate, getProjects); // Get all projects
router.get('/project-count-by-team', authenticate, getProjectCountByTeam);
router.get("/status-summary", authenticate, getProjectStatusSummary);
router.get("/priority-summary", authenticate, getProjectPrioritySummary);  // New endpoint for priority summary
router.get("/:id", authenticate, getProjectById); // Get a single project by ID
router.put("/:id", authenticate, updateProject); // Update a project
router.delete("/:id", authenticate, deleteProject); // Delete a project
router.patch("/:id/status", authenticate, updateProjectStatus); // Update project status
router.patch("/:id/priority", authenticate, updateProjectPriority);
router.put("/:id/color", authenticate, updateProjectColor);


module.exports = router;
