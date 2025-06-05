const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["Admin", "Member"], default: "Member" },
      },
    ],
    photo: { type: String },
  },
  { timestamps: true }
);

// Middleware to update the user's teams array when the team is saved
TeamSchema.pre("save", async function (next) {
  const team = this;

  try {
    const memberIds = team.members.map((member) => member.user);

    // Update each user's teams array
    for (const userId of memberIds) {
      await mongoose.model("User").findByIdAndUpdate(
        userId,
        { $addToSet: { teams: team._id } }, // Add the team ID if it isn't already present
        { new: true }
      );
    }

    next();
  } catch (err) {
    console.error("Error updating user's teams field:", err);
    next(err);
  }
});

// Middleware to remove the team's reference from users when the team is deleted
TeamSchema.pre("remove", async function (next) {
  const team = this;

  try {
    const memberIds = team.members.map((member) => member.user);

    // Update each user's teams array
    for (const userId of memberIds) {
      await mongoose.model("User").findByIdAndUpdate(
        userId,
        { $pull: { teams: team._id } },
        { new: true }
      );
    }

    next();
  } catch (err) {
    console.error("Error removing team's reference from user's teams field:", err);
    next(err);
  }
});

module.exports = mongoose.model("Team", TeamSchema);
