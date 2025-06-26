"use client";

import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getVolunteers } from "@/app/(api)/volunteers_api";
import Loading from "../../(components)/Loading";
import ErrorMessage from "../../(components)/ErrorMessage";

export default function Page() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["volunteer-applications"],
    queryFn: getVolunteers,
    select: (res) => res.data,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  console.log("🔍 Volunteer applications page data:", {
    dataLength: data?.length,
    isLoading,
    isError,
    error: error?.message,
  });

  if (isLoading) return <Loading message="Loading volunteer applications..." />;
  if (isError) {
    console.error("❌ Error loading volunteer applications:", error);
    return <ErrorMessage message="Failed to load volunteer applications." />;
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="table-box">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Volunteer Applications</h2>
            <p className="text-sm text-gray-600">
              Found {data?.length || 0} volunteer applications
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        <DataTable
          rows={data || []}
          title="Volunteer Applications"
          dataType="volunteer"
          filterStatus="PENDING"
          showStatusToggle={true}
          showOpenTaskSidebar={true}
        />
      </div>
    </div>
  );
}
