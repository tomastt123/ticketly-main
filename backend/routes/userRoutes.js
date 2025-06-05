const express = require("express");
const {
  registerUser,
  loginUser,
  verifyTokenDebug,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  getOtherUserProfile,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Verify token route (for debugging purposes)
router.post("/verify-token", verifyTokenDebug);

// Logout route
router.post("/logout", logoutUser);

// Get user profile
router.get("/profile", authenticate, getUserProfile);

// Update user profile
router.put("/profile", authenticate, updateUserProfile);

// Upload profile picture
router.post("/profile-photo", authenticate, upload.single("photo"), uploadProfilePhoto);

// get other user profile
router.get("/:id/profile", authenticate, getOtherUserProfile);


module.exports = router;
