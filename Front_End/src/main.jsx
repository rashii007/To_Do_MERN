import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

// ============ GET ROOT ELEMENT ============
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// ============ RENDER APP ============
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// ============ OPTIONAL: SERVICE WORKER (PWA) ============
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js');
//   });
// }

// ============ OPTIONAL: CONSOLE WELCOME ============
if (process.env.NODE_ENV === "development") {
  console.log("🚀 Todo App Started Successfully!");
  console.log("📦 Version: 1.0.0");
  console.log("🔧 Mode: Development");
}
