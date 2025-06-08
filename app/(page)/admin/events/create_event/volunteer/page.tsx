"use client";

import { CalendarDays, CloudUpload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../(components)/Header";
import { createVolunteerEvent } from "@/app/(api)/volunteers_api";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [volunteerDescription, setVolunteerDescription] = useState("");
  const [requirementDescription, setRequirementDescription] = useState("");
  const [address, setAddress] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [toggleDate, setToggleDate] = useState(false);

  const user = "Jeffrey Zin";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !title
      // !selectedDate ||
      // !address
    ) {
      alert(`Please fill in the required field: ${title}`);
      return;
    } else if (!volunteerDescription) {
      alert(`Please fill in the required field: ${volunteerDescription}`);
      return;
    } else if (!!requirementDescription) {
      alert(`Please fill in the required field: ${!requirementDescription}`);
      return;
    }
    try {
      const payload = {
        // title,
        // dateTime: selectedDate.toISOString(),
        whyVolunteer: volunteerDescription,
        cvPath: "cvPath",
        // requirement: requirementDescription,
        // address,
        // fileName: uploadedFile?.name || "",
      };

      await createVolunteerEvent(payload);
      alert("Volunteer event published successfully!");
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert("Conflict: You have already Volunteered for this Event");
      } else {
        alert("Failed to submit volunteer event.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col gap-6 mb-40">
      <Header />

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
        <CloudUpload />
        <p className="font-medium mt-2">Choose a file or drag & drop it here</p>
        <p className="text-gray-400 text-sm mb-4">
          JPEG, PNG, PDF, and MP4 formats, up to 50MB
        </p>

        <input
          type="file"
          accept="image/*,video/mp4,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="px-4 py-2 border rounded-lg text-black hover:bg-gray-100 cursor-pointer"
        >
          Browse File
        </label>

        {filePreview && (
          <img
            src={filePreview}
            alt="Preview"
            className="mt-4 max-h-40 rounded"
          />
        )}
        {uploadedFile && !filePreview && (
          <p className="text-sm mt-2 text-green-600">{uploadedFile.name}</p>
        )}
      </div>

      {/* Event Title and Date */}
      <div className="flex flex-col gap-4">
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

      {/* Hosted By */}
      <div className="flex items-start gap-6">
        <div className="text-xl font-semibold mt-[0.5rem]">Hosted By</div>
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" width={80} height={20} />
          <div className="flex flex-col gap-1">
            <p>{user}</p>
            <button className="bg-[#7769F7] text-xs text-white px-6 py-1 rounded-sm">
              Like
            </button>
          </div>
        </div>
      </div>

      {/* Volunteer Description */}
      <div>
        <p className="text-xl font-semibold mb-2">Why Volunteer?</p>
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
        <p className="text-xl font-semibold mb-2">Requirements</p>
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
        <button className="px-6 py-2 rounded-xl border bg-white border-gray-400 text-black hover:bg-gray-100">
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
