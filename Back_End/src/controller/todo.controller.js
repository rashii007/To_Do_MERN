const todoModel = require("../models/todo.model");

exports.createTodo = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const titleExists = await todoModel.findOne({ title, user: req.user._id });

    if (titleExists) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }

    const todo = await todoModel.create({
      title,
      description,
      priority,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllTodo = async (req, res) => {
  try {
    const todo = await todoModel.find({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      totaltodo: todo.length,
      todos: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTodoById = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority } = req.body;

  const todo = await todoModel.findByIdAndUpdate(
    id,
    {
      title,
      description,
      completed,
      priority,
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    success: true,
    message: "Todo Updated & Completed",
  });
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  const todo = await todoModel.findByIdAndDelete(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
};
