import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeButton = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 
  hover:scale-105 cursor-pointer"
    >
      {darkMode ? "☀️ " : "🌙 "}
    </button>
  );
};

export default ThemeButton;