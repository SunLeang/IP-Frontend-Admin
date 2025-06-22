"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import SwitchPage from "@/components/switch-pages";

import {
  getVolunteers,
  getVolunteersByEventId,
} from "@/app/(api)/volunteers_api";
import { getTasksByEventId } from "@/app/(api)/tasks_api";
import ErrorMessage from "../(components)/ErrorMessage";
import Loading from "../(components)/Loading";
import DataTable from "../(components)/DataTable";
import { getEventsById } from "@/app/(api)/events_api";

export default function Page() {
  const [view, setView] = useState<"volunteers" | "tasks">("volunteers");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const eventId = params.id as string;

  const {
    data: volunteers,
    isLoading: loadingVolunteers,
    isError: errorVolunteers,
  } = useQuery({
    queryKey: ["volunteers", eventId],
    queryFn: () => getVolunteersByEventId(eventId),
    select: (res) => res.data,
    enabled: view === "volunteers",
  });

  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventsById(eventId),
    select: (res) => res.data,
  });

  const {
    data: tasks,
    isLoading: loadingTasks,
    isError: errorTasks,
  } = useQuery({
    queryKey: ["tasks", eventId],
    queryFn: () => getTasksByEventId(eventId),
    select: (res) => res,
    enabled: view === "tasks",
  });

  const paginatedTasks = tasks?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil((tasks?.length ?? 0) / pageSize);

  const renderView = () => {
    if (view === "volunteers") {
      if (loadingVolunteers) return <Loading message="Loading volunteers..." />;
      if (errorVolunteers)
        return <ErrorMessage message="Failed to load volunteers." />;

      return (
        <DataTable
          rows={volunteers || []}
          title="Volunteers"
          dataType="volunteer"
          filterStatus="Attending"
          showStatusToggle={true}
          showOpenTaskSidebar={true}
          eventName={event}
        />
      );
    }

    if (view === "tasks") {
      if (loadingTasks) return <Loading message="Loading tasks..." />;
      if (errorTasks) return <ErrorMessage message="Failed to load tasks." />;

      return (
        <>
          <DataTable
            rows={paginatedTasks || []}
            title="Tasks"
            dataType="task"
            showAssignTask={true}
            showViewDetails={true}
          />

          <SwitchPage
            pageSize={pageSize}
            totalItems={tasks?.length ?? 0}
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
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setView("volunteers")}
          className={`px-4 py-2 rounded-lg ${
            view === "volunteers" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Volunteers
        </button>
        <button
          onClick={() => setView("tasks")}
          className={`px-4 py-2 rounded-lg ${
            view === "tasks" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tasks
        </button>
      </div>

      <div className="table-box">{renderView()}</div>
    </div>
  );
}
