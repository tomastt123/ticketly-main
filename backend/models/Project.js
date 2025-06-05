const mongoose = require("mongoose");

const Projectschema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Open", "In Progress", "Closed", "Paused"], default: "Open" },
    color: { type: String, default: "#ffffff" },
}, { timestamps: true });

module.exports = mongoose.model("Project", Projectschema);