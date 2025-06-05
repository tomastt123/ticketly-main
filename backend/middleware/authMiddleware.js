const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization"); // Get token from "Authorization: Bearer TOKEN"
  
  // Debug: Log Authorization header
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug: Log decoded token
    console.log("Decoded Token:", decoded);

    req.user = decoded; // Add user data to the request object
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authenticate;
