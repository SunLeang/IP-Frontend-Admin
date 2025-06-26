"use client";

import { useState, useEffect, useMemo } from "react";
import { MoreVertical } from "lucide-react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import ConfirmPopup from "@/components/confirm-popup";
import TaskBar from "@/components/taskBar";
import TaskDetailSidebar from "@/components/task-detail-sidebar";
import CreateAssignTaskSidebar from "@/components/CreateAssignTaskSidebar";
import EventDetailSidebar from "@/components/event-detail-sidebar";
import AssignVolunteerSidebar from "@/components/assign-task-sidebar";

// Import types
import { EventProps, deleteEvent } from "@/app/(api)/events_api";
import {
  VolunteerProps,
  updateVolunteerStatus,
} from "@/app/(api)/volunteers_api";
import { AttendanceProps } from "@/app/(api)/attendances_api";
import { TaskProps, deleteTask } from "@/app/(api)/tasks_api";

type DataType = "event" | "volunteer" | "attendance" | "volunteer1" | "task";

interface DataTableProps {
  rows: EventProps[] | VolunteerProps[] | AttendanceProps[] | TaskProps[];
  title: string;
  filterStatus?: string;
  showStatusToggle?: boolean;
  dataType: DataType;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  showView?: boolean;
  showOpenTaskSidebar?: boolean;
  showCreateTaskSidebar?: boolean;
  showAssignTask?: boolean;
  showViewDetails?: boolean;
  showUpdateEvent?: boolean;
  showAssignTaskToVolunteer?: boolean;
  eventName?: string;
}

const headersMap: Record<DataType, string[]> = {
  event: [
    "No.",
    "ID",
    "Name",
    "Description",
    "Location",
    "Date",
    "Time",
    "Accepting Volunteers",
    " ",
  ],
  volunteer: ["No.", "Event", "Name", "Status", "Date", " "],
  attendance: [
    "No.",
    "User ID",
    "Full Name",
    "Email",
    "Gender",
    "Status",
    "Registered At",
    " ",
  ],
  volunteer1: ["No.", "Name", "Date", "Status", "Event", " "],
  task: [
    "No.",
    "Name",
    "Description",
    "Status",
    "Type",
    "Due Date",
    "Event",
    "",
  ],
};

