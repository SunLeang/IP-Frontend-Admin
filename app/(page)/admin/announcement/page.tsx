"use client";
import React, { useState } from "react";
import { Edit, Trash2, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  AnnouncementProps,
  getAnnouncementsByEventId,
} from "@/app/(api)/announcements_api";
import Link from "next/link";
import AnnouncementList from "./(components)/AnnouncementList";

export default function page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncementsByEventId,
    select: (res) => res,
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    date: "",
    title: "",
    description: "",
    image: "",
    event: "",
  });

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.description) {
      const announcement = {
        id: Date.now(),
        ...newAnnouncement,
        date:
          newAnnouncement.date ||
          new Date()
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
            .toUpperCase(),
      };
      // setAnnouncements([...announcements, announcement]);
      setNewAnnouncement({
        date: "",
        title: "",
        description: "",
        image: "",
        event: "",
      });
    }
  };

  // const handleDeleteAnnouncement = (id: number) => {
  //   setAnnouncements(announcements.filter((ann) => ann.id !== id));
  // };

  return (
    <div className="flex h-screen ">
      <div className="flex-1 overflow-auto bg-gray-100 w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Announcement
            </h1>
            <Link
              className="px-6 py-2 bg-white text-blue-600 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-semibold"
              href="http://localhost:3000/admin/announcement/create_announcement"
            >
              Create Announcement
            </Link>
          </div>
          <AnnouncementList data={data || []} />
          {data && data.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No announcements yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first announcement to get started.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Announcement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
