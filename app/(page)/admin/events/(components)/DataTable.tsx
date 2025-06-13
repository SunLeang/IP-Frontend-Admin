"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, MoreVertical } from "lucide-react";
import { AttendanceProps } from "@/app/(api)/attendances_api";
import { deleteEvent, EventProps } from "@/app/(api)/events_api";
import { VolunteerProps } from "@/app/(api)/volunteers_api";
import ConfirmPopup from "@/components/confirm-popup";
import TaskBar from "@/components/taskBar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DetailSidebar from "@/components/task-detail-sidebar";
import TaskDetailSidebar from "@/components/task-detail-sidebar";
import CreateAssignTaskSidebar from "@/components/CreateAssignTaskSidebar";
import { usePathname } from "next/navigation";
import { TaskProps } from "@/app/(api)/tasks_api";

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
    "Organizer",
    "",
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
  volunteer1: ["No.", "Name", "Date", "Status", "Event", "Type", " "],
  task: [
    "No.",
    "name",
    "description",
    "status",
    "type",
    "dueDate",
    "event",
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

  const handlePopupClick = (e: React.MouseEvent, row: any) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    if (showOpenTaskSidebar || showCreateTaskSidebar) {
      setPopupPosition({ x: rect.left - 140, y: rect.bottom });
    } else {
      setPopupPosition({ x: rect.left - 75, y: rect.bottom });
    }

    setSelectedRow(row);
  };

  const handleDelete = async (row: any) => {
    try {
      switch (dataType) {
        case "event":
          await deleteEvent(row.id);
          break;
        case "volunteer":
        case "volunteer1":
          // await deleteVolunteer(row.id);
          break;
        case "attendance":
          // await deleteAttendance(row.id);
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
        name = (row as VolunteerProps).name ?? "";
      } else if (dataType === "attendance") {
        name = (row as AttendanceProps).user.fullName ?? "";
      } else if (dataType === "task") {
        name = (row as TaskProps).name ?? "";
      }

      const matchStatus =
        showStatusToggle && showAttendingOnly
          ? row.status === (filterStatus || "Attending")
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
    const common = (
      <td className="py-2 px-2 flex justify-center items-center mb-4">
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
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{e.id}</td>
            <td className="py-2 px-2">{e.name}</td>
            <td className="py-2 px-2">{e.description}</td>
            <td className="py-2 px-2">{e.venue}</td>
            <td className="py-2 px-2">{e.date}</td>
            <td className="py-2 px-2">{e.time}</td>
            <td className="py-2 px-2">{e.organizer}</td>
            {common}
          </>
        );
      }
      case "volunteer": {
        const v = row as VolunteerProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{v.event.name}</td>
            <td className="py-2 px-2">{v.name}</td>
            <td className="py-2 px-2">{v.status}</td>
            <td className="py-2 px-2">{v.appliedAt}</td>
            {common}
          </>
        );
      }
      case "volunteer1": {
        const v = row as VolunteerProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{v.name}</td>
            <td className="py-2 px-2">{v.appliedAt}</td>
            <td className="py-2 px-2">
              <span
                className={`px-2 py-2 rounded-full text-xs font-medium ${
                  v.status === "APPROVED"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {v.status}
              </span>
            </td>
            <td className="py-2 px-2">{v.event.name}</td>
            <td className="py-2 px-2">{v.cvPath}</td>
            {common}
          </>
        );
      }
      case "attendance": {
        const a = row as AttendanceProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{a.userId}</td>
            <td className="py-2 px-2">{a.user.fullName}</td>
            <td className="py-2 px-2">{a.user.email}</td>
            <td className="py-2 px-2">{a.user.gender.toLowerCase()}</td>
            <td className="py-2 px-2">
              <span
                className={
                  a.status === "JOINED" ? "text-green-600" : "text-orange-500"
                }
              >
                {a.status}
              </span>
            </td>
            <td className="py-2 px-2">{a.registeredAt}</td>
            {common}
          </>
        );
      }
      case "task": {
        const t = row as TaskProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{t.name}</td>
            <td className="py-2 px-2">{t.description}</td>
            <td className="py-2 px-2">
              <span
                className={`px-2 py-2 rounded-full text-xs font-medium ${
                  t.status === "COMPLETED"
                    ? "bg-green-100 text-green-600"
                    : t.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {t.status}
              </span>
            </td>
            <td className="py-2 px-2">{t.type}</td>
            <td className="py-2 px-2">
              {new Date(t.dueDate).toLocaleDateString()}
            </td>
            <td className="py-2 px-2">{t.event.name}</td>
            {common}
          </>
        );
      }
      default:
        return <td colSpan={8}>Unsupported type</td>;
    }
  };

  useEffect(() => {
    const closePopup = () => setPopupPosition(null);
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        {title ? (
          <div className="flex gap-1 items-center text-sm text-muted-foreground mb-2">
            <Link href="/admin/events/" className="flex items-center">
              <Home size={14} className="mr-1" />
              <p>Events</p>
            </Link>
            <ChevronRight size={18} />
            <p>{title}</p>
          </div>
        ) : (
          <div className="flex justify-center items-center mb-4">
            Show Volunteers
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            {showStatusToggle && (
              <>
                <h2 className="text-xl font-semibold">
                  {showAttendingOnly
                    ? `${filterStatus || "Attending"} Only`
                    : `${title} List`}
                </h2>
                <Switch
                  checked={showAttendingOnly}
                  onCheckedChange={setShowAttendingOnly}
                />
              </>
            )}
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-muted-foreground bg-gray-200">
            {headersMap[dataType].map((header, index) => (
              <th key={index} className="py-2 px-2 text-black">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/30">
              {renderRow(row, index)}
            </tr>
          ))}
        </tbody>
      </table>

      {popupPosition && selectedRow && (
        <ConfirmPopup
          showOpenTaskSidebar={showOpenTaskSidebar}
          showCreateTaskSidebar={showCreateTaskSidebar}
          position={popupPosition}
          onOpenTask={() => {
            setShowTaskBar(true);
            setPopupPosition(null);
          }}
          onDelete={() => handleDelete(selectedRow)}
          onView={() => onView?.(selectedRow)}
          onCancel={() => setPopupPosition(null)}
          showView={showView}
          onOpenDetail={() => {
            setPopupPosition(null);
            if (showCreateTaskSidebar) {
              setShowDetailCreateTaskSidebar(true);
            } else {
              setShowDetailSidebar(true);
            }
          }}
        />
      )}

      {showTaskBar && (
        <TaskBar
          onClose={() => setShowTaskBar(false)}
          volunteerId={JSON.stringify(selectedRow?.id)}
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
    </div>
  );
}
