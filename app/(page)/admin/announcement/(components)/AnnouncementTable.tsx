"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  AnnouncementProps,
  deleteAnnouncement,
} from "@/app/(api)/announcements_api";

interface AnnouncementTableProps {
  announcements: AnnouncementProps[];
  onDeleteSuccess?: (id: string) => void;
}

export default function AnnouncementTable({
  announcements,
  onDeleteSuccess,
}: AnnouncementTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return announcements.filter((a) =>
      `${a.title} ${a.description}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [announcements, search]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(id);
      onDeleteSuccess?.(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <Input
          type="text"
          placeholder="Search announcements"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <table className="w-full table-auto border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">Title</th>
            <th className="py-2 px-3">Description</th>
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, index) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">{index + 1}</td>
              <td className="py-2 px-3">{item.title}</td>
              <td className="py-2 px-3 line-clamp-2">{item.description}</td>
              <td className="py-2 px-3">{item.date}</td>
              <td className="py-2 px-3">
                <button
                  className="text-blue-600 hover:underline mr-3"
                  onClick={() => alert("TODO: Handle Edit")}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No announcements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
