const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    console.log("Raw password:", password);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Save the user to the database (pre-save middleware will hash the password)
    const newUser = new User({ name, surname, email, password });
    const savedUser = await newUser.save();
    console.log("User registered successfully:", savedUser);

    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request received for email:", email);
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Password entered by user:", password); // Log plain password
    console.log("Stored hashed password from database:", user.password); // Log hashed password

    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("bcrypt.compare result:", isMatch); // Log result of password comparison

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT if passwords match
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful. Token generated:", token);
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


// Verify Token Debug
const verifyTokenDebug = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log decoded token
    res.json({ message: "Token is valid", decoded });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(400).json({ message: "Invalid token", error: error.message });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name surname email phone profilePhoto teams")
      .populate({
        path: "teams",
        select: "name surname description members",
        populate: {
          path: "members.user",
          select: "name surname email",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct the full photo URL dynamically
    const profilePhotoUrl = user.profilePhoto
      ? `${process.env.BASE_URL}/${user.profilePhoto.replace(/\\/g, "/")}`
      : null;

    res.status(200).json({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      profilePhoto: profilePhotoUrl, // Use the dynamically constructed URL
      teams: user.teams,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, surname, email, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields
    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();
    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upload profile photo
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const uploadProfilePhoto = async (req, res) => {
  try {
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadPath = `uploads/${filename}`;
    const outputPath = path.join(__dirname, "..", uploadPath);

    console.log("Generated File Path:", uploadPath);

    // Resize and save the image using Sharp
    await sharp(req.file.path)
      .resize(150, 150) // Set the desired dimensions
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Remove the original uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting original file:", err);
        } else {
          console.log("Original file deleted successfully.");
        }
      });
    }

    // Update the user's profile with the relative path
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: uploadPath }, // Only store the relative path
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile photo updated successfully",
      profilePhoto: uploadPath, // Return the relative path
    });
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getOtherUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select("name surname email phone profilePhoto teams")
      .populate({
        path: "teams",
        select: "name description members",
        populate: {
          path: "members.user",
          select: "name surname email",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profilePhotoUrl = user.profilePhoto
      ? `${process.env.BASE_URL}/${user.profilePhoto.replace(/\\/g, "/")}`
      : null;

    res.status(200).json({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      profilePhoto: profilePhotoUrl,
      teams: user.teams,
    });
  } catch (err) {
    console.error("Error fetching other user's profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Exporting all controller functions
module.exports = {
  registerUser,
  loginUser,
  verifyTokenDebug,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  getOtherUserProfile,
};
