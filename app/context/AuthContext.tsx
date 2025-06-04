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
  systemRole?: string;
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
  const [user, setUser] = useState<UserProps>({
    email: "",
    password: "",
  });

  const loginApi = async (user: UserProps) => {
    try {
      const response = await API.post(`/auth/login`, {
        email: user.email,
        password: user.password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      if (userData && accessToken && refreshToken) {
        setUser(userData);

        localStorage.setItem("refreshToken", refreshToken);
        setAccessToken(accessToken);
        setIsAuthenticated(true);

        API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        router.push("/admin/dashboard");
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

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: userData,
      } = response.data;

      if (newAccessToken && newRefreshToken) {
        setAccessToken(newAccessToken);
        setUser(userData || user);
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
      setUser({ email: "", password: "" });
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
    if (isMounted) {
      const localRefreshToken = localStorage.getItem("refreshToken");
      if (!localRefreshToken) {
        setIsAuthReady(true);
        return;
      } else {
        refreshTokenState();
      }
    }
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
