// services/dashApi.jsx
import axios from "axios";

// ✅ CORRECT - Vite uses import.meta.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/dashboard";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Rest of your code...

// ============ REQUEST INTERCEPTOR ============
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 ${config.method.toUpperCase()} ${config.url}`,
        config.params || "",
      );
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// ============ RESPONSE INTERCEPTOR ============
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method.toUpperCase()} ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh`,
            { refreshToken },
          );

          const { token } = response.data;
          localStorage.setItem("token", token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh Token Error:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status >= 400 && error.response?.status < 500) {
      console.error("Client Error:", errorMessage);
    } else if (error.response?.status >= 500) {
      console.error("Server Error:", errorMessage);
    }

    return Promise.reject({
      ...error,
      userMessage: errorMessage,
    });
  },
);

// ============ RETRY LOGIC ============
const retryRequest = async (fn, retries = 2, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || error.response?.status === 401) throw error;
    console.log(`Retrying... (${retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

// ============ DASHBOARD FUNCTIONS ============

/**
 * Get Dashboard Data
 * GET /api/dashboard/
 * @param {Object} params - Query parameters (optional)
 * @param {string} params.period - 'day', 'week', 'month', 'year' (optional)
 * @returns {Object} - { total, completed, pending, progress, recentTodos, ... }
 */
export const getDashBoard = async (params = {}) => {
  try {
    const response = await retryRequest(() => api.get("/dashboard", { params }));

    console.log("Dashboard Response:", response);

    return response.data;
  } catch (error) {
    console.error("Dashboard Error:", error);
    throw (
      error.response?.data ||
      error.userMessage ||
      error.message ||
      "Failed to load dashboard"
    );
  }
};

// ============ EXPORT ============
export default {
  getDashBoard,
};
