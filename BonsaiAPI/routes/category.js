const express = require("express");
const Category = require("../models/categoryModel");

const router = express.Router();

// Lấy danh sách Category
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({
        status: true,
        message: "Lấy danh sách Category thành công!",
        categories,
      });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
