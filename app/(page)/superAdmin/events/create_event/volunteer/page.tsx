"use client";

import { CalendarDays, CloudUpload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../(components)/Header";
import { createVolunteerEvent } from "@/app/(api)/volunteers_api";
import ImageUpload from "@/components/ImageUpload";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [volunteerDescription, setVolunteerDescription] = useState("");
  const [requirementDescription, setRequirementDescription] = useState("");
  const [address, setAddress] = useState("");
  const [toggleDate, setToggleDate] = useState(false);
  const [eventId, setEventId] = useState("");

  // Use proper CV file management
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [additionalImage, setAdditionalImage] = useState<string | null>(null);

  const user = "Jeffrey Zin";

  const handleSubmit = async () => {
    if (!title) {
      alert(`Please fill in the required field: Title`);
      return;
    } else if (!volunteerDescription) {
      alert(`Please fill in the required field: Why Volunteer?`);
      return;
    } else if (!requirementDescription) {
      alert(`Please fill in the required field: Requirements`);
      return;
    } else if (!eventId) {
      alert(`Please fill in the required field: Event ID`);
      return;
    }

    try {
      const payload = {
        eventId,
        whyVolunteer: volunteerDescription,
        cvPath: cvFile || "default-cv.pdf",
      };

      await createVolunteerEvent(payload);
      alert("Volunteer event published successfully!");

      // Reset form
      setTitle("");
      setVolunteerDescription("");
      setRequirementDescription("");
      setAddress("");
      setEventId("");
      setCvFile(null);
      setAdditionalImage(null);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert("Conflict: You have already Volunteered for this Event");
      } else if (error.response && error.response.status === 403) {
        alert(
          "Only users with ATTENDEE role can apply for volunteer positions."
        );
      } else {
        alert("Failed to submit volunteer event.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col gap-6 mb-40">
      <Header />

      {/* File Upload Sections */}
      <div className="space-y-6">
        {/* CV Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">CV/Resume Upload</h3>
          <ImageUpload
            value={cvFile}
            onChange={setCvFile}
            folder="volunteers/cv"
            maxSize={10}
            accept=".pdf,.doc,.docx,image/*"
            placeholder="Upload your CV/Resume (PDF, DOC, or Image)"
            className="w-full max-w-2xl"
          />
        </div>

        {/* Additional Supporting Image */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Additional Supporting Image (Optional)
          </h3>
          <ImageUpload
            value={additionalImage}
            onChange={setAdditionalImage}
            folder="volunteers/images"
            maxSize={5}
            placeholder="Upload any additional supporting image"
            className="w-full max-w-xl"
          />
        </div>
      </div>

      {/* Event ID Input */}
      <div>
        <p className="text-xl font-semibold mb-2">Event ID *</p>
        <input
          type="text"
          placeholder="Enter Event ID"
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
      </div>

      {/* Event Title and Date */}
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold mb-2">Event Title *</p>
        <input
          type="text"
          placeholder="Event Title"
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <p className="text-xl font-semibold mb-2">Date and Time</p>
          <button
            onClick={() => setToggleDate(!toggleDate)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <CalendarDays />
            {toggleDate ? "Hide Picker" : "Choose Date & Time"}
          </button>

          {toggleDate && (
            <div className="mt-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="dd/MM/yyyy h:mm aa"
                className="px-4 py-2 border border-gray-300 rounded-md"
                withPortal
              />
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Description */}
      <div>
        <p className="text-xl font-semibold mb-2">Why Volunteer? *</p>
        <textarea
          rows={4}
          placeholder="Describe why you want to volunteer."
          className="w-full max-w-4xl px-4 py-3 border border-gray-300 rounded-md"
          value={volunteerDescription}
          onChange={(e) => setVolunteerDescription(e.target.value)}
        />
      </div>

      {/* Requirements */}
      <div>
        <p className="text-xl font-semibold mb-2">Requirements *</p>
        <textarea
          rows={4}
          placeholder="Describe any requirements or important details."
          className="w-full max-w-4xl px-4 py-3 border border-gray-300 rounded-md"
          value={requirementDescription}
          onChange={(e) => setRequirementDescription(e.target.value)}
        />
      </div>

      {/* Location */}
      <div>
        <p className="text-xl font-semibold mb-2">Location</p>
        <input
          type="text"
          placeholder="Input Address"
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mt-4">
        <button
          onClick={() => {
            // Reset form
            setTitle("");
            setVolunteerDescription("");
            setRequirementDescription("");
            setAddress("");
            setEventId("");
            setCvFile(null);
            setAdditionalImage(null);
          }}
          className="px-6 py-2 rounded-xl border bg-white border-gray-400 text-black hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
        >
          Publish Event
        </button>
      </div>
    </div>
  );
}
