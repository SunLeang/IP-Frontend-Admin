"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfirmPopupBox from "../app/(page)/superAdmin/organizer/(components)/ConfirmPopupBox";
import { changeUserRole, deleteUser, UserProps } from "@/app/(api)/user_api";
import { getEventCountByOrganizerId } from "@/app/(api)/events_api";
import UserSidebar from "../app/(page)/superAdmin/organizer/(components)/UserSidebar";

interface UserTableProps {
  rows: UserProps[];
  onDelete?: (row: UserProps) => void;
  onRoleChange?: (row: UserProps) => void;
  onSave?: (row: UserProps) => void;
  onCreate?: () => void;
  enableCreate?: boolean;
}

export default function UserTable({
  rows,
  onDelete,
  onRoleChange,
  onCreate,
  enableCreate = false,
}: UserTableProps) {
  const [search, setSearch] = useState("");
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedRow, setSelectedRow] = useState<UserProps | null>(null);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProps | null>(null);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  const handlePopupClick = (e: React.MouseEvent, row: UserProps) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({ x: rect.left - 75, y: rect.bottom });
    setSelectedRow(row);
  };

  const handleDelete = async (row: UserProps) => {
    try {
      await deleteUser(row.id);
      onDelete?.(row);
      setPopupPosition(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleEdit = () => {
    if (selectedRow) {
      setEditingUser(selectedRow);
      setShowSidebar(true);
      setPopupPosition(null);
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      setEditingUser(null);
      setShowSidebar(true);
    }
    setPopupPosition(null);
  };

  const handleSaveUser = (savedUser: UserProps) => {
    const exists = rows.find((u) => u.id === savedUser.id);
    if (exists) {
      onRoleChange?.(savedUser);
    } else {
      onDelete?.(savedUser);
    }
    setShowSidebar(false);
  };

  useEffect(() => {
    async function fetchEventCounts() {
      const counts: Record<string, number> = {};
      await Promise.all(
        rows.map(async (user) => {
          const count = await getEventCountByOrganizerId(user.id);
          counts[user.id] = count;
        })
      );
      setEventCounts(counts);
    }
    fetchEventCounts();
  }, [rows]);

  useEffect(() => {
    const close = () => setPopupPosition(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User List</h2>
        <Input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-200 text-black">
            <th className="py-2 px-2">No.</th>
            <th className="py-2 px-2">ID</th>
            <th className="py-2 px-2">Name</th>
            <th className="py-2 px-2">Events</th>
            <th className="py-2 px-2">Current Role</th>
            <th className="py-2 px-2"> </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((user, index) => (
            <tr key={user.id} className="border-b hover:bg-muted/30">
              <td className="py-2 px-2">{index + 1}</td>
              <td className="py-2 px-2">{user.id}</td>
              <td className="py-2 px-2">{user.fullName}</td>
              <td className="py-2 px-2">{eventCounts[user.id] ?? 0}</td>
              <td className="py-2 px-2">{user.currentRole}</td>
              <td className="py-2 px-2 text-center flex items-center justify-center">
                <MoreVertical
                  className="w-4 h-4 cursor-pointer"
                  onClick={(ev) => handlePopupClick(ev, user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupPosition && selectedRow && (
        <ConfirmPopupBox
          position={popupPosition}
          onDelete={() => handleDelete(selectedRow)}
          onEdit={handleEdit}
          onCreate={handleCreate}
          onCancel={() => setPopupPosition(null)}
          enableCreate={enableCreate}
        />
      )}

      {showSidebar && (
        <UserSidebar
          user={editingUser}
          onClose={() => setShowSidebar(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
function onSave(savedUser: UserProps) {
  throw new Error("Function not implemented.");
}
