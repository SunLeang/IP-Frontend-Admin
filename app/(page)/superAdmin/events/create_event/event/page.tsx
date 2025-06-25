"use client";

import { CalendarDays, Clock, CloudUpload, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../(components)/Header";
import { createEvent } from "@/app/(api)/events_api";
import { EventCategory, getEventCategories } from "@/app/(api)/categories_api";
import ImageUpload from "@/components/ImageUpload";

export default function CreateEventPage() {
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [toggleDate, setToggleDate] = useState<boolean>(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [acceptingVolunteers, setAcceptingVolunteers] = useState(false);
  const [categories, setCategories] = useState<EventCategory[]>([]);

  // Use proper image state management
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);

  const user = "Jeffrey Zin";

  const handlePublish = async () => {
    if (!title || !address || !description || !selectedDate || !categoryId) {
      const missingFields: string[] = [];

      if (!title) missingFields.push("Title");
      if (!address) missingFields.push("Location/Address");
      if (!description) missingFields.push("Description");
      if (!selectedDate) missingFields.push("Date and Time");
      if (!categoryId) missingFields.push("Category");

      if (missingFields.length > 0) {
        alert(
          `Please fill out the following field(s):\n- ${missingFields.join(
            "\n- "
          )}`
        );
        return;
      }

      return;
    }

    try {
      const payload = {
        name: title,
        description,
        dateTime: selectedDate.toISOString(),
        locationDesc: address,
        locationImage: locationImage || "default-location.jpg",
        profileImage: profileImage || "default-profile.jpg",
        coverImage: coverImage || "default-cover.jpg",
        status,
        categoryId,
        acceptingVolunteers,
      };

      const result = await createEvent(payload);
      alert(`Event "${result.name}" Published Successfully!`);
      console.log("Created event:", result);

      // Reset form
      setTitle("");
      setDescription("");
      setAddress("");
      setSelectedDate(new Date());
      setCategoryId("");
      setCoverImage(null);
      setProfileImage(null);
      setLocationImage(null);
      setAcceptingVolunteers(false);
      setStatus("DRAFT");
    } catch (error) {
      alert("Failed to publish event. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getEventCategories();
        setCategories(result);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col gap-2 mb-40">
      <Header />

      {/* Multiple Image Upload Sections */}
      <div className="space-y-6">
        {/* Cover Image Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Cover Image</h3>
          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            folder="events/covers"
            maxSize={10}
            placeholder="Upload cover image for the event"
            className="w-full max-w-2xl"
          />
        </div>

        {/* Profile Image Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile Image</h3>
          <ImageUpload
            value={profileImage}
            onChange={setProfileImage}
            folder="events/profiles"
            maxSize={5}
            placeholder="Upload profile image for the event"
            className="w-full max-w-xl"
          />
        </div>

        {/* Location Image Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Location Image</h3>
          <ImageUpload
            value={locationImage}
            onChange={setLocationImage}
            folder="events/locations"
            maxSize={5}
            placeholder="Upload location image"
            className="w-full max-w-xl"
          />
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-between">
        <div className="flex flex-col mb-4 mx-2 gap-2">
          <h4 className="text-xl font-semibold">Title</h4>
          <input
            type="text"
            placeholder="Input Title"
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button className="h-10 w-10 flex justify-center items-center bg-black border border-gray-800 rounded-full">
          <Pencil color="white" />
        </button>
      </div>

      {/* Status Dropdown */}
      <div className="flex flex-col ml-2 max-w-xs">
        <label className="text-xl font-semibold mb-2">Event Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-400"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {/* Select Category */}
      <div className="flex flex-col ml-2 max-w-xs">
        <label className="text-xl font-semibold mb-2">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-400"
        >
          <option value="">Select a category</option>
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>
      </div>

      {/* Accepting Volunteers Toggle */}
      <div className="flex items-center ml-2 my-4 gap-3">
        <label className="text-xl font-semibold">Accepting Volunteers</label>
        <input
          type="checkbox"
          checked={acceptingVolunteers}
          onChange={(e) => setAcceptingVolunteers(e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      {/* Date and Time */}
      <div className="flex flex-col gap-4 ml-2 my-4">
        <p className="text-xl font-semibold">Date and Time</p>
        <div className="flex items-center gap-3">
          <CalendarDays />
          <button
            className="text-sm text-blue-600 underline"
            onClick={() => setToggleDate(!toggleDate)}
          >
            {selectedDate
              ? selectedDate.toLocaleString()
              : "Choose Date & Time"}
          </button>
        </div>
        {toggleDate && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date || null)}
            showTimeSelect
            dateFormat="dd/MM/yyyy h:mm aa"
            className="border rounded-md p-2"
            timeIntervals={15}
          />
        )}
        <div className="ml-4 text-[#7769F7]">+ Add to Calendar</div>
      </div>

      {/* Location */}
      <div className="flex flex-col ml-2 mb-6">
        <p className="text-xl font-semibold mb-2">Location</p>
        <input
          type="text"
          placeholder="Input Address"
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Event Description</p>
        <textarea
          rows={6}
          placeholder="Describe your event..."
          className="w-full max-w-4xl px-4 py-3 border border-gray-300 rounded-md mb-6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => {
            // Reset form
            setTitle("");
            setDescription("");
            setAddress("");
            setSelectedDate(new Date());
            setCategoryId("");
            setCoverImage(null);
            setProfileImage(null);
            setLocationImage(null);
            setAcceptingVolunteers(false);
            setStatus("DRAFT");
          }}
          className="px-6 py-1 rounded-xl border bg-white border-gray-400 text-black hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-1 rounded-xl bg-green-500 text-white hover:bg-green-600"
        >
          Publish Event
        </button>
      </div>
    </div>
  );
}
