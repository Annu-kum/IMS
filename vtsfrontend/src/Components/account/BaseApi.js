import axios from "axios";
import { API_BASE_URL } from "../BaseConfig/BaseUrls";

const api = axios.create({
  baseURL: API_BASE_URL, //  backend base URL
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
