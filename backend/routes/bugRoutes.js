const express = require("express");
const Bug = require("../models/Bug");
const authenticate = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// ✅ Delete Bug
router.delete("/:bugId", authenticate, async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.bugId);
    res.json({ message: "Bug deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bug" });
  }
});

// ✅ Upload Image to Bug
router.post("/:bugId/upload", authenticate, upload.single("bugImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const bug = await Bug.findById(req.params.bugId);
    if (!bug) return res.status(404).json({ error: "Bug not found" });
    
    // Initialize images array if it doesn't exist
    if (!bug.images) {
      bug.images = [];
    }
    
    // Check if there are already 5 images
    if (bug.images.length >= 5) {
      return res.status(400).json({ error: "Maximum of 5 images reached for this bug." });
    }
    
    const newImagePath = `/uploads/${req.file.filename}`;
    bug.images.push(newImagePath);
    await bug.save();
    
    res.json({
      message: "Image uploaded successfully",
      filePath: newImagePath,
      images: bug.images
    });
  } catch (error) {
    console.error("Error uploading bug image:", error);
    res.status(500).json({ error: "Failed to upload image", details: error.message });
  }
});



// ✅ Update Bug (Title/Description)
router.put("/:bugId", authenticate, async (req, res) => {
  try {
    const { bugId } = req.params;
    const { title, description } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const updatedBug = await Bug.findByIdAndUpdate(
      bugId,
      { title, description },
      { new: true, runValidators: true }
    ).populate("createdBy", "name surname");

    if (!updatedBug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.status(200).json(updatedBug);
  } catch (error) {
    console.error("Error updating bug:", error);
    res.status(500).json({ message: "Error updating bug", error: error.message });
  }
});

// ✅ Edit Comment
router.put("/:bugId/comments/:commentId", authenticate, async (req, res) => {
  try {
    const { bugId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Find the bug
    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    // Find the comment inside the bug
    const comment = bug.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update comment text
    comment.text = text;
    await bug.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
});


// ✅ Upload Image to Comment
router.post("/:bugId/comments/:commentId/upload", authenticate, upload.single("commentImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Find the bug document
    const bug = await Bug.findById(req.params.bugId);
    if (!bug) return res.status(404).json({ error: "Bug not found" });

    // Find the comment (embedded in bug)
    const comment = bug.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Initialize images array on comment if needed
    if (!comment.images) {
      comment.images = [];
    }
    if (comment.images.length >= 5) {
      return res.status(400).json({ error: "Maximum of 5 images reached for this comment." });
    }

    // Append new image path
    comment.images.push(`/uploads/${req.file.filename}`);
    await bug.save();

    res.json({ 
      message: "Image uploaded successfully", 
      filePath: `/uploads/${req.file.filename}`,
      images: comment.images 
    });
  } catch (error) {
    console.error("❌ Error uploading comment image:", error);
    res.status(500).json({ error: "Failed to upload image", details: error.message });
  }
});

// DELETE a bug image by filePath
router.delete("/:bugId/images", authenticate, async (req, res) => {
  try {
    const { bugId } = req.params;
    const { filePath } = req.body; // expects filePath like "/uploads/filename.jpg"
    
    const bug = await Bug.findById(bugId);
    if (!bug) return res.status(404).json({ error: "Bug not found" });
    
    // Remove the image from the images array
    bug.images = bug.images.filter((img) => img !== filePath);
    
    await bug.save();
    
    // Optionally, delete the file from the filesystem (requires Node's fs and path)
    // const fs = require("fs");
    // const fullPath = path.join(__dirname, "..", filePath);
    // fs.unlink(fullPath, (err) => {
    //   if (err) console.error("Failed to delete file:", err);
    // });
    
    res.json({ message: "Bug image deleted successfully", images: bug.images });
  } catch (error) {
    console.error("Error deleting bug image:", error);
    res.status(500).json({ error: "Failed to delete image", details: error.message });
  }
});

// DELETE a comment image by filePath
router.delete("/:bugId/comments/:commentId/images", authenticate, async (req, res) => {
  try {
    const { bugId, commentId } = req.params;
    const { filePath } = req.body; // expects filePath like "/uploads/filename.jpg"
    
    const bug = await Bug.findById(bugId);
    if (!bug) return res.status(404).json({ error: "Bug not found" });
    
    // Find the comment (embedded in bug)
    const comment = bug.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    
    // Remove the image from the comment's images array
    if (!comment.images) comment.images = [];
    comment.images = comment.images.filter((img) => img !== filePath);
    
    await bug.save();
    
    res.json({ message: "Comment image deleted successfully", images: comment.images });
  } catch (error) {
    console.error("Error deleting comment image:", error);
    res.status(500).json({ error: "Failed to delete image", details: error.message });
  }
});


// Get all bugs or filter by project ID
router.get("/", authenticate, async (req, res) => {
  const { project } = req.query; // Extract the `project` query parameter
  try {
    const query = project ? { project } : {}; // If `project` is provided, filter by it
    const bugs = await Bug.find(query)
      .populate("assignedTo", "name email") // Populate assignedTo with user name and email
      .populate("createdBy", "name surname") // Populate createdBy with user name and email
      .populate("comments.author", "name email");
    res.status(200).json(bugs); // Return filtered or all bugs
  } catch (error) {
    console.error("Error fetching bugs:", error);
    res.status(500).json({ message: "Error fetching bugs", error: error.message });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id).populate("assignedTo createdBy", "name email");
    if (!bug) return res.status(404).json({ message: "Bug not found" });

    res.status(200).json(bug);
  } catch (error) {
    console.error("Error fetching bug:", error);
    res.status(500).json({ message: "Error fetching bug", error: error.message });
  }
});

// Get a bug by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id).populate("assignedTo createdBy", "name email");
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }
    res.status(200).json(bug);
  } catch (error) {
    console.error("Error fetching bug:", error);
    res.status(500).json({ message: "Error fetching bug", error: error.message });
  }
});

