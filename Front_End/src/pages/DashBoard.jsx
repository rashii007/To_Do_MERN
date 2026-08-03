import { useEffect, useState, useRef } from "react";
import { getDashBoard } from "../services/dashApi";
import ThemeButton from "../components/ThemeButton";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Clock,
  Activity,
  Sparkles,
  Zap,
  Award,
  Flame,
  BarChart3,
  PieChart,
  RefreshCw,
  ChevronRight,
  Target,
  // ❌ REMOVED: Github, Twitter, Linkedin (they don't exist in lucide-react)
  Bell,
  Search,
  Grid3x3,
  List,
  Settings,
  LogOut,
  User,
  Plus,
  Flag,
  AlertTriangle,
  Circle,
  Trash2,
  Edit2,
} from "lucide-react";

// ✅ ADD React Icons
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const DashBoard = () => {
  // ============ STATES ============
  const [dashboard, setDashboard] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progress: 0,
    recentTodos: [],
    priorities: {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    categories: {
      work: 0,
      personal: 0,
      health: 0,
      study: 0,
      finance: 0,
      shopping: 0,
    },
    productivity: {
      streak: 0,
      bestStreak: 0,
      totalCompleted: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [error, setError] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  // ============ FETCH DASHBOARD ============
  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setAnimateStats(true), 300);
    }
  }, [loading]);

  const fetchDashboard = async () => {
    try {
      setError(null);
      const res = await getDashBoard();
      console.log("Dashboard Response:", res);

      // Handle response - aapke backend ke hisaab se
      const data = res.dashboard || res || {};

      setDashboard({
        total: data.total || 0,
        completed: data.completed || 0,
        pending: data.pending || 0,
        progress: data.progress || 0,
        recentTodos: data.recentTodos || [],
        priorities: data.priorities || {
          urgent: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
        categories: data.categories || {
          work: 0,
          personal: 0,
          health: 0,
          study: 0,
          finance: 0,
          shopping: 0,
        },
        productivity: data.productivity || {
          streak: 0,
          bestStreak: 0,
          totalCompleted: 0,
        },
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      setError(error.userMessage || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
  };

  // ============ HELPERS ============
  const completionRate =
    dashboard.total > 0
      ? Math.round((dashboard.completed / dashboard.total) * 100)
      : 0;

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: {
        icon: Flame,
        color: "purple",
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        border: "border-purple-300 dark:border-purple-700",
      },
      high: {
        icon: AlertTriangle,
        color: "red",
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-300 dark:border-red-700",
      },
      medium: {
        icon: BarChart3,
        color: "yellow",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-300 dark:border-yellow-700",
      },
      low: {
        icon: Circle,
        color: "green",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-300 dark:border-green-700",
      },
    };
    return configs[priority] || configs.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: "💼",
      personal: "👤",
      health: "🏥",
      study: "📚",
      finance: "💰",
      shopping: "🛒",
    };
    return icons[category] || "📌";
  };

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-950 transition-colors duration-500">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Your productivity overview
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw
                  className={`w-5 h-5 text-slate-600 dark:text-slate-300 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>

              {/* Theme Button */}
              <ThemeButton />

              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* ============ WELCOME ============ */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                Welcome back! 👋
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Here's what's happening with your todos today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Grid3x3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </button>
              <Link
                to="/"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Todo
              </Link>
            </div>
          </div>
        </div>

        {/* ============ STATS CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {/* Total */}
          <div
            className={`bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-700 ${
              animateStats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">
              {dashboard.total}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Todos
            </p>
          </div>

          {/* Completed */}
          <div
            className={`bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-700 delay-100 ${
              animateStats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                {completionRate}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">
              {dashboard.completed}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Completed
            </p>
          </div>

          {/* Pending */}
          <div
            className={`bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-700 delay-200 ${
              animateStats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                {dashboard.pending > 0 ? "Action needed" : "All done!"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">
              {dashboard.pending}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pending
            </p>
          </div>

          {/* Progress */}
          <div
            className={`bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-700 delay-300 ${
              animateStats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">
              {dashboard.progress}%
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Progress
            </p>
          </div>
        </div>

        {/* ============ PRODUCTIVITY & PRIORITIES ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Productivity */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Productivity
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Completion Rate
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {completionRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current Streak
                  </p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {dashboard.productivity?.streak || 0} days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Best Streak
                  </p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">
                    <Award className="w-4 h-4 inline text-yellow-500" />
                    {dashboard.productivity?.bestStreak || 0} days
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Completed
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {dashboard.productivity?.totalCompleted ||
                    dashboard.completed}
                </p>
              </div>
            </div>
          </div>

          {/* Priorities */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Priority Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(dashboard.priorities || {}).map(
                ([priority, count]) => {
                  if (count === 0) return null;
                  const config = getPriorityConfig(priority);
                  const Icon = config.icon;
                  const percentage =
                    dashboard.total > 0
                      ? Math.round((count / dashboard.total) * 100)
                      : 0;
                  return (
                    <div key={priority}>
                      <div className="flex justify-between text-sm mb-1">
                        <span
                          className={`flex items-center gap-1 ${config.text}`}
                        >
                          <Icon className="w-3 h-3" />
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-${config.color}-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                },
              )}
              {Object.values(dashboard.priorities || {}).every(
                (v) => v === 0,
              ) && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                  No todos with priority set
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Categories
            </h3>
            <div className="space-y-2">
              {Object.entries(dashboard.categories || {}).map(
                ([category, count]) => {
                  if (count === 0) return null;
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600 dark:text-slate-300">
                        {getCategoryIcon(category)}{" "}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">
                        {count}
                      </span>
                    </div>
                  );
                },
              )}
              {Object.values(dashboard.categories || {}).every(
                (v) => v === 0,
              ) && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                  No categories assigned
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============ RECENT TODOS ============ */}
        <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Todos
            </h3>
            <Link
              to="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4">
            {dashboard.recentTodos && dashboard.recentTodos.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                } gap-4`}
              >
                {dashboard.recentTodos.slice(0, 4).map((todo, index) => {
                  const priorityConfig = getPriorityConfig(todo.priority);
                  const Icon = priorityConfig.icon;
                  return (
                    <div
                      key={todo._id || index}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold text-slate-800 dark:text-white truncate ${
                              todo.completed
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : ""
                            }`}
                          >
                            {todo.title}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {todo.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border} flex items-center gap-1`}
                            >
                              <Icon className="w-3 h-3" />
                              {todo.priority || "Medium"}
                            </span>
                            {todo.category && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                {getCategoryIcon(todo.category)} {todo.category}
                              </span>
                            )}
                            {todo.completed ? (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                ✅ Done
                              </span>
                            ) : (
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                ⏳ Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Edit2 className="w-3 h-3 text-slate-400" />
                          </button>
                          <button className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30">
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-slate-500 dark:text-slate-400">
                  No recent todos
                </p>
                <Link
                  to="/"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block"
                >
                  Create your first todo →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 Todo App. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* ✅ FIXED - Using react-icons */}
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <FaGithub className="w-4 h-4" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <FaTwitter className="w-4 h-4" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <FaLinkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DashBoard;
