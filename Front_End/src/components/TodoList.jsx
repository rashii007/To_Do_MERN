import { useState } from "react";
import TodoItem from "./TodoItem";

const TodoList = ({
  todos,
  removeTodo,
  updateTodo,
  onEdit,
  onDuplicate,
  onArchive,
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort todos
  const getFilteredTodos = () => {
    let filtered = [...todos];

    // Filter
    if (filter === "active") filtered = filtered.filter((t) => !t.completed);
    else if (filter === "completed")
      filtered = filtered.filter((t) => t.completed);
    else if (filter === "important")
      filtered = filtered.filter((t) => t.important);
    else if (filter === "private")
      filtered = filtered.filter((t) => t.isPrivate);

    // Sort
    if (sortBy === "newest")
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest")
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "priority") {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      filtered.sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
      );
    }

    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  // Handlers for new features
  const handleToggleImportant = (id) => {
    const todo = todos.find((t) => t._id === id);
    updateTodo({ ...todo, important: !todo.important });
  };

  const handleTogglePrivate = (id) => {
    const todo = todos.find((t) => t._id === id);
    updateTodo({ ...todo, isPrivate: !todo.isPrivate });
  };

  const handleAddNote = (id, note) => {
    const todo = todos.find((t) => t._id === id);
    const notes = todo.notes || [];
    updateTodo({ ...todo, notes: [...notes, note] });
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
          >
            Active ({todos.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
          >
            Completed ({todos.filter((t) => t.completed).length})
          </button>
          <button
            onClick={() => setFilter("important")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${filter === "important" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-slate-700"}`}
          >
            ⭐ Important ({todos.filter((t) => t.important).length})
          </button>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-slate-700 border-0 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            No todos found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {todos.length === 0
              ? "Create your first todo above 🚀"
              : "Try changing your filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTodos.map((todo, index) => (
            <div
              key={todo._id || index}
              style={{ animationDelay: `${index * 100}ms` }}
              className="todo-item-enter"
            >
              <TodoItem
                todo={todo}
                removeTodo={removeTodo}
                updateTodo={updateTodo}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onArchive={onArchive}
                onToggleImportant={handleToggleImportant}
                onTogglePrivate={handleTogglePrivate}
                onAddNote={handleAddNote}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
