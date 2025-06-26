import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "./AuthContext";

export function useRolePrefix() {
  const pathname = usePathname();
  const { user, isAuthReady } = useAuth();

  return useMemo(() => {
    if (!isAuthReady) return null;

    const roleToPrefixMap: Record<string, string> = {
      SUPER_ADMIN: "superAdmin",
      ADMIN: "admin",
    };

    if (!user?.systemRole) {
      console.warn("User role is missing even though auth is ready.");
      return null;
    }

    const parts = pathname?.split("/") ?? [];
    const prefixFromPath = parts[1];

    const userPrefix = roleToPrefixMap[user.systemRole] || "admin";

    const validPrefixes = [userPrefix];

    if (validPrefixes.includes(prefixFromPath)) {
      return prefixFromPath;
    }

    return userPrefix;
  }, [pathname, user, isAuthReady]);
}
