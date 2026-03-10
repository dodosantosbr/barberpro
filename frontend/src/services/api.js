import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://barberpro-drfa.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // 🔥 envia cookie automaticamente
});

/* 🚨 tratamento global de erros */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
