"use client";
import { useAuth } from "@/app/hooks/AuthContext";
import { useRolePrefix } from "@/app/hooks/RolePrefix";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const rolePrefix = useRolePrefix();
  const isAuthenticated = useAuth();

  if (!rolePrefix) {
    return <div>Loading...</div>;
  }

  redirect(`/${rolePrefix}/dashboard`);
}
