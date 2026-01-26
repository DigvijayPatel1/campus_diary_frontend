import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:3000";

const baseURL = import.meta.env.PROD 
  ? `${backendUrl}/api/v1` 
  : "/api/v1";

// Axios instance
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple refresh calls at the same time
let isRefreshing = false;
let failedQueue = [];

// Run queued requests after refresh is done
const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve();
  });
  failedQueue = [];
};

// Add refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response -> network error
    if (!error.response) {
      return Promise.reject(error);
    }

    // If Unauthorized (access token expired)
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh-tokens")
    ) {
      originalRequest._retry = true;

      // If refresh is already running, wait until it finishes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Refresh token (cookie-based)
        await api.post("/users/refresh-tokens");

        processQueue(null);

        // Retry the original request after refresh success
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Refresh failed: you can logout user here if you want
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
