const TodoItem = ({ todo, removeTodo, updateTodo }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 mb-5">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {todo.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        {todo.description}
      </p>

      {/* Status */}
      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            todo.completed
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
          }`}
        >
          {todo.completed ? "✅ Completed" : "⏳ Pending"}
        </span>
      </div>

      {/* Created & Updated */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>
          📅 Created:{" "}
          {todo.createdAt
            ? new Date(todo.createdAt).toLocaleString()
            : "N/A"}
        </p>

        <p>
          ✏️ Updated:{" "}
          {todo.updatedAt
            ? new Date(todo.updatedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => updateTodo(todo._id)}
          className={`px-4 py-2 rounded-lg text-white font-medium transition cursor-pointer ${
            todo.completed
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {todo.completed ? "Mark Pending" : "Mark Complete"}
        </button>

        <button
          onClick={() => removeTodo(todo._id)}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;