"use client";
import AdminProvider from "@/app/context/adminContext";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="w-full p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
