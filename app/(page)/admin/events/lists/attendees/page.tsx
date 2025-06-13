"use client";

import { useQuery } from "@tanstack/react-query";
import { getEventAttendees } from "@/app/(api)/attendances_api";
import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";
import Loading from "../../(components)/Loading";
import ErrorMessage from "../../(components)/ErrorMessage";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["eventAttendees"],
    queryFn: () => getEventAttendees(),
  });

  if (isLoading) return <Loading message="Loading event attendees..." />;
  if (isError) return <ErrorMessage message="Failed to load attendees." />;

  return (
    <div className="flex flex-col">
      <Header />
      <div className="table-box">
        <DataTable
          rows={data || []}
          title="Event Attendees"
          dataType="attendance"
          showStatusToggle={false}
          showOpenTaskSidebar={false}
        />
      </div>
    </div>
  );
}
