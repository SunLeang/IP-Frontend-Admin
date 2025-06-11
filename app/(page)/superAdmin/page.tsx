"use client";
import { useRolePrefix } from "@/app/hooks/RolePrefix";
import { redirect } from "next/navigation";

export default function Home() {
  const rolePrefix = useRolePrefix();

  if (!rolePrefix) {
    return <div>Loading...</div>;
  }

  redirect(`/${rolePrefix}/dashboard`);
}
