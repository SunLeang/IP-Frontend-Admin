"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import {
  getAllAnnouncements,
  deleteAnnouncement,
} from "@/app/(api)/announcements_api";
import AnnouncementList from "./(components)/AnnouncementList";

export default function AnnouncementPage() {
  const queryClient = useQueryClient();

  const {
    data: announcements,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["announcements", "super-admin"],
    queryFn: getAllAnnouncements,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", "super-admin"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete announcement:", error);
      alert("Error deleting announcement. Please try again.");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 overflow-auto bg-gray-100 w-full">
          <div className="p-6">
            <div className="text-center py-12">
              <p>Loading all announcements...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 overflow-auto bg-gray-100 w-full">
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-red-500">
                Failed to load announcements. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto bg-gray-100 w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              All Announcements
            </h1>
            <Link
              href="/superAdmin/announcement/create_announcement"
              className="px-6 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 text-sm font-semibold"
            >
              Create Announcement
            </Link>
          </div>

          {announcements && announcements.length > 0 ? (
            <AnnouncementList data={announcements} onDelete={handleDelete} />
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No announcements yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create the first announcement to get started.
              </p>
              <Link
                href="/superAdmin/announcement/create_announcement"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Announcement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
