// components/AnnouncementList.tsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { AnnouncementProps } from "@/app/(api)/announcements_api";

interface AnnouncementListProps {
  data: AnnouncementProps[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void; // optional edit support
}

export default function AnnouncementList({
  data,
  onDelete,
  onEdit,
}: AnnouncementListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data?.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Date: </span>
              {announcement.date}
            </div>
            <div className="flex gap-2">
              <button
                aria-label="Edit Announcement"
                className="text-gray-400 hover:text-blue-600"
                onClick={() => onEdit?.(announcement.id)}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                aria-label="Delete Announcement"
                className="text-gray-400 hover:text-red-600"
                onClick={() => onDelete?.(announcement.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full h-40 bg-gray-100">
            <img
              src={
                announcement.image?.startsWith("http")
                  ? announcement.image
                  : `/assets/images/${announcement.image}`
              }
              alt={announcement.title}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/300x180";
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="text-base font-semibold mb-1 line-clamp-2">
              {announcement.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {announcement.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
