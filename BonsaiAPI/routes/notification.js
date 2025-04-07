// routes/notification.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/NotificationModel");

// 📌 Tạo thông báo mới (sau khi đặt hàng thành công)
router.post("/create", async (req, res) => {
  try {
    const { userId, title, message, orderId } = req.body;

    const newNotification = new Notification({
      userId,
      title,
      message,
      orderId,
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Đã tạo thông báo thành công!",
      data: newNotification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
});

// 📌 Lấy tất cả thông báo của 1 user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
});

// 📌 Đánh dấu đã đọc
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu đã đọc",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
});

module.exports = router;
