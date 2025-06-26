import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3100/api",
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Enhanced request interceptor
API.interceptors.request.use((config) => {
  // Always try to get the most recent token
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Prefer access token over refresh token
  const token = accessToken || refreshToken;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Enhanced response interceptor with better error handling
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for login and refresh endpoints
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log(
          "❌ No refresh token available, clearing auth and redirecting"
        );
        // Clear everything and redirect
        localStorage.clear();
        sessionStorage.clear();
        delete API.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting token refresh...");

        // Use a fresh axios instance for refresh to avoid interceptor loops
        const refreshResponse = await axios.post(
          "http://localhost:3100/api/auth/refresh",
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
          user,
        } = refreshResponse.data;

        if (accessToken && newRefreshToken && user) {
          console.log("✅ Token refresh successful for user:", user.email);

          // Update localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          localStorage.setItem("userId", user.id);

          // Update default headers
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          // Process queued requests
          processQueue(null, accessToken);

          // Retry original request
          return API(originalRequest);
        } else {
          throw new Error("Invalid refresh response structure");
        }
      } catch (refreshError: any) {
        console.error("❌ Token refresh failed:", refreshError);

        // Process failed queue
        processQueue(refreshError, null);

        // Clear all auth data
        localStorage.clear();
        sessionStorage.clear();
        delete API.defaults.headers.common["Authorization"];

        // Redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
