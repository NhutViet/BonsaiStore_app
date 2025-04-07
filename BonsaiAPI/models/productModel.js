const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  namePR: { type: String, required: true },
  pricePR: { type: Number, required: true },
  description: { type: String },
  imagePR: { type: String },
  traitPR: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  quantity: { type: Number, default: 0 },
  type: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
