"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthReady, user } = useAuth();

  useEffect(() => {
    if (!isAuthReady) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user?.systemRole)) {
      router.replace("/unauthorized");
    }
  }, [isAuthReady, isAuthenticated, user, allowedRoles, router]);

  if (!isAuthReady || !isAuthenticated) return null;

  if (allowedRoles && !allowedRoles.includes(user?.systemRole)) return null;

  return <>{children}</>;
}
