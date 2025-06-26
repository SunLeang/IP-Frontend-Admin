"use client";

import { redirect } from "next/navigation";
import { useRolePrefix } from "@/app/hooks/RolePrefix";
import { useAuth } from "@/app/hooks/AuthContext";
import { useEffect } from "react";

export default function SuperAdminPage() {
  const { user, loading } = useAuth(); // ✅ Now loading exists
  const rolePrefix = useRolePrefix();

  useEffect(() => {
    if (!loading) {
      if (!user || user.systemRole !== "SUPER_ADMIN") {
        redirect("/login");
      } else {
        // Redirect to super admin dashboard
        redirect(`${rolePrefix}/dashboard`);
      }
    }
  }, [user, loading, rolePrefix]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return null; // Will redirect before rendering
}
