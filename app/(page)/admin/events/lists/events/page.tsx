"use client";

import { useQuery } from "@tanstack/react-query";
import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";
import Loading from "../../(components)/Loading";
import ErrorMessage from "../../(components)/ErrorMessage";
import { getEventsByOrganizerId } from "@/app/(api)/events_api";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEventsByOrganizerId(),
    select: (res) => res.data,
  });

  if (isLoading) return <Loading message="Loading events..." />;
  if (isError) return <ErrorMessage message="Failed to load events." />;

  return (
    <div className="flex flex-col">
      <Header />
      <div className="table-box">
        <DataTable
          rows={data || []}
          title="Details"
          dataType="event"
          showStatusToggle={false}
          showUpdateEvent={true}
        />
      </div>
    </div>
  );
}
