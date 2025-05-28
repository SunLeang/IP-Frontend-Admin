"use client";
import { useAdmin } from "@/app/context/adminContext";
import { Bell, BellDot, PanelLeft } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";

export default function Header() {
  const { isActiveSidebar, setIsActiveSidebar } = useAdmin();
  const [search, setSearch] = useState("");

  return (
    <div className="h-16 flex justify-start items-center gap-4 bg-white">
      <div className="w-64">
        <h1 className="text-2xl font-bold text-primaryblue text-center">
          Eventura
        </h1>
      </div>
      <div className="bg-white flex items-center gap-4 w-fit h-fit p-1 rounded-lg">
        <PanelLeft onClick={() => setIsActiveSidebar(!isActiveSidebar)} />

        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="w-48 rounded-xl"
        />

        <BellDot color="blue" />
      </div>
    </div>
  );
}
