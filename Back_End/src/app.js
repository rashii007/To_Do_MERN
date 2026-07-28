const express = require("express");
const router = require("./routes/todo.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const dashBoardRouter = require("./routes/dashBoard.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/todo", router);
app.use("/api/auth", userRouter);
app.use("/api/dashboard", dashBoardRouter);

module.exports = app;
