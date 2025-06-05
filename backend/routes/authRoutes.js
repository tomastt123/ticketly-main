const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Your User model
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google ID Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, given_name: name, family_name: surname, sub: googleId } = ticket.getPayload();

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Register new user if not found
            user = new User({ email, name, googleId });
            await user.save();
        }

        // Generate JWT token for authentication
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token: jwtToken });
    } catch (error) {
        console.error("Error verifying Google token:", error);
        res.status(401).json({ message: "Invalid Google token" });
    }
});

module.exports = router;
