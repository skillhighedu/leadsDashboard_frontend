import axios from "axios";
import config from "./config";

const apiUrl = config.API_BASE_URL;

// Automatically sends cookies (including httpOnly token) on every request
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // 🔑 required for cookies to be sent
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might have expired, session invalid
      // Only redirect if not already on login page to prevent loops
      if (window.location.pathname !== '/login') {
        window.location.href = "/login"; // Redirect user to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
