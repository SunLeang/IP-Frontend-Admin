"use client";

import Link from "next/link";
import EventCard from "./EventCard";

const events = [
  {
    title: "Event Summer Festival",
    img: "summer.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Prom Night",
    img: "prom.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
];

export default function page() {
  return (
    <div className="mr-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/events/lists/details"
            className="text-primaryblue border border-primaryblue rounded-lg px-2 py-1"
          >
            Event Lists
          </Link>

          <Link
            href="/admin/events/create_event/details"
            className="text-primaryblue border border-primaryblue rounded-lg px-2 py-1"
          >
            Create Event
          </Link>
        </div>
      </div>

      <EventCard events={events} showSeeMoreButton={false} />
    </div>
  );
}
