// components/TodoForm.jsx
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  Plus,
  Sparkles,
  AlertCircle,
  Flag,
  AlertTriangle,
  Circle,
  BarChart3,
} from "lucide-react";

const TodoForm = ({ addTodo }) => {
  const { darkMode } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const priorityOptions = [
    { value: "low", label: "Low Priority", icon: Circle, color: "green" },
    {
      value: "medium",
      label: "Medium Priority",
      icon: BarChart3,
      color: "yellow",
    },
    {
      value: "high",
      label: "High Priority",
      icon: AlertTriangle,
      color: "red",
    },
    { value: "urgent", label: "🔥 Urgent", icon: Flag, color: "purple" },
  ];

  // components/TodoForm.jsx
  const submitHandler = (e) => {
    e.preventDefault();

    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill all fields");
      return;
    }

    // ✅ Get user from localStorage with better error handling
    let user = null;
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        user = JSON.parse(userData);
        console.log("User data:", user); // ✅ Debug log
      }
    } catch (err) {
      console.error("Error parsing user:", err);
      setError("Session error. Please login again.");
      return;
    }

    // ✅ Check if user exists and has _id
    if (!user) {
      setError("Please login to create todos");
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    if (!user._id) {
      console.error("User object:", user);
      setError("User ID not found. Please login again.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 20000);
      return;
    }

    // ✅ Send data to backend
    addTodo({
      title: title.trim(),
      description: description.trim(),
      priority: priority,
      createdBy: user._id, // ✅ Backend expects "createdBy"
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        Create New Todo
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter todo description..."
            rows="3"
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Todo
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
