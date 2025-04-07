require("dotenv").config();

const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();
const client = new OAuth2Client(
  "141046510402-4hnpiguf0fim3t4aaubrpsk7vqn1h594.apps.googleusercontent.com"
);

// Danh sách các Client ID cho các nền tảng khác nhau
const GOOGLE_CLIENT_IDS = [
  process.env.GOOGLE_CLIENT_ID_WEB, // Web Client ID
  process.env.GOOGLE_CLIENT_ID_IOS, // iOS Client ID
  process.env.GOOGLE_CLIENT_ID_ANDROID, // Android Client ID
].filter(Boolean); // Loại bỏ các giá trị undefined

// Đăng ký http://localhost:3000/users/register
router.post("/register", async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    password,
    avata = "",
    address = "",
  } = req.body;
  console.log("Dữ liệu nhận được:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "false", message: "Email đã tồn tại!" });
    }

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password,
      avata,
      address,
    });

    await newUser.save();
    console.log("Người dùng mới đã được tạo:", newUser);

    return res
      .status(201)
      .json({ status: "true", message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error); // In chi tiết lỗi ra console
    return res.status(500).json({ status: "false", message: "Lỗi server!" });
  }
});

// Đăng nhập uhttp://localhost:3000/sers/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Dữ liệu nhận được:", { email, password });

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Thiếu email hoặc password!",
    });
  }

  try {
    const user = await User.findOne({ email, loginMethod: "email" });
    console.log("Người dùng tìm thấy:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không đúng!",
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error("SECRET_KEY không được định nghĩa!");
      return res.status(500).json({
        success: false,
        message: "Lỗi server!",
        error: "SECRET_KEY không được định nghĩa!",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avata: user.avata,
        password: user.password,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message || error,
    });
  }
});

// API lấy thông tin người dùng qua ID http://localhost:3000/users/user/${userId}`
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Lấy ID từ URL
    const user = await User.findById(userId); // Tìm người dùng theo ID

    if (!user) {
      return res.status(404).json({
        status: "false",
        message: "Không tìm thấy người dùng!",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Lấy thông tin người dùng thành công!",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    res.status(500).json({
      status: "false",
      message: "Lỗi server!",
    });
  }
});

// API cập nhật thông tin người dùng http://localhost:3000/users/update/{id}
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phoneNumber, password, avata, address } = req.body;

  try {
    // Tìm và cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, email, phoneNumber, password, avata, address },
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật thành công!",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật!", error: error.message });
  }
});

// API đăng nhập Google
router.post("/googleLogin", async (req, res) => {
  const { googleAccessToken } = req.body;

  if (!googleAccessToken) {
    return res.status(400).json({
      success: false,
      message: "Thiếu googleAccessToken!",
    });
  }

  try {
    // Xác thực idToken với Google
    const ticket = await client.verifyIdToken({
      idToken: googleAccessToken,
      audience: GOOGLE_CLIENT_IDS, // Hỗ trợ nhiều Client ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Không lấy được payload từ Google!",
      });
    }

    const { email, name, picture, sub: googleId } = payload;

    // Kiểm tra email trùng lặp
    const existingUser = await User.findOne({ email, loginMethod: "email" });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email đã được sử dụng. Vui lòng liên kết tài khoản Google với tài khoản hiện có.",
      });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        email,
        fullName: name,
        avata: picture,
        loginMethod: "google",
      });
      await user.save();
      console.log("Người dùng mới từ Google đã được lưu:", user);
    } else {
      user.fullName = name;
      user.avata = picture;
      await user.save();
      console.log("Thông tin người dùng Google đã được cập nhật:", user);
    }

    // Kiểm tra JWT_SECRET_KEY
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY không được định nghĩa!");
      return res.status(500).json({
        success: false,
        message: "Lỗi server!",
        error: "JWT_SECRET_KEY không được định nghĩa!",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY, // Sử dụng JWT_SECRET_KEY
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập bằng Google thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avata: user.avata,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error.message || error);
    res.status(400).json({
      success: false,
      message: error.message || "Đăng nhập bằng Google thất bại",
    });
  }
});
module.exports = router;
