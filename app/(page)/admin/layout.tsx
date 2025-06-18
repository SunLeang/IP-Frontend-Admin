"use client";
import AdminProvider from "@/app/hooks/AdminContext";
import { AuthProvider } from "@/app/hooks/AuthContext";
import AuthGuard from "@/app/hooks/AuthGuard";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="w-full p-4 overflow-auto">
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </main>
          </div>
        </div>
      </AdminProvider>
    </AuthGuard>
  );
}
