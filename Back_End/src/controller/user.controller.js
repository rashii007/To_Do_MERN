// server/controllers/auth.controller.js
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ============ REGISTER ============
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({
      $or: [{ name }, { email }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hash,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token);

    // ✅ FIX: _id include karein response mein
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: user._id, // ✅ YAHAN _id DAALO
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ LOGIN ============
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ FIX: _id include karein response mein
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        _id: user._id, // ✅ YAHAN _id DAALO
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ LOGOUT ============
exports.logoutUser = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
