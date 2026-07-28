import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/todo",
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getTodos = async () => {
  return await api.get("/get");
};

export const createTodo = async (data) => {
  return await api.post("/create", data);
};

export const updateTodo = async (id, data) => {
  return await api.put(`/update/${id}`, data);
};

export const deleteTodo = async (id) => {
  return await api.delete(`/delete/${id}`);
};