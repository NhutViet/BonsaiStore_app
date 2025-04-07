const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    bankName: { type: String, required: true },
    branch: { type: String, required: false },
    accountNumber: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    idCardNumber: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("manageBank", BankSchema);
