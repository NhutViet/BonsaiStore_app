const express = require("express");
const Bank = require("../models/manageBank"); // Import model Cart
const router = express.Router();

// Tạo tài khoản ngân hàng mới http://localhost:3000/manageBank/AddBank
router.post("/AddBank", async (req, res) => {
  try {
    const newBank = new Bank(req.body);
    const savedBank = await newBank.save();
    res.status(201).json({
      status: true,
      message: "Thêm tài khoản ngân hàng thành công",
      savedBank,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách tài khoản ngân hàng của user http://localhost:3000/manageBank/bank/{idUser}
router.get("/bank/:userId", async (req, res) => {
  try {
    const banks = await Bank.find({ userId: req.params.userId });
    res.status(200).json({ status: true, banks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật thông tin tài khoản ngân hàng
router.put("/UpdateBank/:id", async (req, res) => {
  try {
    const updatedBank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ status: true, message: "Sửa thành công", updatedBank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa tài khoản ngân hàng http://localhost:3000/manageBank/RemoveBank/id
router.delete("/RemoveBank/:id", async (req, res) => {
  try {
    await Bank.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa tài khoản ngân hàng thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy chi tiết tài khoản ngân hàng theo ID
router.get("/bankID/:bankId", async (req, res) => {
  try {
    const { bankId } = req.params;
    const bank = await Bank.findById(bankId);

    if (!bank) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản ngân hàng" });
    }

    res.status(200).json({
      status: true,
      message: "Lấy Thông tin Card Bank thành công",
      bank,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
