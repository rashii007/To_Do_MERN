// services/todoApi.jsx
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); // Debug
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || "");
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - Redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
    console.error("API Error:", errorMessage);
    
    return Promise.reject({
      ...error,
      userMessage: errorMessage,
    });
  }
);

// ✅ Create Todo
export const createTodo = async (data) => {
  try {
    console.log("Creating todo with data:", data); // Debug
    
    const response = await api.post("/todo/create", {
      title: data.title,
      description: data.description,
      priority: data.priority || "medium",
      createdBy: data.createdBy, // ✅ Backend expects "createdBy"
    });
    
    console.log("Todo created:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

// ✅ Get All Todos
export const getTodos = async () => {
  try {
    const response = await api.get("/todo/get");
    return response;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

// ✅ Update Todo
export const updateTodo = async (id, data) => {
  try {
    const response = await api.put(`/todo/update/${id}`, {
      title: data.title,
      description: data.description,
      completed: data.completed,
      priority: data.priority,
    });
    return response;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

// ✅ Delete Todo
export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/todo/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

export default {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};