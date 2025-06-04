"use client";

import Link from "next/link";
import EventCard from "./EventCard";
import { getEvents } from "@/app/(api)/events";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// const events1 = [
//   {
//     name: "Event Summer Festival",
//     img: "summer.png",
//     date: { month: "NOV", day: "22" },
//     venue: "Venue",
//     time: "00:00 AM - 00:00 PM",
//     price: 4.99,
//     interested: 10,
//     category: "Entertainment",
//   },
//   {
//     name: "Event Prom Night",
//     img: "prom.png",
//     date: { month: "NOV", day: "22" },
//     venue: "Venue",
//     time: "00:00 AM - 00:00 PM",
//     price: 4.99,
//     interested: 10,
//     category: "Entertainment",
//   },
// ];

export default function page() {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<any[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (res) => res.data,
  });

  return (
    <div className="mr-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="flex gap-4">
          <button
            className="bg-red-500 text-white border rounded-lg px-2 py-1"
            onClick={async () => {
              console.log(await getEvents());
              // console.log("_counts:", data.data);
            }}
          >
            Console Log
          </button>

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

      <EventCard events={data ?? []} showSeeMoreButton={false} />
      {/* <EventCard events={events1} showSeeMoreButton={false} /> */}
    </div>
  );
}
