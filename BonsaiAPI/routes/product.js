const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const removeAccents = require("remove-accents");
const router = express.Router();

// Lấy tất cả sản phẩm (chỉ lấy ID của category)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "categoryId",
      select: "_id",
      transform: (doc) => doc?._id, // Lấy trực tiếp ID thay vì object
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API lấy danh sách sản phẩm theo danh mục
router.get("/categories", async (req, res) => {
  try {
    const { categoryId } = req.query;
    let products;

    if (!categoryId || categoryId === "67d310d437f14339142107b0") {
      // Lấy tất cả sản phẩm nếu không có categoryId hoặc categoryId là "all"
      products = await Product.find();
    } else {
      // Lấy sản phẩm theo categoryId
      products = await Product.find({ categoryId });
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Lấy danh sách sản phẩm theo type   http://localhost:3000/products/type?type=plant or utensils
router.get("/type", async (req, res) => {
  try {
    const { type } = req.query; // Lấy tham số từ query

    // Tạo bộ lọc tìm kiếm
    const filter = type ? { type } : {};

    // Lấy danh sách sản phẩm từ database
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
});

// Lấy sản phẩm theo categoryId  http://localhost:3000/products/products?categoryId=67d3112537f14339142107b3
router.get("/products", async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({ message: "Thiếu categoryId" });
    }

    // Kiểm tra định dạng ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Truy vấn sản phẩm theo categoryId
    const products = await Product.find({ categoryId: categoryId });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm theo loại" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API tìm kiếm sản phẩm  http://localhost:3000/products/search?keyword=cây
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" });
    }

    // Chuẩn hóa từ khóa tìm kiếm (loại bỏ dấu)
    const normalizedKeyword = removeAccents(keyword.trim()).toLowerCase();

    // Tìm kiếm trong database
    const products = await Product.find();

    // Lọc sản phẩm theo tên hoặc mô tả đã chuẩn hóa
    const filteredProducts = products.filter((product) => {
      if (!product.namePR || !product.description) return false; // Kiểm tra dữ liệu tránh lỗi

      const normalizedName = removeAccents(product.namePR.trim()).toLowerCase();
      const normalizedDescription = removeAccents(
        product.description.trim()
      ).toLowerCase();

      return (
        normalizedName.includes(normalizedKeyword) ||
        normalizedDescription.includes(normalizedKeyword)
      );
    });

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Lỗi API Search:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm", error });
  }
});

// API: Lấy chi tiết sản phẩm theo ID
router.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm theo ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "false",
        message: "Không tìm thấy sản phẩm!",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Lấy chi tiết sản phẩm thành công!",
      product,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    res.status(500).json({
      status: "false",
      message: "Lỗi server khi lấy chi tiết sản phẩm!",
    });
  }
});
module.exports = router;

// Định tuyến cho danh sách sản phẩm
router.get("/", getProducts);

module.exports = router;
