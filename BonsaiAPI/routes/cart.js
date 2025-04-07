const express = require("express");
const Cart = require("../models/cartModel"); // Import model Cart
const router = express.Router();

// http://localhost:3000/cart/{idUser}
// 📌 1️⃣ Lấy giỏ hàng theo userId
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId"
    );
    if (!cart)
      return res.status(404).json({ status: true, message: "Giỏ hàng trống" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API thêm 1 hoặc nhiều sản phẩm vào giỏ hàng http://localhost:3000/cart/add
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  console.log("📩 Dữ liệu nhận được từ client:", req.body);

  try {
    if (!userId || !productId || !quantity) {
      throw new Error("Thiếu userId, productId hoặc quantity");
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    console.log("✅ Giỏ hàng sau khi thêm:", cart);
    res.json({ status: true, message: "Thêm vào giỏ hàng thành công", cart });
  } catch (error) {
    console.error("❌ Lỗi chi tiết:", error); // Log lỗi chi tiết
    res.status(500).json({ error: error.message });
  }
});

// 📌 3️⃣ Xóa sản phẩm khỏi giỏ hàng http://localhost:3000/cart/{idUser}/{idProduct}
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!cart)
      return res
        .status(404)
        .json({ status: true, message: "Không tìm thấy giỏ hàng" });

    res.json({ message: "Xóa sản phẩm thành công", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 4️⃣ Cập nhật số lượng sản phẩm http://localhost:3000/cart/update
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });

    item.quantity = quantity;
    await cart.save();

    res.json({ status: true, message: "Cập nhật số lượng thành công", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
