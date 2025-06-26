"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "../utils/AxiosInstance";

interface UserProps {
  id?: string;
  email: string;
  username?: string;
  fullName?: string;
  password: string;
  systemRole: string;
  currentRole?: string;
}

interface AuthContextType {
  user: UserProps;
  loginApi: (
    user: UserProps
  ) => Promise<{ success: boolean; message?: string }>;
  logoutApi: () => void;
  isAuthReady: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProps>(undefined as any);
  const [loading, setLoading] = useState(true);

  // ✅ Enhanced logout function to clear everything
  const logoutApi = () => {
    console.log("🔄 Starting logout process...");
    setLoading(true);

    try {
      // Clear all state
      setAccessToken("");
      setIsAuthenticated(false);
      setUser({ email: "", password: "", systemRole: "" });

      // Clear all localStorage items
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      // Clear sessionStorage as well
      sessionStorage.clear();

      // Remove authorization header
      delete API.defaults.headers.common["Authorization"];

      console.log("✅ Logout completed successfully");

      // Add small delay before redirect
      setTimeout(() => {
        router.push("/login");
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error("❌ Error during logout:", error);
      setLoading(false);
    }
  };

  const loginApi = async (
    user: UserProps
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      console.log("🔄 Starting login process for:", user.email);

      // ✅ Clear any existing auth data before login
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      delete API.defaults.headers.common["Authorization"];

      const response = await API.post(`/auth/login`, {
        email: user.email,
        password: user.password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      console.log(
        "✅ Login response received for user:",
        userData.email,
        "Role:",
        userData.systemRole
      );

      // Role check
      const allowedRoles = ["ADMIN", "SUPER_ADMIN"];
      if (!allowedRoles.includes(userData.systemRole)) {
        return { success: false, message: "Unauthorized role. Access denied." };
      }

      if (userData && accessToken && refreshToken) {
        // ✅ Set user data first
        setUser(userData);
        setAccessToken(accessToken);
        setIsAuthenticated(true);

        // ✅ Store tokens properly
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);

        // ✅ Set authorization header
        API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        console.log("✅ User authenticated successfully:", userData.systemRole);

        // ✅ Redirect based on role
        if (userData.systemRole === "SUPER_ADMIN") {
          console.log("🔄 Redirecting to Super Admin dashboard");
          router.push("/superAdmin/dashboard");
        } else if (userData.systemRole === "ADMIN") {
          console.log("🔄 Redirecting to Admin dashboard");
          router.push("/admin/dashboard");
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: "Login failed due to missing credentials.",
        };
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);

      // Clear any partial auth data on error
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      delete API.defaults.headers.common["Authorization"];

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error during login. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshTokenState = async () => {
    const localRefreshToken = localStorage.getItem("refreshToken");

    if (!localRefreshToken) {
      setIsAuthReady(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Attempting token refresh...");

      const response = await API.post(`/auth/refresh`, {
        refreshToken: localRefreshToken,
      });

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: userData,
      } = response.data;

      if (newAccessToken && newRefreshToken && userData) {
        console.log(
          "✅ Token refresh successful for user:",
          userData.email,
          "Role:",
          userData.systemRole
        );

        setAccessToken(newAccessToken);
        setUser(userData);
        setIsAuthenticated(true);

        // ✅ Update stored tokens
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("userId", userData.id);

        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);

      // ✅ Clear all auth data on refresh failure
      setAccessToken("");
      setIsAuthenticated(false);
      setUser({ email: "", password: "", systemRole: "" });
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      delete API.defaults.headers.common["Authorization"];
    } finally {
      setIsAuthReady(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const localRefreshToken = localStorage.getItem("refreshToken");

      if (!localRefreshToken) {
        setIsAuthReady(true);
        setLoading(false);
        return;
      }

      try {
        await refreshTokenState();
      } catch (error) {
        console.error("❌ Auth initialization error:", error);

        // Clear everything on init error
        setAccessToken("");
        setIsAuthenticated(false);
        setUser({ email: "", password: "", systemRole: "" });
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        delete API.defaults.headers.common["Authorization"];
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loginApi,
        logoutApi,
        isAuthReady,
        isAuthenticated,
        loading,
      }}
    >
      {isAuthReady ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error AuthProvider");
  }
  return context;
};
