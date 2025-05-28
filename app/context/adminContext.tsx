"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AdminContextProps {
  isActiveSidebar: Boolean;
  setIsActiveSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

interface AdminProviderProps {
  children: React.ReactNode;
}

interface UserProps {
  name: string;
  email: string;
  role: string;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  const [user, setUser] = useState({
    name: "Wathrak",
    email: "wathrak1@gmail.com",
    role: "Admin",
  });
  const [isActiveSidebar, setIsActiveSidebar] = useState(true);

  return (
    <AdminContext.Provider
      value={{ user, isActiveSidebar, setIsActiveSidebar }}
    >
      {children}
    </AdminContext.Provider>
  );
}
