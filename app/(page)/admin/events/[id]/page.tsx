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

  // Use applications endpoint for volunteers
  const {
    data: volunteers,
    isLoading: loadingVolunteers,
    isError: errorVolunteers,
    refetch: refetchVolunteers,
  } = useQuery({
    queryKey: ["volunteer-applications", eventId],
    queryFn: () => getVolunteersByEventId(eventId),
    select: (res) => res.data,
    enabled: view === "volunteers",
    retry: 2,
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

  console.log("🔍 Event detail page data:", {
    eventId,
    view,
    volunteersCount: volunteers?.length,
    tasksCount: tasks?.length,
    loadingVolunteers,
    errorVolunteers,
  });

  const renderView = () => {
    if (view === "volunteers") {
      if (loadingVolunteers)
        return <Loading message="Loading volunteer applications..." />;
      if (errorVolunteers)
        return (
          <ErrorMessage message="Failed to load volunteer applications." />
        );

      return (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Volunteer Applications</h3>
              <p className="text-sm text-gray-600">
                Found {volunteers?.length || 0} applications for this event
              </p>
            </div>
            <button
              onClick={() => refetchVolunteers()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>

          <DataTable
            rows={volunteers || []}
            title="Volunteer Applications"
            dataType="volunteer"
            filterStatus="PENDING"
            showStatusToggle={true}
            showOpenTaskSidebar={true}
            eventName={event?.name}
          />
        </div>
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
          Volunteer Applications
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
