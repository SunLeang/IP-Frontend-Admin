"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

interface AdminContextProps {
  isActiveSidebar: Boolean;
  setIsActiveSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

interface AdminProviderProps {
  children: React.ReactNode;
}

interface UserProps {
  id?: string;
  email: string;
  username?: string;
  fullName?: string;
  password: string;
  systemRole: string;
  currentRole?: string;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within a UserProvider");
  }
  return context;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  const { user } = useAuth();
  const [isActiveSidebar, setIsActiveSidebar] = useState(true);

  return (
    <AdminContext.Provider
      value={{ user, isActiveSidebar, setIsActiveSidebar }}
    >
      {children}
    </AdminContext.Provider>
  );
}
