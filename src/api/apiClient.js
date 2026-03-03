import axios from "axios";

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
if (API_BASE_URL.endsWith("/")) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}
console.log("Using API_BASE_URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
