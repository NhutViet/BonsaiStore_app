const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const Cart = require("../models/cartModel");
const Notification = require("../models/NotificationModel");

// API thanh toán
router.post("/checkout", async (req, res) => {
  try {
    const {
      userId,
      cartId,
      address,
      phoneNumber,
      shippingMethod,
      paymentMethod,
      total,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !userId ||
      !cartId ||
      !address ||
      !phoneNumber ||
      !shippingMethod ||
      !paymentMethod ||
      !total
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Vui lòng điền đầy đủ thông tin!" });
    }

    // Lấy giỏ hàng từ CartId
    const cart = await Cart.findById(cartId).populate("items.productId");
    if (!cart) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy giỏ hàng!" });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      cartId,
      items: cart.items,
      address,
      phoneNumber,
      shippingMethod,
      paymentMethod,
      total,
      status: "pending", // Mặc định chờ xác nhận
    });

    // Lưu đơn hàng vào database
    await newOrder.save();

    // Tạo thông báo sau khi thanh toán thành công
    const notification = new Notification({
      userId,
      title: "Thanh toán thành công",
      message: `Đơn hàng #${
        newOrder._id
      } của bạn đã được đặt thành công vào lúc ${new Date().toLocaleString()}`,
      total: total.toLocaleString(),
    });
    await notification.save();
    console.log("Thông báo thanh toán thành công đã được tạo:", notification);

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({
      status: true,
      message: "Đặt hàng thành công!",
      order: newOrder,
      notification: {
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ status: false, message: "Lỗi máy chủ!" });
  }
});

// routes/orders.js (đã có từ trước)
router.get("/history/:userId", async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Lấy danh sách đơn hàng của người dùng
    const orders = await Order.find({ userId: requestedUserId })
      .populate("items.productId") // Populate thông tin sản phẩm
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments({ userId: requestedUserId });

    res.status(200).json({
      status: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi máy chủ!",
      error: error.message || error,
    });
  }
});

module.exports = router;
