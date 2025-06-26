"use client";

import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import { createEvent } from "@/app/(api)/events_api";
import { getEventCategories, EventCategory } from "@/app/(api)/categories_api";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [acceptingVolunteers, setAcceptingVolunteers] = useState(false);
  const [categories, setCategories] = useState<EventCategory[]>([]);

  // Image state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getEventCategories();
        setCategories(result);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        alert("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handlePublish = async () => {
    // Validation
    if (!title || !address || !description || !selectedDate || !categoryId) {
      const missingFields: string[] = [];

      if (!title) missingFields.push("Title");
      if (!address) missingFields.push("Location/Address");
      if (!description) missingFields.push("Description");
      if (!selectedDate) missingFields.push("Date and Time");
      if (!categoryId) missingFields.push("Category");

      alert(
        `Please fill out the following field(s):\n- ${missingFields.join(
          "\n- "
        )}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: title,
        description,
        dateTime: selectedDate.toISOString(),
        locationDesc: address,
        locationImage: locationImage || "",
        profileImage: profileImage || "",
        coverImage: coverImage || "",
        status,
        categoryId,
        acceptingVolunteers,
      };

      const result = await createEvent(payload);
      alert(
        `Event "${result.name}" ${
          status === "PUBLISHED" ? "Published" : "Saved as Draft"
        } Successfully!`
      );

      // Redirect to events list
      router.push("/admin/events");
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600">
          Fill in the details to create your event
        </p>
      </div>

      {/* Profile Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Profile Image</h2>
        <ImageUpload
          value={profileImage}
          onChange={setProfileImage}
          folder="events/profiles"
          placeholder="Upload event profile image"
        />
      </div>

      {/* Cover Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Cover Image</h2>
        <ImageUpload
          value={coverImage}
          onChange={setCoverImage}
          folder="events/covers"
          placeholder="Upload event cover image"
        />
      </div>

      {/* Location Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Location Image</h2>
        <ImageUpload
          value={locationImage}
          onChange={setLocationImage}
          folder="events/locations"
          placeholder="Upload location image"
        />
      </div>

      {/* Event Details */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-lg font-semibold">Event Details</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            placeholder="Enter event title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date and Time *
          </label>
          <input
            type="datetime-local"
            value={selectedDate?.toISOString().slice(0, 16)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            placeholder="Enter event location"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Accepting Volunteers */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="acceptingVolunteers"
            checked={acceptingVolunteers}
            onChange={(e) => setAcceptingVolunteers(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="acceptingVolunteers"
            className="text-sm font-medium text-gray-700"
          >
            Accept volunteer applications
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            rows={6}
            placeholder="Describe your event..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting
              ? "Creating..."
              : status === "PUBLISHED"
              ? "Publish Event"
              : "Save as Draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
