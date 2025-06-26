// app/admin/announcement/create_announcement/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ImageUpload from "@/components/ImageUpload";
import { createAnnouncement } from "@/app/(api)/announcements_api";
import { getEventsByOrganizerId, EventProps } from "@/app/(api)/events_api";

export default function CreateAnnouncement() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
    event: "",
  });

  const [image, setImage] = useState<string | null>(null);
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
        image: image || "default-announcement.png",
        eventId: announcement.event,
      };

      await createAnnouncement(payload);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      alert("Announcement created successfully!");
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
        const { data } = await getEventsByOrganizerId();
        setEvents(data);

        if (data.length === 0) {
          console.warn("No events found for this admin");
        }
      } catch (err) {
        console.error("Failed to load admin's events", err);
        alert("Failed to load your events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your events...</p>
        </div>
      </div>
    );
  }

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
          Create Announcement
        </h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Event selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select an Event *
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={announcement.event}
              onChange={(e) =>
                setAnnouncement({ ...announcement, event: e.target.value })
              }
            >
              <option value="">Choose an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            {events.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ You need to create at least one event before making
                announcements.
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter announcement title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={announcement.title}
              onChange={(e) =>
                setAnnouncement({ ...announcement, title: e.target.value })
              }
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Image (Optional)
            </label>
            <ImageUpload
              value={image}
              onChange={setImage}
              folder="announcements"
              placeholder="Upload announcement image"
              maxSize={5}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Describe the announcement..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={6}
              value={announcement.description}
              onChange={(e) =>
                setAnnouncement({
                  ...announcement,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={isSubmitting || events.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
