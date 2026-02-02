import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<unknown> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and it's NOT a refresh token request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      // If already refreshing, wait for the existing promise
      if (isRefreshing && refreshPromise) {
        try {
          await refreshPromise;
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Start new refresh process
      isRefreshing = true;
      refreshPromise = apiClient.post("/auth/refresh", {});

      try {
        await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;

        // If refresh fails, redirect to login
        if (typeof window !== "undefined") {
          window.location.replace("/signin");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
