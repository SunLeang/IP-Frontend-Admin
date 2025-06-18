"use client";

import { EventProps } from "@/app/(api)/events_api";
import { useState } from "react";

const eventDetailHeaders = [
  "Event Name",
  "Location",
  "Date",
  "Attendee",
  "Status",
];

interface EventDetailsProps {
  data: EventProps[];
}

export default function EventDetails({ data }: EventDetailsProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Event Details</h2>
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setSelectedMonth(isNaN(value) ? null : value);
          }}
        >
          <option value="">All</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            {eventDetailHeaders.map((header, index) => {
              return (
                <th key={index} className="py-2 text-center">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data
            ?.filter((event) => {
              if (!selectedMonth) return true; // show all if no select
              const eventMonth = new Date(event.date).getMonth() + 1;
              return eventMonth === selectedMonth;
            })
            .map((event, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{event.name}</td>
                <td className="text-center">{event.locationImage}</td>
                <td className="text-center">{event.date}</td>
                <td className="text-center">{event._count.attendingUsers}</td>
                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      event.status === "Full"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
