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

// token management
API.interceptors.request.use((config) => {
  // Try both refresh and access tokens
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("refreshToken");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // error handling for 401s
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already on login page or trying to login, don't retry
      if (
        originalRequest.url?.includes("/auth/login") ||
        window.location.pathname === "/login"
      ) {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token available, redirect to login
        console.log("❌ No refresh token available, redirecting to login");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Already refreshing, queue this request
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

        const response = await axios.post(
          "http://localhost:3100/api/auth/refresh",
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store both tokens properly
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Use access token for future requests
        const tokenToUse = accessToken || newRefreshToken;
        originalRequest.headers["Authorization"] = `Bearer ${tokenToUse}`;

        processQueue(null, tokenToUse);

        console.log("✅ Token refresh successful");
        return API(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        processQueue(refreshError, null);

        // Clear all tokens and redirect to login
        localStorage.clear();

        // Add small delay to prevent rapid redirects
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
