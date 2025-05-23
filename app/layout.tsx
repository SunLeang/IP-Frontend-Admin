import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./(components)/sidebar";

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
      <body>
        <Sidebar
          user={{
            name: "Wathrak",
            email: "wathrak1@gmail.com",
          }}
        >
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
