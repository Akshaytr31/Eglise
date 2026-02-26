import axios from "axios";

const API_BASE_URL = ""; // Forced empty for Vite proxy
console.log("Using API_BASE_URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login or refresh token)
      console.error("Unauthorized access - potential token expiry");
      // localStorage.removeItem('token'); // Optional: clear token on 401
    }
    return Promise.reject(error);
  },
);

export default apiClient;