// Create a new bug
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, priority, status, project, assignedTo } = req.body;

    if (!title || !description || !priority || !status || !project) {
      return res.status(400).json({ message: "All fields except AssignedTo are required" });
    }

    const bug = new Bug({
      title,
      description,
      priority,
      status,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    const savedBug = await bug.save();

    const populatedBug = await Bug.findById(savedBug._id).populate("createdBy", "name surname");

    res.status(201).json(populatedBug);
  } catch (error) {
    console.error("Error creating bug:", error);
    res.status(500).json({ message: "Error creating bug", error: error.message });
  }
});

// Add a comment to a bug
router.post("/:id/comments", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const bug = await Bug.findById(id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const comment = { text, author: req.user.id };
    bug.comments.push(comment);
    await bug.save();

    const populatedBug = await Bug.findById(id).populate("comments.author", "name email");

    res.status(201).json(populatedBug.comments.pop());
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
});

// Get all comments for a bug
router.get("/:id/comments", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const bug = await Bug.findById(id).populate("comments.author", "name email");
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.status(200).json(bug.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
});


// Update a comment on a bug
router.put("/:bugId/comments/:commentId", authenticate, async (req, res) => {
  try {
    const { bugId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const comment = bug.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.text = text; // Update the comment text
    await bug.save();

    const updatedComment = await Bug.findById(bugId)
      .select("comments")
      .populate("comments.author", "name email");
  

    res.status(200).json(updatedComment.comments.id(commentId));
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
});

// DELETE a comment from a bug (for embedded comments)
router.delete("/:bugId/comments/:commentId", authenticate, async (req, res) => {
  try {
    const { bugId, commentId } = req.params;
    console.log(`Attempting to delete comment ${commentId} from bug ${bugId}`);

    // Find the bug document
    const bug = await Bug.findById(bugId);
    if (!bug) {
      console.error("❌ Bug not found");
      return res.status(404).json({ message: "Bug not found" });
    }

    // Find the index of the comment in the bug.comments array
    const commentIndex = bug.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      console.error("❌ Comment not found inside bug");
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove the comment from the array using splice
    bug.comments.splice(commentIndex, 1);

    // Save the updated bug document
    await bug.save();

    console.log(`✅ Comment ${commentId} deleted successfully`);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error.stack);
    res.status(500).json({ error: "Failed to delete comment", details: error.message });
  }
});

module.exports = router;
