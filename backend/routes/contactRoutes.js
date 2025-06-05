const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// POST endpoint for handling contact form submissions
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // Change if using another email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender info
      to: "tomas.tvarijonavicius@gmail.com", // Your email
      subject: `New Message from ${name}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
});

module.exports = router;
