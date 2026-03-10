import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

/* 🔐 adiciona token automaticamente */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* 🚨 tratamento global de erros */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* 🟢 função para acordar a API */
export async function wakeApi(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(import.meta.env.VITE_API_URL);
      return true; // API acordou
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export default api;
