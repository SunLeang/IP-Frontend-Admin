import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "./AuthContext";

export function useRolePrefix() {
  const pathname = usePathname();
  const { user, isAuthReady } = useAuth();

  const roleToPrefixMap: Record<string, string> = {
    SUPER_ADMIN: "superAdmin",
    ADMIN: "admin",
  };

  if (!isAuthReady) {
    return null;
  }

  if (!user?.systemRole) {
    console.warn("User role is missing even though auth is ready.");
    return null;
  }

  // console.log("role:" + user.systemRole);

  return useMemo(() => {
    const parts = pathname?.split("/") ?? [];
    const prefixFromPath = parts[1];

    const userPrefix = user?.systemRole
      ? roleToPrefixMap[user.systemRole]
      : null;

    const validPrefixes = userPrefix ? [userPrefix] : ["admin"];

    if (validPrefixes.includes(prefixFromPath)) {
      return prefixFromPath;
    }

    return userPrefix ?? "admin";
  }, [pathname, user]);
}
