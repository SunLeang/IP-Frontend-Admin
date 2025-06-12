"use client";

import { deleteEvent, EventProps } from "@/app/(api)/events_api";
import { VolunteerProps } from "@/app/(api)/volunteers_api";
import ConfirmPopup from "@/components/confirm-popup";
import TaskBar from "@/components/taskBar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Home, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type DataType = "event" | "volunteer" | "attendance" | "volunteer1";

interface AttendanceProps {
  userId: string;
  eventId: string;
  status: string;
  registeredAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    age: number;
    org: string;
    currentRole: string;
  };
}

interface DataTableProps {
  rows: EventProps[] | VolunteerProps[] | AttendanceProps[];
  title: string;
  filterStatus?: string;
  showStatusToggle?: boolean;
  dataType: DataType;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  showView?: boolean;
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
  volunteer: ["No.", "ID", "Name", "Gender", "Date", ""],
  attendance: [
    "No.",
    "User ID",
    "Full Name",
    "Email",
    "Gender",
    "Status",
    "Registered At",
  ],
  volunteer1: ["No.", "Name", "Date", "Status", "Event", "Type", ""],
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
}: DataTableProps) {
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

  const filtered = rows.filter((row) => {
    let name = "";
    if (dataType === "event") name = (row as EventProps).name;
    else if (dataType === "volunteer") name = (row as VolunteerProps).name;
    else if (dataType === "volunteer1") name = (row as VolunteerProps).name;
    else name = (row as AttendanceProps).user.fullName;

    const matchStatus =
      showStatusToggle && showAttendingOnly
        ? row.status === (filterStatus || "Attending")
        : true;

    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const renderRow = (row: any, index: number) => {
    switch (dataType) {
      case "event":
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
            <td>
              <MoreVertical
                className="mt-6 w-4 h-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = (
                    e.target as HTMLElement
                  ).getBoundingClientRect();
                  setPopupPosition({ x: rect.left - 140, y: rect.bottom });
                  setSelectedRow(row);
                }}
              />
            </td>
          </>
        );
      case "volunteer":
        const v = row as VolunteerProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{v.id}</td>
            <td className="py-2 px-2">{v.name}</td>
            <td className="py-2 px-2">{v.event?.status || "-"}</td>
            <td className="py-2 px-2">{v.appliedAt}</td>
            <td className="py-2 px-2">
              <MoreVertical
                className="mt-6 w-4 h-4 cursor-pointer"
                onClick={() => setShowTaskBar(true)}
              />
            </td>
          </>
        );
      case "volunteer1":
        const b = row as VolunteerProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{b.name}</td>
            <td className="py-2 px-2">{b.appliedAt}</td>
            <td className="py-2">
              <span
                className={`px-2 py-2 rounded-full text-xs font-medium ${
                  b.status === "PUBLISHED"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {b.status}
              </span>
            </td>
            <td className="py-2 px-2">{b.event.name}</td>
            <td className="py-2 px-2">{b.cvPath}</td>
            <td className="py-2 px-2">
              <MoreVertical
                className="mt-6 w-4 h-4 cursor-pointer"
                onClick={() => setShowTaskBar(true)}
              />
            </td>
          </>
        );

      case "attendance":
        const a = row as AttendanceProps;
        return (
          <>
            <td className="py-2 px-2">{index + 1}</td>
            <td className="py-2 px-2">{a.userId}</td>
            <td className="py-2 px-2">{a.user.fullName}</td>
            <td className="py-2 px-2">{a.user.email}</td>
            <td className="py-2 px-2">{a.user.gender}</td>
            <td className="py-2 px-2">
              {a.status === "JOINED" ? (
                <span className="text-green-600">Joined</span>
              ) : (
                <span className="text-orange-500">{a.status}</span>
              )}
            </td>
            <td className="py-2 px-2">{a.registeredAt}</td>
            <td>
              <MoreVertical
                className="mt-6 w-4 h-4 cursor-pointer"
                onClick={() => setShowTaskBar(true)}
              />
            </td>
          </>
        );
      default:
        return <td colSpan={8}>Unsupported type</td>;
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setPopupPosition(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        {title !== "" ? (
          <div className="flex gap-1 justify-center items-center text-sm text-muted-foreground mb-2">
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
                  onCheckedChange={
                    setShowAttendingOnly as (checked: boolean) => void
                  }
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
          {filtered.map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/30">
              {renderRow(row, index)}
            </tr>
          ))}
        </tbody>
      </table>

      {popupPosition && selectedRow && (
        <ConfirmPopup
          position={popupPosition}
          onOpenTask={() => {
            setShowTaskBar(true);
            setPopupPosition(null);
          }}
          onDelete={async () => {
            if (selectedRow) {
              try {
                await deleteEvent(selectedRow.id);
                console.log("Deleted event:", selectedRow.id);
                onDelete?.(selectedRow);
                setPopupPosition(null);
              } catch (error) {
                console.error("Delete failed:", error);
              }
            }
          }}
          onView={() => {
            onView?.(selectedRow);
          }}
          showView={showView}
          onCancel={() => setPopupPosition(null)}
        />
      )}

      {showTaskBar && <TaskBar onClose={() => setShowTaskBar(false)} />}
    </div>
  );
}
