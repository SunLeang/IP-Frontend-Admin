import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar";
import Header from "@/components/Header";
import AdminProvider from "./context/adminContext";

export const metadata: Metadata = {
  title: "Eventura",
  description: "Login to your Eventura account",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen">
        <AdminProvider>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="w-full p-4 overflow-auto">{children}</main>
            </div>
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}
