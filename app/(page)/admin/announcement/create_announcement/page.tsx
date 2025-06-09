"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CloudUpload } from "lucide-react";
import { createAnnouncement } from "@/app/(api)/announcements_api";
import { EventProps, getEvents } from "@/app/(api)/events_api";

export default function CreateAnnouncement() {
  const router = useRouter();

  const [announcement, setAnnouncement] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    description: "",
    image: "",
    event: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  const handlePublish = async () => {
    if (
      !announcement.title ||
      !announcement.description
      // !announcement.image
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: announcement.title,
        description: announcement.description,
        // image: announcement.image,
        image: "summer.png",
        eventId: "b311733e-d5f8-4fe3-9b78-e51519553a0d",
      };

      const res = await createAnnouncement(payload);
      console.log("Announcement created:", res);
      router.push("/admin/announcement");
    } catch (error) {
      alert(`Error publishing announcement:, ${error}`);
    }
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          Publish Announcement
        </h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          <div>
            <select
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              value={announcement.event}
              onChange={(e) =>
                setAnnouncement({ ...announcement, event: e.target.value })
              }
            >
              <option value="" disabled>
                Select an Event
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={announcement.title}
              onChange={(e) =>
                setAnnouncement({ ...announcement, title: e.target.value })
              }
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <CloudUpload />
              </div>
              <p className="text-gray-900 font-medium mb-1">
                Choose a file or drag & drop it here
              </p>
              <p className="text-gray-500 text-sm mb-4">
                JPEG, PNG, PDF, and MP4 formats, up to 50MB
              </p>
              <button
                type="button"
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setAnnouncement({
                    ...announcement,
                    image:
                      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=180&fit=crop",
                  })
                }
              >
                Browse File
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Why Volunteer?</h3>
            <textarea
              placeholder="Describe what's special about your event & other important details."
              rows={8}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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

      <div className="flex justify-end gap-3 p-4 border-t rounded-lg border-gray-200 bg-gray-50">
        <button
          onClick={() => router.back()}
          className="px-8 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-60"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
