"use client";

import Link from "next/link";
import EventCard from "./(components)/EventCard";
import { EventProps, getEvents } from "@/app/(api)/events_api";
import { useQuery } from "@tanstack/react-query";
import Loading from "./(components)/Loading";
import ErrorMessage from "./(components)/ErrorMessage";

export default function page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (res) => res.data,
  });

  if (isLoading) return <Loading message="Loading..." />;
  if (isError) return <ErrorMessage message="Failed to load Event Page." />;

  return (
    <div className="mr-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="flex gap-4">
          <Link
            href="/superAdmin/events/lists/events"
            className="text-primaryblue border border-primaryblue rounded-lg px-2 py-1"
          >
            Event Lists
          </Link>

          <Link
            href="/superAdmin/events/create_event/event"
            className="text-primaryblue border border-primaryblue rounded-lg px-2 py-1"
          >
            Create Event
          </Link>
        </div>
      </div>

      <EventCard
        events={data ?? []}
        showSeeMoreButton={false}
        showView={false}
      />
    </div>
  );
}
