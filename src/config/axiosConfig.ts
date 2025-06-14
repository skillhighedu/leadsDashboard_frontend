import axios from "axios";
import config from "./config";

const apiUrl = config.API_BASE_URL;

const api = axios.create({ baseURL: apiUrl, withCredentials: true });

// Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); // Clear the stored token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  },
);

export default api;
