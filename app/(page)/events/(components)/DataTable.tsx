"use client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, House, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DataRow {
  [key: string]: string;
}

interface DataTableProps {
  headers: string[];
  rows: DataRow[];
  title: string;
  filterStatus?: string;
  showStatusToggle?: boolean;
}

export default function DataTable({
  headers,
  rows,
  title,
  filterStatus,
  showStatusToggle,
}: DataTableProps) {
  const [showAttendingOnly, setShowAttendingOnly] = useState(
    showStatusToggle ? true : false
  );
  const [search, setSearch] = useState("");

  const filtered = rows.filter((a) => {
    const matchStatus =
      showStatusToggle && showAttendingOnly
        ? a.status === (filterStatus || "Attending")
        : true;

    const matchSearch = (a.name || a.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="flex justify-between ">
        <div className="flex gap-1 justify-center items-center text-sm text-muted-foreground mb-2">
          <Link href="/events/" className="flex items-center">
            <House size={18} className="mr-1" />
            <p>Events</p>
          </Link>
          <ChevronRight size={18} />
          <p>{title}</p>
        </div>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="w-48"
            />
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-muted-foreground bg-red-400">
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-2 text-black">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/30">
              <td className="py-2 px-2">{index + 1}</td>
              {headers.slice(1).map((header, i) => (
                <td key={i} className="py-2 px-2">
                  {header === "Status" ? (
                    row.status === "Attending" ? (
                      <span className="text-green-600">Attending</span>
                    ) : (
                      <span className="text-orange-500">Interested</span>
                    )
                  ) : header === "..." ? (
                    <MoreVertical className="w-4 h-4 cursor-pointer" />
                  ) : (
                    row[header.toLowerCase()] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