export default function DataTable({
  rows,
  title,
  filterStatus,
  showStatusToggle,
  dataType,
  onDelete,
  onView,
  showView,
  showOpenTaskSidebar,
  showCreateTaskSidebar,
  showAssignTask,
  showViewDetails,
  showUpdateEvent,
  showAssignTaskToVolunteer,
  eventName,
}: DataTableProps) {
  const pathname = usePathname();
  const eventIdFromPath = pathname.startsWith("/admin/events/")
    ? pathname.split("/")[3]
    : null;

  const [showAttendingOnly, setShowAttendingOnly] = useState(
    showStatusToggle ? false : true
  );
  const [search, setSearch] = useState("");
  const [showTaskBar, setShowTaskBar] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [showDetailCreateTaskSidebar, setShowDetailCreateTaskSidebar] =
    useState(false);
  const [showUpdateEventSidebar, setShowUpdateEventSidebar] = useState(false);
  const [showAssignTaskSidebar, setShowAssignTaskSidebar] = useState(false);

  const handlePopupClick = (e: React.MouseEvent, row: any) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    if (showOpenTaskSidebar || showCreateTaskSidebar) {
      setPopupPosition({ x: rect.left - 140, y: rect.bottom });
    } else {
      setPopupPosition({ x: rect.left - 75, y: rect.bottom });
    }

    setSelectedRow(row);

    // Debug log to check what data we have
    console.log("🔍 Selected row data:", row);
    console.log("🔍 Data type:", dataType);
    if (dataType === "volunteer" || dataType === "volunteer1") {
      console.log("🔍 Volunteer ID:", row.id);
      console.log("🔍 Volunteer user data:", row.user);
    }
  };

  const handleDelete = async (row: any) => {
    try {
      switch (dataType) {
        case "event":
          await deleteEvent(row.id);
          break;
        case "volunteer":
        case "volunteer1":
          // For volunteers, we might want to update status to REJECTED instead
          await updateVolunteerStatus(row.id, "REJECTED");
          break;
        case "task":
          await deleteTask(row.id);
          break;
        default:
          throw new Error("Unsupported delete operation");
      }
      onDelete?.(row);
      setPopupPosition(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      let name: string = "";
      if (dataType === "event") {
        name = (row as EventProps).name ?? "";
      } else if (dataType.startsWith("volunteer")) {
        name = (row as VolunteerProps).user?.fullName ?? "";
      } else if (dataType === "attendance") {
        name = (row as AttendanceProps).user.fullName ?? "";
      } else if (dataType === "task") {
        name = (row as TaskProps).name ?? "";
      }

      const matchStatus =
        showStatusToggle && showAttendingOnly
          ? row.status === (filterStatus || "JOINED")
          : true;

      const matchSearch = name.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [
    rows,
    search,
    showAttendingOnly,
    showStatusToggle,
    filterStatus,
    dataType,
  ]);

  const renderRow = (row: any, index: number) => {
    // Generate unique key for each row based on data type and row ID
    const getRowKey = (row: any, index: number) => {
      const baseKey = row.id || `${dataType}-${index}`;
      return `${dataType}-${baseKey}`;
    };

    const rowKey = getRowKey(row, index);

    const common = (
      <td
        key={`${rowKey}-actions`}
        className="py-2 px-2 flex justify-center items-center mb-4"
      >
        <MoreVertical
          className="mt-6 w-4 h-4 cursor-pointer"
          onClick={(e) => handlePopupClick(e, row)}
        />
      </td>
    );

    switch (dataType) {
      case "event": {
        const e = row as EventProps;
        return (
          <tr key={rowKey} className="border-b">
            <td key={`${rowKey}-no`} className="py-2 px-2">
              {index + 1}
            </td>
            <td key={`${rowKey}-id`} className="py-2 px-2">
              {e.id}
            </td>
            <td key={`${rowKey}-name`} className="py-2 px-2">
              {e.name}
            </td>
            <td key={`${rowKey}-desc`} className="py-2 px-2 max-w-xs truncate">
              {e.description}
            </td>
            <td key={`${rowKey}-venue`} className="py-2 px-2">
              {e.venue}
            </td>
            <td key={`${rowKey}-date`} className="py-2 px-2">
              {e.date}
            </td>
            <td key={`${rowKey}-time`} className="py-2 px-2">
              {e.time}
            </td>
            <td key={`${rowKey}-volunteers`} className="py-2 px-2">
              {e.acceptingVolunteers ? "Yes" : "No"}
            </td>
            {common}
          </tr>
        );
      }
      case "volunteer": {
        const v = row as VolunteerProps;
        return (
          <tr key={rowKey} className="border-b">
            <td key={`${rowKey}-no`} className="py-2 px-2">
              {index + 1}
            </td>
            <td key={`${rowKey}-event`} className="py-2 px-2">
              {v.event?.name || "N/A"}
            </td>
            <td key={`${rowKey}-name`} className="py-2 px-2">
              {v.user?.fullName || "N/A"}
            </td>
            <td key={`${rowKey}-status`} className="py-2 px-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  v.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : v.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {v.status}
              </span>
            </td>
            <td key={`${rowKey}-applied`} className="py-2 px-2">
              {v.appliedAt}
            </td>
            {common}
          </tr>
        );
      }
      case "volunteer1": {
        const v = row as VolunteerProps;
        return (
          <tr key={rowKey} className="border-b">
            <td key={`${rowKey}-no`} className="py-2 px-2">
              {index + 1}
            </td>
            <td key={`${rowKey}-name`} className="py-2 px-2">
              {v.user?.fullName || "N/A"}
            </td>
            <td key={`${rowKey}-applied`} className="py-2 px-2">
              {v.appliedAt}
            </td>
            <td key={`${rowKey}-status`} className="py-2 px-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  v.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : v.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {v.status}
              </span>
            </td>
            <td key={`${rowKey}-event`} className="py-2 px-2">
              {v.event?.name || "N/A"}
            </td>
            {common}
          </tr>
        );
      }
      case "attendance": {
        const a = row as AttendanceProps;
        return (
          <tr key={rowKey} className="border-b">
            <td key={`${rowKey}-no`} className="py-2 px-2">
              {index + 1}
            </td>
            <td key={`${rowKey}-userId`} className="py-2 px-2">
              {a.userId}
            </td>
            <td key={`${rowKey}-fullName`} className="py-2 px-2">
              {a.user.fullName}
            </td>
            <td key={`${rowKey}-email`} className="py-2 px-2">
              {a.user.email}
            </td>
            <td key={`${rowKey}-gender`} className="py-2 px-2">
              {a.user.gender}
            </td>
            <td key={`${rowKey}-status`} className="py-2 px-2">
              {a.status}
            </td>
            <td key={`${rowKey}-registered`} className="py-2 px-2">
              {a.registeredAt}
            </td>
            {common}
          </tr>
        );
      }
      case "task": {
        const t = row as TaskProps;
        return (
          <tr key={rowKey} className="border-b">
            <td key={`${rowKey}-no`} className="py-2 px-2">
              {index + 1}
            </td>
            <td key={`${rowKey}-name`} className="py-2 px-2">
              {t.name}
            </td>
            <td key={`${rowKey}-desc`} className="py-2 px-2 max-w-xs truncate">
              {t.description}
            </td>
            <td key={`${rowKey}-status`} className="py-2 px-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  t.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : t.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {t.status}
              </span>
            </td>
            <td key={`${rowKey}-type`} className="py-2 px-2">
              {t.type}
            </td>
            <td key={`${rowKey}-due`} className="py-2 px-2">
              {new Date(t.dueDate).toLocaleDateString()}
            </td>
            <td key={`${rowKey}-event`} className="py-2 px-2">
              {t.event?.name || "N/A"}
            </td>
            {common}
          </tr>
        );
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    const closePopup = () => setPopupPosition(null);
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-4">
          {showStatusToggle && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAttendingOnly}
                onChange={(e) => setShowAttendingOnly(e.target.checked)}
              />
              Show {filterStatus || "Attending"} only
            </label>
          )}
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            {headersMap[dataType].map((header, index) => (
              <th
                key={`header-${dataType}-${index}`}
                className="py-2 px-2 font-medium text-gray-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Add unique keys for each row */}
          {filteredRows.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>

      {popupPosition && selectedRow && (
        <ConfirmPopup
          showOpenTaskSidebar={showOpenTaskSidebar}
          position={popupPosition}
          onOpenTask={() => {
            // validation and logging
            console.log("🔍 Opening task bar for selected row:", selectedRow);

            if (dataType === "volunteer" || dataType === "volunteer1") {
              if (!selectedRow || !selectedRow.id) {
                console.error("❌ No volunteer ID found in selected row");
                alert("Error: Volunteer data is missing");
                setPopupPosition(null);
                return;
              }
              console.log(
                "✅ Opening task bar for volunteer ID:",
                selectedRow.id
              );
            }

            setShowTaskBar(true);
            setPopupPosition(null);
          }}
          onDelete={() => handleDelete(selectedRow)}
          onView={() => onView?.(selectedRow)}
          onCancel={() => setPopupPosition(null)}
          showView={showView}
          showAssignTask={showAssignTask}
          showAssignTaskToVolunteer={showAssignTaskToVolunteer}
          showViewDetails={showViewDetails}
          onAssignTask={() => {
            setPopupPosition(null);
            setShowDetailCreateTaskSidebar(true);
          }}
          onAssignTaskToVolunteer={() => {
            console.log(
              "🔍 Assign task to volunteer - selected row:",
              selectedRow
            );
            if (!selectedRow || !selectedRow.user?.id) {
              console.error("❌ No user ID found in selected volunteer row");
              alert("Error: Volunteer user data is missing");
              setPopupPosition(null);
              return;
            }
            setPopupPosition(null);
            setShowAssignTaskSidebar(true);
          }}
          onViewDetails={() => {
            setPopupPosition(null);
            setShowDetailSidebar(true);
          }}
          showUpdateEvent={showUpdateEvent}
          onUpdateEvent={() => {
            setPopupPosition(null);
            setShowUpdateEventSidebar(true);
          }}
        />
      )}

      {showTaskBar && selectedRow && (
        <TaskBar
          onClose={() => setShowTaskBar(false)}
          // Use the correct volunteer ID
          volunteerId={selectedRow.id}
        />
      )}

      {showDetailSidebar && selectedRow && (
        <TaskDetailSidebar
          task={selectedRow}
          onClose={() => setShowDetailSidebar(false)}
        />
      )}

      {showDetailCreateTaskSidebar && selectedRow && (
        <CreateAssignTaskSidebar
          eventId={eventIdFromPath ?? ""}
          onClose={() => setShowDetailCreateTaskSidebar(false)}
        />
      )}

      {showAssignTaskSidebar && selectedRow && (
        <AssignVolunteerSidebar
          // Use the correct user ID for task assignment
          volunteerId={selectedRow.user?.id || selectedRow.userId}
          eventId={selectedRow.eventId}
          onClose={() => {
            setShowAssignTaskSidebar(false);
          }}
        />
      )}

      {showUpdateEventSidebar && selectedRow && (
        <EventDetailSidebar
          event={selectedRow}
          onClose={() => setShowUpdateEventSidebar(false)}
        />
      )}
    </div>
  );
}
