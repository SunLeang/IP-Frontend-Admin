"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname();

  const isCreateEvent = pathname.includes("/superAdmin/events/create_event");

  const links = isCreateEvent
    ? [
        { href: "/superAdmin/events/create_event/event", label: "Details" },
        {
          href: "/superAdmin/events/create_event/volunteer",
          label: "Volunteer",
        },
      ]
    : [
        { href: "/superAdmin/events/lists/events", label: "Details" },
        { href: "/superAdmin/events/lists/volunteers", label: "Volunteer" },
        { href: "/superAdmin/events/lists/attendees", label: "Attendee" },
      ];

  return (
    <div className="w-1/2 min-w-[430px] flex justify-center self-center gap-10 mb-6 bg-white rounded-3xl shadow-md py-2 px-20">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`self-center px-6 py-2 rounded-xl transition ${
              isActive
                ? "bg-primaryblue text-white"
                : "border-2 border-black text-black"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
