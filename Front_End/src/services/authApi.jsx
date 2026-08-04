// services/authApi.jsx
import axios from "axios";

// ✅ CORRECT - Vite uses import.meta.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("API_BASE_URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============ REQUEST INTERCEPTOR ============
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ CORRECT - Vite uses import.meta.env
    if (import.meta.env.MODE === "development") {
      console.log(
        `🚀 ${config.method.toUpperCase()} ${config.url}`,
        config.data || "",
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
    if (import.meta.env.MODE === "development") {
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
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
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

// ============ AUTH FUNCTIONS ============

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async (userData) => {
  try {
    if (!userData.name || !userData.name.trim()) {
      throw new Error("Name is required");
    }
    if (!userData.email || !userData.email.trim()) {
      throw new Error("Email is required");
    }
    if (!userData.password || userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const response = await retryRequest(() =>
      api.post("/auth/register", {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
      }),
    );

    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    throw (
      error.response?.data ||
      error.userMessage ||
      error.message ||
      "Registration failed"
    );
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
// services/authApi.jsx
export const loginUser = async (loginData) => {
  try {
    if (!loginData.email || !loginData.email.trim()) {
      throw new Error("Email is required");
    }
    if (!loginData.password) {
      throw new Error("Password is required");
    }

    const response = await api.post("/auth/login", {
      email: loginData.email.trim().toLowerCase(),
      password: loginData.password,
    });

    console.log("API Login Response:", response.data);

    const data = response.data;

    //   ✅ Return complete data with user
    return {
      success: data.success || true,
      message: data.message || "Login successful",
      token: data.token,
      user: data.user || data.data?.user || null,
    };
  } catch (error) {
    console.error("Login Error:", error);
    throw (
      error.response?.data ||
      error.userMessage ||
      error.message ||
      "Login failed"
    );
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await retryRequest(() =>
      api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");

    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw (
      error.response?.data ||
      error.userMessage ||
      error.message ||
      "Logout failed"
    );
  }
};

// ============ EXPORT ============
export default {
  registerUser,
  loginUser,
  logoutUser,
};
