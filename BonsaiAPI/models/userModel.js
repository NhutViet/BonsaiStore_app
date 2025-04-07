const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: false },
  password: { type: String, required: false },
  avata: { type: String, default: "" },
  address: { type: String, default: "" },
  googleId: { type: String, unique: true, sparse: true },
  loginMethod: { type: String, enum: ["google", "email"], default: "email" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
