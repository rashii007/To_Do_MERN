const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getDashBoard } = require("../controller/dashBoard.controller");

const dasBoardRouter = express.Router();

dasBoardRouter.get("/", authMiddleware, getDashBoard);

module.exports = dasBoardRouter;
