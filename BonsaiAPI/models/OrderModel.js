const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    shippingMethod: { type: String, required: true }, // VD: "Fast", "COD"
    paymentMethod: { type: String, required: true }, // VD: "MOMO", "COD", "Bank Transfer"
    total: { type: Number, required: true },
    status: { type: String, default: "pending" }, // Trạng thái đơn hàng
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
