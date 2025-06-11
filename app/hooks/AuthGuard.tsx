"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useAuth();

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady || !isAuthenticated) return null;

  return <>{children}</>;
}
