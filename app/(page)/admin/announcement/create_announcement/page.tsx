// app/admin/announcement/create_announcement/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CloudUpload } from "lucide-react";
import { createAnnouncement } from "@/app/(api)/announcements_api";
import { getEvents } from "@/app/(api)/events_api";
import { EventProps } from "@/app/(api)/events_api";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateAnnouncement() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [announcement, setAnnouncement] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    description: "",
    image: "",
    event: "",
  });

  const [events, setEvents] = useState<EventProps[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePublish = async () => {
    if (
      !announcement.title ||
      !announcement.description ||
      !announcement.event
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: announcement.title,
        description: announcement.description,
        image: announcement.image || "songkran.png",
        eventId: announcement.event,
      };
      await createAnnouncement(payload);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      router.push("/admin/announcement");
    } catch (error) {
      console.error("Failed to create announcement", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          Publish Announcement
        </h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Event selection */}
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={announcement.event}
            onChange={(e) =>
              setAnnouncement({ ...announcement, event: e.target.value })
            }
          >
            <option value="">Select an Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>

          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={announcement.title}
            onChange={(e) =>
              setAnnouncement({ ...announcement, title: e.target.value })
            }
          />

          {/* Image upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
            <CloudUpload className="mx-auto mb-4 w-10 h-10 text-gray-500" />
            <p className="mb-2">Drag and drop or select a file</p>
            <button
              className="px-4 py-2 border rounded-md"
              onClick={() =>
                setAnnouncement({
                  ...announcement,
                  image: "songkran.png",
                })
              }
            >
              Upload Image
            </button>
          </div>

          {/* Description */}
          <textarea
            placeholder="Describe the announcement..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            rows={6}
            value={announcement.description}
            onChange={(e) =>
              setAnnouncement({ ...announcement, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
