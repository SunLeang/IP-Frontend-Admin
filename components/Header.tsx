"use client";
import { useAdmin } from "@/app/hooks/AdminContext";
import {
  ChevronDown,
  Menu,
  PanelLeft,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getProfile, ProfileProps } from "@/app/(api)/profile_api";
import NotificationDropdown from "./notification-dropdown";

export default function Header() {
  const { isActiveSidebar, setIsActiveSidebar } = useAdmin();
  const [search, setSearch] = useState("");

  const [user, setUser] = useState<ProfileProps | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, []);

  // const user = {
  //   name: "Wathrak",
  //   email: "wathrak1@gmail.com",
  //   role: "Admin",
  // };

  return (
    <div className="bg-white h-16 flex justify-start items-center gap-4">
      <div className={`${isActiveSidebar ? "block" : "hidden"} min-w-64`}>
        <h1 className="text-2xl font-bold text-primaryblue text-center">
          <Link href={"/"}>Eventura</Link>
        </h1>
      </div>

      <div className="w-full flex justify-between items-center gap-4 p-2">
        <div className="flex justify-center items-center gap-4">
          <Menu
            className="mx-2"
            color="gray"
            onClick={() => {
              setIsActiveSidebar(!isActiveSidebar);
            }}
          />

          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-72 rounded-xl bg-gray-100"
          />
        </div>

        <div className="flex justify-center items-center gap-6">
          <div className="ml-auto flex items-center space-x-4 mt-2">
            <NotificationDropdown />
          </div>
          <div className="w-7">
            <img src="/GBR.svg" alt="eng-flag" className="rounded-sm" />
          </div>

          <div className="flex justify-center items-center gap-1">
            <p className="text-gray-600">English</p>
            <ChevronDown size={16} />
          </div>

          <Avatar className="border rounded-full">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-center">
            <div className="font-semibold">{user?.username}</div>
            <div className="text-gray-600 text-sm">{user?.systemRole}</div>
          </div>

          <button className="w-5 h-5 mr-4 flex justify-center items-center border border-black rounded-full">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
