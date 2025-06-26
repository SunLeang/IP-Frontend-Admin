"use client";
import { redirect } from "next/navigation";
import { useRolePrefix } from "./hooks/RolePrefix";

export default function Home() {
  const rolePrefix = useRolePrefix();

  if (!localStorage.getItem("refreshToken")) {
    redirect("/login");
  }

  if (!rolePrefix) {
    return <div>Loading...</div>;
  }

  redirect(`/${rolePrefix}/dashboard`);
}
