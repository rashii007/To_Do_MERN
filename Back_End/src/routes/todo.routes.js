const express = require("express");
const {
  createTodo,
  getAllTodo,
  updateTodoById,
  deleteTodo,
} = require("../controller/todo.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");


const todoRouter = express.Router();

todoRouter.post("/create", authMiddleware,createTodo);
todoRouter.get("/get", authMiddleware,getAllTodo);
todoRouter.put("/update/:id", authMiddleware,updateTodoById);
todoRouter.delete("/delete/:id", authMiddleware,deleteTodo);

module.exports = todoRouter;
