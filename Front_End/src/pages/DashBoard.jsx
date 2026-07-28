import { useEffect, useState } from "react";
import { getDashBoard } from "../services/dashApi";
import ThemeButton from "../components/ThemeButton";
import { Link } from "react-router-dom";

const DashBoard = () => {
  const [dashboard, setDashboard] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progress: 0,
    recentTodos: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (data) => {
    try {
      const res = await getDashBoard();
      console.log(res);
      console.log(res.dashboard);

      // Agar backend { dashboard: {...} } return karta hai
      setDashboard(res.dashboard);

      // Agar backend direct object return karta hai to ye use karo:
      // setDashboard(res);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <ThemeButton />

      <h1 className="text-4xl font-bold text-center mb-10 text-slate-800 dark:text-white">
        📊 Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 border-l-4 border-blue-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-slate-500 dark:text-slate-300">Total Todos</h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {dashboard.total}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border-l-4 border-green-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-slate-500 dark:text-slate-300">Completed</h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {dashboard.completed}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border-l-4 border-yellow-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-slate-500 dark:text-slate-300">Pending</h2>
          <p className="text-4xl font-bold text-yellow-500 dark:text-yellow-400">
            {dashboard.pending}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border-l-4 border-purple-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-slate-500 dark:text-slate-300">Progress</h2>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {dashboard.progress}%
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between mb-3">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Overall Progress
          </span>
          <span className="font-bold text-slate-800 dark:text-white">
            {dashboard.progress}%
          </span>
        </div>

        <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-3 bg-linear-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
            style={{ width: `${dashboard.progress}%` }}
          />
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/"
          className="px-8 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default DashBoard;
