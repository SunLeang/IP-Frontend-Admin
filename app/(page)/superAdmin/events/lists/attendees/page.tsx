"use client";

import { useQuery } from "@tanstack/react-query";
import { getEventAttendees } from "@/app/(api)/attendances_api";
import { useParams } from "next/navigation";
import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";
import Loading from "../../(components)/Loading";
import ErrorMessage from "../../(components)/ErrorMessage";

export default function Page() {
  const params = useParams();
  // const eventId = params?.eventId as string;
  const eventId = "b311733e-d5f8-4fe3-9b78-e51519553a0d";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["eventAttendees", eventId],
    queryFn: () => getEventAttendees(eventId),
    enabled: !!eventId,
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
          showStatusToggle={true}
        />
      </div>
    </div>
  );
}
