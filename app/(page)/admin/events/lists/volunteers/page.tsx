"use client";

import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getVolunteers, VolunteerProps } from "@/app/(api)/volunteers_api";
import Loading from "../../(components)/Loading";
import ErrorMessage from "../../(components)/ErrorMessage";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["volunteers"],
    queryFn: getVolunteers,
    select: (res) => res.data,
  });

  if (isLoading) return <Loading message="Loading volunteers..." />;
  if (isError) return <ErrorMessage message="Failed to load volunteers." />;

  return (
    <div className="flex flex-col">
      <Header />
      <div className="table-box">
        <DataTable
          rows={data || []}
          title="Volunteers"
          dataType="volunteer"
          filterStatus="Attending"
          showStatusToggle={true}
        />
      </div>
    </div>
  );
}
