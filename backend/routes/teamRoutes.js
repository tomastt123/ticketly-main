const express = require("express");
const authenticate = require("../middleware/authMiddleware"); // Ensure routes are protected
const Team = require("../models/Team");
const User = require("../models/User");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create a new team
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    // Check if the team name already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    // Create and save the new team
    const team = new Team({
      name,
      description,
      owner: userId,
      members: [{ user: userId, role: "Admin" }], // Add the creator as an admin
    });

    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
});

// Get all teams for the logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch teams where the user is a member
    const teams = await Team.find({ "members.user": userId }).populate("members.user", "name email");

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Error fetching teams", error: error.message });
  }
});

// Add a member to a team by userId
router.post("/:id/members", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Ensure only the team owner can add members
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to add members to this team" });
    }

    // Check if the user is already a member
    const isMember = team.members.some((member) => member.user.toString() === userId);
    if (isMember) {
      return res.status(400).json({ message: "User is already a member of this team" });
    }

    // Add the new member
    team.members.push({ user: userId, role: role || "Member" });
    const updatedTeam = await team.save();

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
});

// Add a member to a team by email
router.post("/:id/members/email", authenticate, async (req, res) => {
  try {
    const teamId = req.params.id;
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some((member) => member.user.toString() === user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: "User is already a member of this team" });
    }

    team.members.push({ user: user._id, role });
    await team.save();

    res.status(200).json({ message: "User added to the team successfully", team });
  } catch (error) {
    console.error("Error adding member by email:", error);
    res.status(500).json({ message: "Error adding member by email", error: error.message });
  }
});

// Remove a member from a team
router.delete("/:id/members/:userId", authenticate, async (req, res) => {
  try {
    const { id, userId } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Ensure only the team owner can remove members
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to remove members from this team" });
    }

    // Remove the member
    team.members = team.members.filter((member) => member.user.toString() !== userId);
    const updatedTeam = await team.save();

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Error removing member", error: error.message });
  }
});

// Get a team by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the team by ID
    const team = await Team.findById(id).populate("members.user", "name email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Error fetching team", error: error.message });
  }
});

// Upload team photo
router.post("/:id/photo", authenticate, upload.single("photo"), async (req, res) => {
  console.log("Request received for team photo upload");
  console.log("Request method:", req.method);
  console.log("Request path:", req.path);
  console.log("Team ID in params:", req.params.id);
  console.log("Authenticated user details:", req.user);

  try {
    const { id } = req.params;

    // Find the team by ID
    const team = await Team.findById(id);
    if (!team) {
      console.log("Error: Team not found for ID:", id);
      return res.status(404).json({ message: "Team not found" });
    }

    // Ensure only the team owner can upload the photo
    if (team.owner.toString() !== req.user.id) {
      console.log("Unauthorized access. User ID:", req.user.id, "Team owner ID:", team.owner);
      return res.status(403).json({ message: "You are not authorized to update this team" });
    }

    // Log file upload details
    console.log("Uploaded file details:", req.file);

    // Update the team's photo field with the uploaded file's path
    if (!req.file) {
      console.log("Error: No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    team.photo = req.file.path;
    await team.save();

    console.log("Photo uploaded successfully. Updated team photo path:", req.file.path);

    res.status(200).json({
      message: "Team photo updated successfully",
      photo: req.file.path,
    });
  } catch (error) {
    console.error("Error uploading team photo:", error);
    res.status(500).json({ message: "Error uploading team photo", error: error.message });
  }
});

module.exports = router;
