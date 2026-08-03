import { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  RefreshCw,
  MoreVertical,
  Sparkles,
  Flag,
  AlertTriangle,
  Circle,
  BarChart3,
  Star,
  Bell,
  Share2,
  Copy,
  Archive,
  Tag,
  Link2,
  ExternalLink,
  MessageCircle,
  Paperclip,
  Eye,
  EyeOff,
  Zap,
  Award,
  Flame,
} from "lucide-react";

const TodoItem = ({
  todo,
  removeTodo,
  updateTodo,
  onEdit,
  onDuplicate,
  onArchive,
  onToggleImportant,
  onTogglePrivate,
  onAddNote,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");
  const menuRef = useRef(null);
  const noteRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setShowNoteInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle adding a note
  const handleAddNoteSubmit = () => {
    if (note.trim() && onAddNote) {
      onAddNote(todo._id, note.trim());
      setNote("");
      setShowNoteInput(false);
    }
  };

  // Get time ago string
  const timeAgo = (date) => {
    if (!date) return "N/A";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count > 0) return `${count} ${key}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  // Priority configuration
  const getPriorityConfig = () => {
    const priority = todo.priority || "medium";
    const configs = {
      urgent: {
        icon: Flame,
        color: "purple",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        border: "border-purple-300 dark:border-purple-700",
        label: "🔥 Urgent",
        glow: "shadow-purple-500/30",
      },
      high: {
        icon: AlertTriangle,
        color: "red",
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-300 dark:border-red-700",
        label: "⚡ High",
        glow: "shadow-red-500/30",
      },
      medium: {
        icon: BarChart3,
        color: "yellow",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-300 dark:border-yellow-700",
        label: "📊 Medium",
        glow: "shadow-yellow-500/30",
      },
      low: {
        icon: Circle,
        color: "green",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-300 dark:border-green-700",
        label: "📝 Low",
        glow: "shadow-green-500/30",
      },
    };
    return configs[priority] || configs.medium;
  };

  const priorityConfig = getPriorityConfig();
  const PriorityIcon = priorityConfig.icon;

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (todo.subtasks && todo.subtasks.length > 0) {
      const completed = todo.subtasks.filter((st) => st.completed).length;
      return Math.round((completed / todo.subtasks.length) * 100);
    }
    return todo.progress || (todo.completed ? 100 : 0);
  };

  const completionPercentage = getCompletionPercentage();

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      work: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700",
      personal:
        "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700",
      health:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700",
      study:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700",
      finance:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700",
      shopping:
        "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700",
    };
    return colors[category] || colors.work;
  };

  // ✅ FIXED: Toggle complete function
  const toggleComplete = () => {
    console.log("🔄 Toggling complete for:", todo._id);
    console.log("📤 Current status:", todo.completed);
    console.log("📤 New status:", !todo.completed);

    if (todo._id) {
      updateTodo(todo._id, { completed: !todo.completed });
    } else {
      updateTodo({ ...todo, completed: !todo.completed });
    }
  };

  return (
    <div
      className="relative group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <div
        className={`
          absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
          rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500
          ${todo.completed ? "opacity-0" : "group-hover:opacity-30"}
          ${todo.important ? "opacity-40 group-hover:opacity-60" : ""}
        `}
      ></div>

      {/* Main Card */}
      <div
        className={`
          relative bg-white dark:bg-slate-800/90 backdrop-blur-sm 
          rounded-2xl p-5 border transition-all duration-500 h-full flex flex-col
          ${
            todo.completed
              ? "border-green-200 dark:border-green-800/50 opacity-70"
              : "border-gray-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700"
          }
          ${todo.important ? "border-yellow-400 dark:border-yellow-500/50" : ""}
          ${isHovered ? "shadow-2xl scale-[1.02]" : "shadow-lg hover:shadow-xl"}
          ${isExpanded ? "pb-6" : ""}
        `}
      >
        {/* Important Badge */}
        {todo.important && (
          <div className="absolute -top-2 -left-2">
            <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] font-bold shadow-lg flex items-center gap-1 animate-pulse">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>IMPORTANT</span>
            </div>
          </div>
        )}

        {/* ✅ FIXED: Completion Status Badge */}
        <div className="absolute -top-2 -right-2">
          <div
            className={`
              px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1
              transition-all duration-300
              ${
                todo.completed
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              }
            `}
          >
            {todo.completed ? (
              <>
                <CheckCircle className="w-2.5 h-2.5" />
                <span>DONE</span>
              </>
            ) : (
              <>
                <Clock className="w-2.5 h-2.5 animate-spin" />
                <span>PENDING</span>
              </>
            )}
          </div>
        </div>

        {/* Header - Title & Actions */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`
                  text-lg font-bold transition-all duration-300 truncate
                  ${
                    todo.completed
                      ? "text-gray-400 dark:text-gray-500 line-through"
                      : "text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }
                `}
              >
                {todo.title}
              </h3>

              {/* Category Badge */}
              {todo.category && (
                <span
                  className={`
                  text-[10px] px-1.5 py-0.5 rounded-full border font-medium
                  ${getCategoryColor(todo.category)}
                `}
                >
                  #{todo.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {/* Priority Badge */}
              <span
                className={`
                  text-[10px] px-1.5 py-0.5 rounded-full border font-medium flex items-center gap-0.5
                  ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}
                `}
              >
                <PriorityIcon className="w-2.5 h-2.5" />
                {priorityConfig.label}
              </span>

              {/* Private Badge */}
              {todo.isPrivate && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center gap-0.5">
                  <EyeOff className="w-2.5 h-2.5" />
                  Private
                </span>
              )}

              {/* Notes Indicator */}
              {todo.notes && todo.notes.length > 0 && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                  <MessageCircle className="w-2.5 h-2.5" />
                  {todo.notes.length}
                </span>
              )}
            </div>
          </div>

          {/* More Options Menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit && onEdit(todo);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button
                  onClick={() => {
                    onDuplicate && onDuplicate(todo);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>

                <button
                  onClick={() => {
                    onToggleImportant && onToggleImportant(todo._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${todo.important ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
                  {todo.important ? "Remove Important" : "Mark Important"}
                </button>

                <button
                  onClick={() => {
                    onTogglePrivate && onTogglePrivate(todo._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  {todo.isPrivate ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  {todo.isPrivate ? "Make Public" : "Make Private"}
                </button>

                <button
                  onClick={() => setShowNoteInput(true)}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Add Note
                </button>

                <button
                  onClick={() => {
                    onArchive && onArchive(todo._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>

                <div className="border-t border-gray-200 dark:border-slate-700 my-1"></div>

                <button
                  onClick={() => {
                    removeTodo(todo._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p
          className={`
            mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1
            ${isExpanded ? "" : "line-clamp-2"}
            transition-all duration-300
          `}
        >
          {todo.description || "No description"}
        </p>

        {/* Notes Section */}
        {todo.notes && todo.notes.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
              <MessageCircle className="w-2.5 h-2.5" />
              <span>Notes</span>
            </div>
            {todo.notes.slice(0, 2).map((note, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-600 dark:text-gray-300 py-0.5 border-b border-gray-200 dark:border-slate-600/50 last:border-0"
              >
                • {note}
              </div>
            ))}
            {todo.notes.length > 2 && (
              <div className="text-[10px] text-gray-400 mt-0.5">
                +{todo.notes.length - 2} more
              </div>
            )}
          </div>
        )}

        {/* Tags Section */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            <Tag className="w-2.5 h-2.5 text-gray-400" />
            {todo.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              >
                #{tag}
              </span>
            ))}
            {todo.tags.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{todo.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Subtasks Section */}
        {todo.subtasks && todo.subtasks.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                <span>
                  Subtasks ({todo.subtasks.filter((st) => st.completed).length}/
                  {todo.subtasks.length})
                </span>
              </div>
              <span>{getCompletionPercentage()}%</span>
            </div>
            <div className="space-y-0.5">
              {todo.subtasks.slice(0, 2).map((subtask, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {
                      const updatedSubtasks = [...todo.subtasks];
                      updatedSubtasks[idx].completed =
                        !updatedSubtasks[idx].completed;
                      updateTodo({ ...todo, subtasks: updatedSubtasks });
                    }}
                    className="w-3 h-3 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={
                      subtask.completed
                        ? "line-through text-gray-400 dark:text-gray-500 text-xs"
                        : "text-gray-700 dark:text-gray-300 text-xs"
                    }
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
              {todo.subtasks.length > 2 && (
                <div className="text-[10px] text-gray-400">
                  +{todo.subtasks.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expand/Collapse Toggle */}
        {todo.description && todo.description.length > 80 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Note Input */}
        {showNoteInput && (
          <div
            ref={noteRef}
            className="mt-2 p-2 bg-gray-50 dark:bg-slate-700/30 rounded-lg"
          >
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a note..."
              className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddNoteSubmit()}
            />
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={handleAddNoteSubmit}
                className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowNoteInput(false);
                  setNote("");
                }}
                className="px-2 py-0.5 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-slate-700/50">
          <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-0.5">
              <Calendar className="w-2.5 h-2.5" />
              <span>{timeAgo(todo.createdAt)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <RefreshCw className="w-2.5 h-2.5" />
              <span>{timeAgo(todo.updatedAt)}</span>
            </div>
            {todo.dueDate && (
              <div className="flex items-center gap-0.5 col-span-2">
                <Clock className="w-2.5 h-2.5" />
                <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ FIXED: Action Buttons */}
        <div className="flex gap-2 mt-3">
          {/* Main Action Button */}
          <button
            onClick={toggleComplete}
            className={`
              flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
              ${
                todo.completed
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/30"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30"
              }
            `}
          >
            {todo.completed ? "↻ Mark Pending" : "✓ Mark Complete"}
          </button>

          {/* Important Toggle */}
          <button
            onClick={() => onToggleImportant && onToggleImportant(todo._id)}
            className={`
              px-2.5 py-1.5 rounded-lg transition-all duration-300
              ${
                todo.important
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              }
            `}
            title={todo.important ? "Remove Important" : "Mark Important"}
          >
            <Star
              className={`w-3.5 h-3.5 ${todo.important ? "fill-yellow-400" : ""}`}
            />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (window.confirm("Delete this todo?")) {
                removeTodo(todo._id);
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        {completionPercentage > 0 && completionPercentage < 100 && (
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  completionPercentage === 100
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
