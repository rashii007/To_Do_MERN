import { useEffect, useState, useContext } from "react";

import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authApi";
import ThemeButton from "../components/ThemeButton";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoApi";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Logout Clicked");

    try {
      const res = await logoutUser();
      console.log(res);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const [todos, setTodos] = useState([]);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // Fetch Todos
  const fetchTodos = async () => {
    try {
      const res = await getTodos();

      console.log("API Response:", res.data);

      setTodos(res.data.todos || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add Todo
  const addTodo = async (data) => {
    try {
      await createTodo(data);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  // Complete / Pending
  const handleUpdateTodo = async (id) => {
    try {
      const todo = todos.find((item) => item._id === id);

      await updateTodo(id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });

      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete
  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              MERN Todo App
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your daily tasks efficiently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeButton />

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg bg-red-500 cursor-pointer hover:bg-red-600 text-white transition"
            >
              Logout
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Form */}
        <TodoForm addTodo={addTodo} />

        {/* List */}
        <div className="mt-8">
          <TodoList
            todos={todos}
            removeTodo={removeTodo}
            updateTodo={handleUpdateTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
