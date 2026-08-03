import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Search,
  Filter,
  Plus,
  LayoutDashboard,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Grid3x3,
  List,
  Download,
  Upload,
  Star,
  Flag,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Award,
  Flame,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Share2,
  Archive,
  Trash2,
  Edit2,
  MessageCircle,
  Paperclip,
  Tag,
  MoreHorizontal,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

// ✅ React Icons for Social Media
import { FaGithub, FaTwitter } from "react-icons/fa";

// Components
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import ThemeButton from "../components/ThemeButton";
import { ThemeContext } from "../context/ThemeContext";

// Services
import { logoutUser } from "../services/authApi";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoApi";

// Utils
import { formatDistanceToNow, format } from "date-fns";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // ============ STATES ============
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("todoViewMode") || "grid";
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progress: 0,
    todayCompleted: 0,
    weeklyCompleted: 0,
  });

  // ============ GET USER FROM LOCALSTORAGE ============
  const getUser = useCallback(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }, []);

  const currentUser = getUser();

  // ============ HANDLERS ============

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  // Fetch Todos with loading state
  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const res = await getTodos();
      console.log("API Response:", res.data);

      const todosData = res.data?.todos || res.data || [];
      setTodos(todosData);

      // Update stats
      const completed = todosData.filter((t) => t.completed).length;
      const pending = todosData.filter((t) => !t.completed).length;
      const total = todosData.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Today's completed
      const today = new Date().toDateString();
      const todayCompleted = todosData.filter(
        (t) => t.completed && new Date(t.updatedAt).toDateString() === today,
      ).length;

      setStats({
        total,
        completed,
        pending,
        progress,
        todayCompleted,
        weeklyCompleted: Math.min(completed, 10),
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.userMessage || "Failed to load todos. Please refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add Todo
  const addTodo = async (data) => {
    try {
      await createTodo(data);
      setSuccessMessage("Todo created successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchTodos();
    } catch (error) {
      console.error("Add Error:", error);
      setError(error.userMessage || "Failed to create todo.");
    }
  };

  // Update Todo (Complete/Pending)
  const handleUpdateTodo = async (id, updatedData = null) => {
    try {
      const todo = todos.find((item) => item._id === id);
      if (!todo) return;

      const data = updatedData || {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      };

      await updateTodo(id, data);
      setSuccessMessage(
        data.completed ? "Todo completed! ✅" : "Todo marked as pending! 🔄",
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchTodos();
    } catch (error) {
      console.error("Update Error:", error);
      setError(error.userMessage || "Failed to update todo.");
    }
  };

  // Delete Todo
  const removeTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return;
    }
    try {
      await deleteTodo(id);
      setSuccessMessage("Todo deleted successfully! 🗑️");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchTodos();
    } catch (error) {
      console.error("Delete Error:", error);
      setError(error.userMessage || "Failed to delete todo.");
    }
  };

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
  };

  // ============ FILTERS & SEARCH ============

  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (todo) =>
          todo.title?.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          (todo.tags &&
            todo.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }

    // Filter by Status
    if (filterStatus === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filterStatus === "important") {
      filtered = filtered.filter((todo) => todo.important);
    }

    // Filter by Priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filterPriority);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "priority": {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        filtered.sort(
          (a, b) =>
            (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
        );
        break;
      }
      case "alphabetical":
        filtered.sort((a, b) => a.title?.localeCompare(b.title) || 0);
        break;
      default:
        break;
    }

    return filtered;
  }, [todos, searchQuery, filterStatus, filterPriority, sortBy]);

  // ============ NOTIFICATIONS ============
  const notifications = [
    {
      id: 1,
      message: `You have ${stats.pending} pending todos!`,
      time: "Just now",
      type: "warning",
    },
    {
      id: 2,
      message: `You completed ${stats.todayCompleted} todos today! 🎉`,
      time: "Today",
      type: "success",
    },
  ];

  // ============ STATS CARDS ============
  const statsCards = [
    {
      title: "Total",
      value: stats.total,
      icon: <LayoutDashboard className="w-5 h-5" />,
      color: "blue",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "green",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: "yellow",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: "Progress",
      value: `${stats.progress}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "purple",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
  ];

  // ============ RENDER ============

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Loading your todos...
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 transition-colors duration-500">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  MERN Todo
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Manage your tasks
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-56 focus:w-64 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  🎯 {stats.progress}%
                </span>
              </div>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw
                  className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>

              {/* View Toggle */}
              <button
                onClick={() => {
                  const newMode = viewMode === "grid" ? "list" : "grid";
                  setViewMode(newMode);
                  localStorage.setItem("todoViewMode", newMode);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Grid3x3 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fadeIn z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 dark:text-white">
                        Notifications
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Button */}
              <ThemeButton />

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {currentUser?.name?.[0] || "U"}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fadeIn z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {currentUser?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentUser?.email || ""}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700/50 p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <Link
              to="/dashboard"
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-300"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 flex items-center justify-between animate-fadeIn">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center justify-between animate-fadeIn">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                Welcome back, {currentUser?.name || "User"}! 👋
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                You have{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {stats.pending}
                </span>{" "}
                pending tasks
                {searchQuery && ` - Showing ${filteredTodos.length} results`}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-xl">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{stats.todayCompleted} done today</span>
              </div>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-white dark:bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl shadow-md border ${stat.border} hover:shadow-lg transition-all duration-300 hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.text}`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-semibold ${stat.text}`}>
                  {stat.title === "Progress" ? "Overall" : ""}
                </span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${stat.text}`}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(filterStatus !== "all" || filterPriority !== "all") && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            <div className="flex gap-1 flex-wrap">
              {["all", "pending", "completed", "important"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filterStatus === status
                      ? status === "important"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {status === "all" && "📋 All"}
                  {status === "pending" && "⏳ Pending"}
                  {status === "completed" && "✅ Completed"}
                  {status === "important" && "⭐ Important"}
                </button>
              ))}
            </div>

            {showFilters && (
              <div className="flex gap-1 flex-wrap ml-auto">
                <span className="text-xs text-slate-400 dark:text-slate-500 self-center mr-1">
                  Priority:
                </span>
                {["all", "urgent", "high", "medium", "low"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilterPriority(priority)}
                    className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                      filterPriority === priority
                        ? priority === "urgent"
                          ? "bg-purple-500 text-white"
                          : priority === "high"
                            ? "bg-red-500 text-white"
                            : priority === "medium"
                              ? "bg-yellow-500 text-white"
                              : priority === "low"
                                ? "bg-green-500 text-white"
                                : "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {priority === "all" ? "All" : priority}
                  </button>
                ))}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-0 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="priority">Priority</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Todo Form */}
        <TodoForm addTodo={addTodo} />

        {/* Todo List */}
        <div className="mt-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50">
              {searchQuery ||
              filterStatus !== "all" ||
              filterPriority !== "all" ? (
                <>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                    No matching todos
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                      setFilterPriority("all");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                  >
                    Clear all filters
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                    No todos yet!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Create your first todo using the form above 🚀
                  </p>
                </>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                  : "space-y-4"
              }
            >
              <TodoList
                todos={filteredTodos}
                removeTodo={removeTodo}
                updateTodo={handleUpdateTodo}
                viewMode={viewMode}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2026 MERN Todo App. Designed & Developed by Muhammad Rashid
              Khan.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {stats.total} total · {stats.completed} completed ·{" "}
                {stats.pending} pending
              </span>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <FaGithub className="w-4 h-4" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <FaTwitter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
