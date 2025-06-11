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

// admin@example.com
// Password123!
// adminuser

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
  loginApi: (user: UserProps) => Promise<void>;
  logoutApi: () => void;
  isAuthReady: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProps>(undefined as any);

  const loginApi = async (user: UserProps) => {
    try {
      const response = await API.post(`/auth/login`, {
        email: user.email,
        password: user.password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      if (userData && accessToken && refreshToken) {
        setUser(userData);
        console.log("User set in context login:", userData);

        setAccessToken(accessToken);
        setIsAuthenticated(true);

        localStorage.setItem("refreshToken", refreshToken);

        API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // console.log("Role:" + userData.systemRole);

        if (userData.systemRole === "SUPER_ADMIN") {
          router.push("/superAdmin/dashboard");
        } else if (userData.systemRole === "ADMIN") {
          router.push("/admin/dashboard");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      throw new Error("Error Login Api.");
    }
  };

  const refreshTokenState = async () => {
    const localRefreshToken = localStorage.getItem("refreshToken");

    if (!localRefreshToken) {
      setIsAuthReady(true);
      return;
    }

    try {
      const response = await API.post(`/auth/refresh`, {
        refreshToken: localRefreshToken,
      });

      // console.log("REFRESH response data:", response.data);

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: userData,
      } = response.data;

      // console.log("User data from refresh:", userData);

      if (newAccessToken && newRefreshToken) {
        setAccessToken(newAccessToken);
        setUser(userData);
        // console.log("User set in context refresh:", userData);

        setIsAuthenticated(true);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      setAccessToken("");
      setIsAuthenticated(false);
      setUser({ email: "", password: "", systemRole: "" });
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      console.log("Refresh token invalid or expired:", error);
    } finally {
      setIsAuthReady(true);
    }
  };

  const logoutApi = () => {
    setAccessToken("");
    setIsAuthenticated(false);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    delete API.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const localRefreshToken = localStorage.getItem("refreshToken");

      if (!localRefreshToken) {
        setIsAuthReady(true);
        return;
      }

      try {
        await refreshTokenState();
      } catch (error) {
        setAccessToken("");
        setIsAuthenticated(false);
        setUser({ email: "", password: "", systemRole: "" });
        localStorage.removeItem("refreshToken");
        delete API.defaults.headers.common["Authorization"];
      } finally {
        setIsAuthReady(true);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loginApi, logoutApi, isAuthReady, isAuthenticated }}
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
