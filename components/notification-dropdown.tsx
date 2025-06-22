"use client";
import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  Notification,
  getUnreadNotificationCount,
} from "@/app/(api)/notification_api";
import { Bell, BellDot } from "lucide-react";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  //   useEffect(() => {
  //     fetchUnreadCount();
  //   }, []);

  //   const fetchUnreadCount = async () => {
  //     const count = await getUnreadNotificationCount();
  //     setUnreadCount(count);
  //   };

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  //   const handleMarkAsRead = async (id: string) => {
  //     await markNotificationAsRead(id);
  //     await fetchUnreadCount();
  //     setNotifications((prev) =>
  //       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  //     );
  //   };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative">
        <BellDot className="w-6 h-6" color="blue" />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-3 z-50 max-h-96 overflow-auto">
          <h3 className="text-sm font-semibold mb-2">Notifications</h3>
          {notifications.length === 0 && (
            <div className="text-gray-500 text-sm">No notifications.</div>
          )}
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-2 rounded hover:bg-gray-100 cursor-pointer ${
                !notif.read ? "bg-blue-50" : ""
              }`}
              //   onClick={() => handleMarkAsRead(notif.id)}
            >
              <div className="text-sm">{notif.message}</div>
              <div className="text-xs text-gray-500">
                {new Date(notif.sentAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
