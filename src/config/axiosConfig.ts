import axios from "axios";
import config from "./config";

const apiUrl = config.API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // 🔑 required for cookies to be sent
});

// ✅ Request Interceptor to check network before sending request
api.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      // Offline mode: manually throw error
      return Promise.reject({
        message: "No internet connection",
        isNetworkError: true,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
