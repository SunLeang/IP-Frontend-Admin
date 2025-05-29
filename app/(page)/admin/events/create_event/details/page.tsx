"use client";

import { CalendarDays, Clock, CloudDownload, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../(components)/Header";

export default function page() {
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const user = "Jeffrey Zin";

  const [toggleDate, setToggleDate] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col gap-2 mb-40">
      <Header />

      <div className="flex flex-col">
        {/* File Upload */}
        <div className="w-full max-w-full mb-12 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-white">
          <CloudDownload />
          <p className="font-medium">Choose a file or drag & drop it here</p>
          <p className="text-gray-400 text-sm">
            JPEG, PNG, PDG, and MP4 formats, up to 50MB
          </p>
          <button className="mt-4 px-4 py-2 border rounded-lg text-black hover:bg-gray-100">
            Browse File
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Input Title"
            className="w-full max-w-xs mb-4 px-4 py-2 border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="h-10 w-10 flex justify-center items-center bg-black border border-gray-800 rounded-full">
            <Pencil color="white" />
          </button>
        </div>

        <div className="flex flex-col gap-4 ml-2 my-4">
          <div className="flex text-xl font-semibold">
            <p>Date and Time</p>
          </div>

          <label
            htmlFor="date-picker"
            className="flex gap-2 items-center"
            onClick={() => {
              setToggleDate(true);
            }}
          >
            <CalendarDays />
            <p className={`text-sm ${toggleDate ? "hidden" : "block"} `}>
              Choose Date and Time
            </p>
            <DatePicker
              id="date-picker"
              dateFormat="dd/MM/yyyy h:mm aa"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date || null)}
              className={`text-sm ${toggleDate ? "block" : "hidden"} `}
              toggleCalendarOnIconClick
              showTimeSelect
              timeIntervals={15}
              showTimeInput
              withPortal
            />
          </label>

          <div className="ml-4 text-[#7769F7]">+ Add to Calendar</div>
        </div>

        <div className="h-8"></div>
      </div>

      {/* File Upload 2 */}
      <div className="flex flex-col ml-2">
        <div className="flex flex-col gap-2">
          <div className="flex text-xl font-semibold">
            <p>Location</p>
          </div>
          <input
            type="text"
            placeholder="Input Address"
            className="w-full max-w-xs mb-4 px-4 py-2 border border-gray-300 rounded-md"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="w-full max-w-md mb-8 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white">
          <CloudDownload />
          <p className="font-medium">Choose a file or drag & drop it here</p>
          <p className="text-gray-400 text-sm">
            JPEG, PNG, PDG, and MP4 formats, up to 50MB
          </p>
          <button className="mt-3 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
            Browse File
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 ml-2">
        <div className="flex text-xl font-semibold">
          <p>Hosted By</p>
        </div>

        <div className="flex">
          <Image
            className="dark:invert"
            src="/logo.png"
            alt="Next.js logo"
            width={85}
            height={20}
            priority
          />

          <div className="flex flex-col gap-2">
            <p>{user}</p>
            <button className="bg-[#7769F7] text-xs text-white px-6 py-1 rounded-sm">
              Like
            </button>
          </div>
        </div>

        <div className="h-10"></div>
      </div>

      {/* Description Box */}
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Event Description</div>
        <textarea
          rows={6}
          placeholder="Describe what's special about your event & other important details."
          className="w-full max-w-4xl px-4 py-3 border border-gray-300 rounded-md mb-6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <button className="px-6 py-1 rounded-xl border bg-white border-gray-400 text-black hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-6 py-1 rounded-xl bg-green-500 text-white hover:bg-green-600">
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
}
