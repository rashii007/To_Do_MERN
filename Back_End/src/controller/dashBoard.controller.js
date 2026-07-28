const todoModel = require("../models/todo.model");

exports.getDashBoard = async (req, res) => {
    
  const userId = req.user._id; // ya req.user.id

  const todos = await todoModel.find({ user: userId });

  const total = await todos.length;

  const completed = todos.filter((todo) => todo.completed).length;

  const pending = total - completed;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const recentTodos = todos
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  res.status(200).json({
    success: true,
    dashboard: {
      total,
      completed,
      pending,
      progress,
      recentTodos,
    },
  });
};
