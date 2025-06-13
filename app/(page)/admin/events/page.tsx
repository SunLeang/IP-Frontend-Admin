"use client";

import Link from "next/link";
import EventCard from "./(components)/EventCard";
import { EventProps, getEvents } from "@/app/(api)/events_api";
import { useQuery } from "@tanstack/react-query";
import Loading from "./(components)/Loading";
import ErrorMessage from "./(components)/ErrorMessage";
import { useEffect, useState } from "react";

export default function page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (res) => res.data,
  });

  const [events, setEvents] = useState<EventProps[]>(data ?? []);

  const handleDelete = (deletedEvent: EventProps) => {
    console.log("event before: " + events);
    setEvents((prev) => prev.filter((e) => e.id !== deletedEvent.id));
    console.log("event after: " + events);
  };

  useEffect(() => {
    if (data) setEvents(data);
    console.log(data);
  }, [data]);

  if (isLoading) return <Loading message="Loading..." />;
  if (isError) return <ErrorMessage message="Failed to load Event Page." />;

  return (
    <div className="mr-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="flex gap-4">
          {/* <button
            className="bg-red-500 text-white border rounded-lg px-2 py-1"
            onClick={async () => {
              await getVolunteers();
              // console.log("_counts:", data.data);
            }}
          >
            Console Log
          </button> */}

          <Link
            href="/admin/events/lists/events"
            className="text-primaryblue border border-primaryblue rounded-lg px-2 py-1"
          >
            Event Lists
          </Link>

          <Link
            href="/admin/events/create_event/event"
            className="text-primaryblue border border-primaryblue rounded-lg px-2 py-1"
          >
            Create Event
          </Link>
        </div>
      </div>

      <EventCard
        events={data ?? []}
        showSeeMoreButton={false}
        // onDelete={(row) => {
        //   handleDelete(row);
        //   console.log("row: " + row);
        // }}
        // onView={(row) => {
        //   // console.log("View:", row.id);
        // }}
        showView={false}
      />
    </div>
  );
}
