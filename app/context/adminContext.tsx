"use client";
import axios from "axios";
import { stringify } from "querystring";
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
  id?: string;
  email: string;
  username: string;
  fullName?: string;
  password: string;
  systemRole: string;
  currentRole?: string;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function useAdmin() {
  const [user, setUser] = useState();
  // const [id, setId] = useState("");
  // const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  // const [fullName, setFullName] = useState("");
  // const [systemRole, setSystemRole] = useState("");
  // const [currentRole, setCurrentRole] = useState("");
  // const [password, setPassword] = useState("");

  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default function AdminProvider({ children }: AdminProviderProps) {
  const [user, setUser] = useState({
    username: "Wathrak",
    email: "wathrak1@gmail.com",
    password: "123456",
    systemRole: "Admin",
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
