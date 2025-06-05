const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const upload = require("./middleware/uploadMiddleware");
const path = require("path");

// Load environment variables
dotenv.config();

console.log("JWT Secret from .env:", process.env.JWT_SECRET);

const app = express();

// Define the base URL
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// CORS setup
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://localhost:5000", // Local backend
  "https://ticketly-backend.onrender.com", // Backend
  "https://ticketly-frontend.vercel.app", // Frontend (no trailing slash)
  "https://ticketly.uk", // Deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests explicitly

// Middleware
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Upload endpoint
app.post("/api/upload", upload.single("bugImage"), (req, res) => {
  console.log("📸 Upload request received");

  if (!req.file) {
    console.error("❌ No file uploaded!");
    return res.status(400).json({ message: "No file uploaded!" });
  }

  console.log("✅ File uploaded:", req.file.filename);

  res.status(200).json({
    message: "File uploaded successfully!",
    image: `/uploads/${req.file.filename}`, // ✅ Make sure 'image' key is returned
  });
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Importing routes
const bugRoutes = require("./routes/bugRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const aiCommentRoute = require("./routes/aiCommentRoute");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ai", aiCommentRoute);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Health check endpoints
app.get("/", (req, res) => {
  res.send("Bug Tracking System Backend is running!");
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
