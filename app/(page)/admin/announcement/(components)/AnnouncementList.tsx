// components/AnnouncementList.tsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { AnnouncementProps } from "@/app/(api)/announcements_api";

interface AnnouncementListProps {
  data: AnnouncementProps[];
  onDelete?: (id: string) => void;
}

export default function AnnouncementList({
  data,
  onDelete,
}: AnnouncementListProps) {
  return (
    <div className="grid grid-cols-2 justify-center items-center">
      {data &&
        data.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md max-w-sm h-72"
          >
            <div className="p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Announcement:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {announcement.date}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(announcement.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {announcement.image && (
              <div className="w-full">
                <img
                  src={`/assets/images/${announcement.image}`}
                  alt="Announcement"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <h3 className="text-base font-semibold mb-2 leading-tight">
                {announcement.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {announcement.description}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
