const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not found.",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    req.user = user; // 👈 Ye sabse important line hai

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
