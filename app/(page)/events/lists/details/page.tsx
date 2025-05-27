"use client";

import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";

interface EventDetails {
  id: string;
  name: string;
  status: "Attending" | "Interested";
  gender: "Male" | "Female";
  date: string;
}

const eventDetails = [
  {
    id: "event-001",
    title: "Annual Volunteer Gathering",
    description:
      "A community event bringing together volunteers and participants.",
    location: "Phnom Penh Conference Hall",
    date: "12-12-2024",
    time: "9:00 AM - 5:00 PM",
    organizer: "Youth for Change",
    contact: "012 345 678",
  },
  {
    id: "event-002",
    title: "Annual Volunteer Gathering",
    description:
      "A community event bringing together volunteers and participants.",
    location: "Phnom Penh Conference Hall",
    date: "12-12-2024",
    time: "9:00 AM - 5:00 PM",
    organizer: "Youth for Change",
    contact: "012 345 678",
  },
  {
    id: "event-003",
    title: "Annual Volunteer Gathering",
    description:
      "A community event bringing together volunteers and participants.",
    location: "Phnom Penh Conference Hall",
    date: "12-12-2024",
    time: "9:00 AM - 5:00 PM",
    organizer: "Youth for Change",
    contact: "012 345 678",
  },
];

const headers = [
  "No.",
  "ID",
  "Title",
  "Description",
  "Location",
  "Date",
  "Time",
  "Organizer",
  "Contact",
];

export default function page() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        <DataTable headers={headers} rows={eventDetails} title="Details" />
      </div>
    </div>
  );
}
