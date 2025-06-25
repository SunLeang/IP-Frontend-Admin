"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfirmPopupBox from "../app/(page)/superAdmin/organizer/(components)/ConfirmPopupBox";
import { changeUserRole, deleteUser, UserProps } from "@/app/(api)/user_api";
import { getEventCountByOrganizerId } from "@/app/(api)/events_api";
import UserSidebar from "../app/(page)/superAdmin/organizer/(components)/UserSidebar";
import { useAuth } from "@/app/hooks/AuthContext";

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
  onSave,
  onCreate,
  enableCreate = false,
}: UserTableProps) {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.systemRole === "SUPER_ADMIN";

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
      // Prevent Super Admin from deleting themselves
      if (row.id === currentUser?.id && row.systemRole === "SUPER_ADMIN") {
        alert("You cannot delete your own Super Admin account.");
        setPopupPosition(null);
        return;
      }

      await deleteUser(row.id);
      onDelete?.(row);
      alert(`User ${row.fullName} deleted successfully.`);
      setPopupPosition(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user. Please try again.");
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

  const handleChangeRole = () => {
    if (selectedRow) {
      setEditingUser(selectedRow);
      setShowSidebar(true);
      setPopupPosition(null);
    }
  };

  const handleSaveUser = (savedUser: UserProps) => {
    if (onSave) {
      onSave(savedUser);
    } else {
      const exists = rows.find((u) => u.id === savedUser.id);
      if (exists) {
        onRoleChange?.(savedUser);
      }
    }
    setShowSidebar(false);
  };

  useEffect(() => {
    async function fetchEventCounts() {
      const counts: Record<string, number> = {};
      await Promise.all(
        rows.map(async (user) => {
          try {
            const count = await getEventCountByOrganizerId(user.id);
            counts[user.id] = count;
          } catch (error) {
            console.warn(
              `Failed to get event count for user ${user.id}:`,
              error
            );
            counts[user.id] = 0;
          }
        })
      );
      setEventCounts(counts);
    }

    if (rows.length > 0) {
      fetchEventCounts();
    }
  }, [rows]);

  useEffect(() => {
    const close = () => setPopupPosition(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // role display function with null checks
  const getRoleDisplay = (systemRole?: string, currentRole?: string) => {
    // Default values if undefined
    const safeSystemRole = systemRole || "USER";
    const safeCurrentRole = currentRole || "ATTENDEE";

    const systemRoleColors = {
      USER: "bg-blue-100 text-blue-800",
      ADMIN: "bg-green-100 text-green-800",
      SUPER_ADMIN: "bg-purple-100 text-purple-800",
    };

    const currentRoleColors = {
      ATTENDEE: "bg-gray-100 text-gray-800",
      VOLUNTEER: "bg-orange-100 text-orange-800",
    };

    return (
      <div className="flex flex-col gap-1">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            systemRoleColors[safeSystemRole as keyof typeof systemRoleColors] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {safeSystemRole.replace("_", " ")}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            currentRoleColors[
              safeCurrentRole as keyof typeof currentRoleColors
            ] || "bg-gray-100 text-gray-800"
          }`}
        >
          {safeCurrentRole}
        </span>
      </div>
    );
  };

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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRows.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.fullName || "Unknown User"}
                      </div>
                      {user.age && (
                        <div className="text-sm text-gray-500">
                          Age: {user.age}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.username || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleDisplay(user.systemRole, user.currentRole)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.org || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {eventCounts[user.id] || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => handlePopupClick(e, user)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupPosition && selectedRow && (
        <ConfirmPopupBox
          position={popupPosition}
          onDelete={() => handleDelete(selectedRow)}
          onEdit={handleEdit}
          onCreate={handleCreate}
          onCancel={() => setPopupPosition(null)}
          enableCreate={enableCreate}
          onChangeRole={isSuperAdmin ? handleChangeRole : undefined}
          targetUser={selectedRow}
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
