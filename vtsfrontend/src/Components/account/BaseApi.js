import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", //  backend base URL
});

// To include token in headers for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
