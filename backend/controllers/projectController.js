const Project = require("../models/Project");
const Team = require("../models/Team");

const createProject = async (req, res) => {
  try {
    const { name, description, team, priority } = req.body;
    const createdBy = req.user.id;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required." });
    }

    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return res.status(404).json({ message: "Team not found." });
      }
    }

    const project = new Project({
      name,
      description,
      createdBy,
      team: team || null,
      status: "Open",
      priority: priority || "Low",
    });

    const savedProject = await project.save();
    res.status(201).json({ message: "Project created successfully", project: savedProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const { teamId } = req.query;
    const userId = req.user.id;

    console.log("Team ID received:", teamId);
    console.log("User ID from token:", userId);

    let query = {};

    if (teamId) {
      // If a specific team ID is provided, fetch projects for that team
      query.team = teamId;
    } else {
      // If no team ID is provided, find all teams the user belongs to
      const teams = await Team.find({ "members.user": userId }).select("_id");
      const teamIds = teams.map((team) => team._id);

      if (teamIds.length > 0) {
        // Only include projects from teams the user belongs to
        query.team = { $in: teamIds };
      } else {
        // If the user is not in any teams, return an empty result
        return res.status(200).json([]);
      }
    }

    const projects = await Project.find(query)
      .populate({
        path: "team",
        populate: { path: "members.user", select: "name email" },
      })
      .populate("createdBy", "name email");

    console.log("Filtered projects returned:", projects);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("team", "name description");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};



// Update a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this project." });
    }

    const { name, description, team } = req.body;

    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return res.status(404).json({ message: "Team not found." });
      }
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.team = team || project.team;

    const updatedProject = await project.save();
    res.status(200).json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};


//update projecty status
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //validate status
    const validStatuses = ["Open", "In Progress", "Paused", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = status;
    const updatedProject = await project.save();

    res.status(200).json({ message: "Project status updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ message: "Error updating project status", error: error.message });
  }
};

//update projecty priority
const updateProjectPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    //validate priority
    const validPriorities = ["Low", "Medium", "High"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.priority = priority;
    const updatedProject = await project.save();

    res.status(200).json({ message: "Project priority updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error updating project priority:", error);
    res.status(500).json({ message: "Error updating project priority", error: error.message });
  }
};


// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

// Update project color
const updateProjectColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.body;

    if (!color || typeof color !== "string") {
      return res.status(400).json({ message: "Invalid or missing color value" });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { color },
      { new: true } // Return the updated project
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Color updated successfully", project });
  } catch (error) {
    console.error("Error updating project color:", error);
    res.status(500).json({ message: "Error updating project color", error: error.message });
  }
};

// Get aggregated project status counts
const getProjectStatusSummary = async (req, res) => {
  try {
    // Aggregation to count projects by status
    const statusSummary = await Project.aggregate([
      {
        $group: {
          _id: "$status", // Group by status field
          count: { $sum: 1 }, // Count the number of projects per status
        }
      },
      {
        $project: {
          name: "$_id", // Set "name" to be the status
          value: "$count", // Set "value" to be the count
          _id: 0, // Exclude _id
        }
      }
    ]);

    res.status(200).json(statusSummary);
  } catch (error) {
    console.error("Error fetching project status summary:", error);
    res.status(500).json({ message: "Error fetching project status summary", error: error.message });
  }
};

const getProjectPrioritySummary = async (req, res) => {
  try {
    const projectPriorities = await Project.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0,
        },
      },
    ]);

    res.status(200).json(projectPriorities);
  } catch (error) {
    console.error("Error fetching project priority summary:", error);
    res.status(500).json({ message: "Error fetching project priority summary", error: error.message });
  }
};

const getProjectCountByTeam = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: "$team",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "teams",
          localField: "_id",
          foreignField: "_id",
          as: "team"
        }
      },
      {
        $project: {
          name: {
            $ifNull: [{ $arrayElemAt: ["$team.name", 0] }, "Unassigned"]
          },
          value: "$count"
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error("Error counting projects by team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectColor,
  updateProjectPriority,
  getProjectStatusSummary,
  getProjectPrioritySummary,
  getProjectCountByTeam,
};
