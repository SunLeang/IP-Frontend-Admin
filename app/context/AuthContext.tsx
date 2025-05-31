"use client";
import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { useAdmin } from "./adminContext";

const LOCALHOST = "http://localhost:3100";

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
  setUser: React.Dispatch<React.SetStateAction<UserProps>>;
  loginApi: (user: UserProps) => Promise<void>;
  // accessToken: any;
  // login: (token: string, RefreshToken: string, role: string) => void;
  // logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps>({
    email: "",
    password: "",
  });
  const [accessToken, setAccessToken] = useState("");

  const loginApi = async (user: UserProps) => {
    try {
      console.log("user email:", user.email, "password:", user.password);
      // const response = await axios.post(`${LOCALHOST}/auth/login`, {
      const response = await axios.post(
        "http://localhost:3100/api/auth/login",
        {
          email: user.email,
          password: user.password,
        }
      );

      console.log("response", response.data);

      if (
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        setAccessToken(response.data.accessToken);
      } else {
        throw new Error("Login Failed");
      }
      console.log("response:: ", response);
    } catch (error) {
      throw new Error("Incorrect username or password. Please try again.");
    } finally {
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginApi }}>
      {children}
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
