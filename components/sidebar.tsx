"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Heart,
  Settings,
  Power,
  ChevronDown,
  MessagesSquare,
  Grid2X2,
  CircleGauge,
  UserCogIcon,
  UserSquare2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/app/hooks/AdminContext";
import { useAuth } from "@/app/hooks/AuthContext";
import LogoutAlert from "./logout-alert";
import { useRolePrefix } from "@/app/hooks/RolePrefix";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const rolePrefix = useRolePrefix();
  const searchParams = useSearchParams();

  const { logoutApi, isAuthReady, isAuthenticated, user } = useAuth();
  const { isActiveSidebar } = useAdmin();

  const [mounted, setMounted] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActiveTab = (href: string) => pathname.startsWith(href);

  const handleLogout = () => {
    logoutApi();
    setIsLogoutOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = useMemo(() => {
    const items = [
      {
        label: "Dashboard",
        icon: <CircleGauge className="w-5 h-5" />,
        href: `/${rolePrefix}/dashboard`,
      },
      {
        label: "Event",
        icon: <Grid2X2 className="w-5 h-5" />,
        href: `/${rolePrefix}/events`,
      },
      {
        label: "Volunteer",
        icon: <Heart className="w-5 h-5" />,
        href: `/${rolePrefix}/volunteer`,
      },
      {
        label: "Announcement",
        icon: <MessagesSquare className="w-5 h-5" />,
        href: `/${rolePrefix}/announcement`,
      },
    ];

    if (rolePrefix === "superAdmin") {
      items.push({
        label: "Organizer",
        icon: <UserSquare2 className="w-5 h-5" />,
        href: `/${rolePrefix}/organizer`,
      });
    }

    return items;
  }, [rolePrefix]);

  if (!mounted || !pathname) return null;

  if (!isAuthReady || !isAuthenticated) return <div>Loading...</div>;

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
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md w-full transition-colors ${
                  isActiveTab(item.href)
                    ? "bg-primaryblue text-white"
                    : "bg-white text-black hover:bg-blue-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            <div className="space-y-2">
              {/* Settings Dropdown Button */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center justify-between gap-2 px-4 py-2 rounded-md w-full transition-colors ${
                  pathname.startsWith(`/${rolePrefix}/settings`)
                    ? "bg-primaryblue text-white"
                    : "bg-white text-black hover:bg-blue-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Links */}
              {isDropdownOpen && (
                <div className="ml-6 space-y-1">
                  <Link
                    href={`/${rolePrefix}/settings?tab=account`}
                    className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                      pathname === `/${rolePrefix}/settings` &&
                      searchParams.get("tab") === "account"
                        ? "bg-primaryblue text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    Account
                  </Link>

                  <Link
                    href={`/${rolePrefix}/settings?tab=email`}
                    className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                      pathname === `/${rolePrefix}/settings` &&
                      searchParams.get("tab") === "email"
                        ? "bg-primaryblue text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    Email
                  </Link>

                  <Link
                    href={`/${rolePrefix}/settings?tab=password`}
                    className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                      pathname === `/${rolePrefix}/settings` &&
                      searchParams.get("tab") === "password"
                        ? "bg-primaryblue text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    Password
                  </Link>
                </div>
              )}

              {/* Logout button (unchanged) */}
              <button
                onClick={() => setIsLogoutOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-md w-full text-left transition-colors bg-white text-black hover:bg-red-100"
              >
                <Power className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 text-gray-500 font-semibold w-10 h-10 flex items-center justify-center rounded-full">
              {(user?.username?.[0] ?? "").toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
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
}
