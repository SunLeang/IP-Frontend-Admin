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
import { getVolunteers } from "@/app/(api)/volunteers_api";
import { useQuery } from "@tanstack/react-query";
import SwitchPage from "@/components/switch-pages";
import Loading from "../(components)/Loading";
import ErrorMessage from "../(components)/ErrorMessage";
import DataTable from "../(components)/DataTable";

type Task = {
  id: string;
  description: string;
  status: string;
  type: string;
  date: string;
};

export default function Page() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: volunteers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["volunteers"],
    queryFn: getVolunteers,
    select: (res) => res.data,
  });

  const totalPages = Math.ceil((volunteers?.length ?? 0) / pageSize);
  const paginatedData = volunteers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) return <Loading message="Loading tasks..." />;
  if (isError) return <ErrorMessage message="Failed to load tasks." />;

  return (
    <>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Event Volunteers</h1>

        <div className="table-box">
          <DataTable
            rows={volunteers || []}
            title=""
            dataType="volunteer1"
            showCreateTaskSidebar={true}
          />

          <SwitchPage
            pageSize={pageSize}
            totalItems={volunteers?.length ?? 0}
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
