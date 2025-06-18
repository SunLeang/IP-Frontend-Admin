("use client");
import { redirect } from "next/navigation";
import { useRolePrefix } from "@/app/hooks/RolePrefix";

export default function Home() {
  const rolePrefix = useRolePrefix();

  if (!rolePrefix) {
    return <div>Loading...</div>;
  }

  redirect(`/${rolePrefix}/dashboard`);
}
