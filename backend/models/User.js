const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true},
  phone: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String, unique: true, sparse: true }, 
  role: { type: String, enum: ["Admin", "User"], default: "User" }, 
  profilePhoto: { type: String },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});

// Pre-save middleware to hash passwords if they are being set or modified
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed in pre-save middleware:", this.password);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
