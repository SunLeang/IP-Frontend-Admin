"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Printer,
} from "lucide-react";
import DataTable from "../events/(components)/DataTable";
import Loading from "../events/(components)/Loading";
import ErrorMessage from "../events/(components)/ErrorMessage";
import { getVolunteers } from "@/app/(api)/volunteers_api"; // ✅ Changed to existing function
import { useQuery } from "@tanstack/react-query";
import SwitchPage from "@/components/switch-pages";

export default function Page() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: Volunteers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["volunteers"],
    queryFn: getVolunteers, // ✅ Use existing function
    select: (res) => res.data,
  });

  const totalPages = Math.ceil((Volunteers?.length ?? 0) / pageSize);
  const paginatedData = Volunteers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) return <Loading message="Loading volunteers..." />; // ✅ Updated message
  if (isError) return <ErrorMessage message="Failed to load volunteers." />; // ✅ Updated message

  return (
    <>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Event Volunteers</h1>

        <div className="table-box">
          <DataTable
            rows={Volunteers || []}
            title="My Volunteers" // ✅ Updated title
            dataType="volunteer1"
            showAssignTaskToVolunteer={true}
            showOpenTaskSidebar={true}
          />

          <SwitchPage
            pageSize={pageSize}
            totalItems={Volunteers?.length ?? 0}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            onPreviousPage={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            onNextPage={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </div>
      </main>
    </>
  );
}
