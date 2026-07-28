import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/login", loginData);

    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("token");

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;