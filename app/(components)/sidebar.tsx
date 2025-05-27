"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Megaphone,
  Settings,
  Power,
  ChevronDown,
  MessagesSquare,
  Grid2X2,
  CircleGauge,
  Rows2,
  Rows3,
  PanelLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type SidebarProps = {
  children?: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
};

const navItems = [
  {
    label: "Dashboard",
    icon: <CircleGauge className="w-5 h-5" />,
    href: "/",
  },
  { label: "Event", icon: <Grid2X2 className="w-5 h-5" />, href: "/events" },
  {
    label: "Volunteer",
    icon: <Heart className="w-5 h-5" />,
    href: "/volunteer",
  },
  {
    label: "Announcement",
    icon: <MessagesSquare className="w-5 h-5" />,
    href: "/announcement",
  },
];

const settingsItems = [
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
  { label: "Logout", icon: <Power className="w-5 h-5" />, href: "/logout" },
];

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {
  const [mounted, setMounted] = useState(false);
  const [isActiveSidebar, setIsActiveSidebar] = useState(false);
  const pathname = usePathname();

  const isActiveTab = (href: string) => pathname === href;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !pathname) return null;

  return (
    <div className="flex h-screen bg-white">
      <div
        className={`w-64 bg-white flex flex-col border-r border-gray-200 p-4 justify-between ${
          isActiveSidebar ? "block" : "hidden"
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold text-primaryblue text-center mb-4">
            Eventura
          </h1>
          <hr className="mb-4" />

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
            {settingsItems.map((item) => (
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

      <div className="bg-white relative flex flex-col w-fit h-fit p-1 mt-4 ml-4 rounded-lg">
        <PanelLeft onClick={() => setIsActiveSidebar(!isActiveSidebar)} />
      </div>

      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};

export default Sidebar;
