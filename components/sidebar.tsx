"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  Settings,
  Power,
  ChevronDown,
  MessagesSquare,
  Grid2X2,
  CircleGauge,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/app/context/adminContext";
import LogoutAlert from "./logout-alert";

type SidebarProps = {
  children?: React.ReactNode;
};

const navItems = [
  {
    label: "Dashboard",
    icon: <CircleGauge className="w-5 h-5" />,
    href: "/admin/dashboard",
  },
  {
    label: "Event",
    icon: <Grid2X2 className="w-5 h-5" />,
    href: "/admin/events",
  },
  {
    label: "Volunteer",
    icon: <Heart className="w-5 h-5" />,
    href: "/admin/volunteer",
  },
  {
    label: "Announcement",
    icon: <MessagesSquare className="w-5 h-5" />,
    href: "/admin/announcement",
  },
];

const settingsItems = [
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/admin/settings",
  },
  {
    label: "Logout",
    icon: <Power className="w-5 h-5" />,
    action: "logout",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const { user, isActiveSidebar, setIsActiveSidebar } = useAdmin();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveTab = (href: string) =>
    pathname === href || pathname.startsWith("admin" + href + "/");

  const handleLogout = () => {
    setIsLogoutOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !pathname) return null;

  return (
    <div className="flex bg-white">
      <div
        className={`w-64 bg-white flex flex-col border-r border-gray-200 p-4 justify-between ${
          isActiveSidebar ? "block" : "hidden"
        }`}
      >
        <div>
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-md w-full transition-colors
                ${
                  isActiveTab(item.href)
                    ? "bg-primaryblue text-white"
                    : "bg-white text-black hover:bg-blue-100"
                }
              `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            {settingsItems.map((item) =>
              item.href ? (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md w-full transition-colors
        ${
          isActiveTab(item.href)
            ? "bg-primaryblue text-white"
            : "bg-white text-black hover:bg-blue-100"
        }
      `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : item.action === "logout" ? (
                <button
                  key={item.label}
                  onClick={() => setIsLogoutOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md w-full text-left transition-colors bg-white text-black hover:bg-red-100"
                >
                  {item.icon}
                  {item.label}
                </button>
              ) : null
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 text-gray-500 font-semibold w-10 h-10 flex items-center justify-center rounded-full">
              {user.name[0]}
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>
      <LogoutAlert
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Sidebar;
