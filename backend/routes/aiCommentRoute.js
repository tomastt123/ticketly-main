const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');

const COHERE_API_URL = "https://api.cohere.ai/generate";


router.post('/generate-comment', authMiddleware, async (req, res) => {
  const { projectDescription, bugDescription, existingComments, projectName } = req.body;

  if (!bugDescription) {
    return res.status(400).json({ error: "Bug description is required." });
  }

  const commentText = Array.isArray(existingComments)
    ? existingComments.map(c => c.text).join(', ')
    : "No comments yet.";

    const prompt = `
    Project: "${projectName}"
    Description: "${projectDescription}"
    Bug: "${bugDescription}"
    Existing Comments: "${existingComments.map(c => c.text).join(', ')}"
    Response: Provide a helpful debugging comment.
  `;


  try {
    const response = await axios.post(
      COHERE_API_URL,
      { model: "command", prompt },
      { headers: { Authorization: `Bearer ${process.env.COHERE_API_KEY}` } }
    );

    console.log("Cohere API Response:", response.data);
    const generatedComment = response.data.text || "No comment generated.";
    res.status(200).json({ comment: generatedComment });
  } catch (error) {
    console.error("Error generating comment:", error.message);
    res.status(500).json({ error: "Failed to generate comment." });
  }
});


module.exports = router;
