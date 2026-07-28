const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controller/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");


const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", authMiddleware,logoutUser);

module.exports = userRouter;
