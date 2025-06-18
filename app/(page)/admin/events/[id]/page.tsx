"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SwitchPage from "@/components/switch-pages";
import Loading from "../(components)/Loading";
import ErrorMessage from "../(components)/ErrorMessage";
import DataTable from "../(components)/DataTable";
import { getTasks, getTasksByEventId } from "@/app/(api)/tasks_api";
import { useParams } from "next/navigation";

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
  const [assignTask, setAssignTask] = useState<boolean>(false);

  const params = useParams();
  const eventId = params.id as string;

  const {
    data: Tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", eventId],
    queryFn: () => getTasksByEventId(eventId),
    select: (res) => res,
  });

  if (isLoading) return <Loading message="Loading tasks..." />;
  if (isError) return <ErrorMessage message="Failed to load tasks." />;

  const totalPages = Math.ceil((Tasks?.length ?? 0) / pageSize);
  const paginatedTasks = Tasks?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <main className="p-6 space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Event Tasks</h1>
          <button className="bg-gray-400 px-2 rounded-lg font-semibold">
            Create Task
          </button>
        </div>

        <div className="table-box">
          <DataTable
            rows={paginatedTasks || []}
            title="Tasks"
            dataType="task"
            showAssignTask={true}
            showViewDetails={true}
          />

          <SwitchPage
            pageSize={pageSize}
            totalItems={Tasks?.length ?? 0}
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
