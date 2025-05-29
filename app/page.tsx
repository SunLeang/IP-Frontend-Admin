"use client";
import { useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
// import Dashboard from "../components/dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    // return <Dashboard />;
  }

  redirect("/admin/dashboard");
}
