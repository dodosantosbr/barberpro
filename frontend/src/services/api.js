import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

/* 🔐 Adiciona token automaticamente */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* 🚨 Tratamento global de erros */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    /* TOKEN INVÁLIDO OU EXPIRADO */
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    /* ASSINATURA EXPIRADA */
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.error === "subscription_expired"
    ) {
      window.location.href = "/subscription-expired";
    }

    return Promise.reject(error);
  }
);

export default api;
