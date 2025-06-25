"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UserProps,
  createUser,
  updateUser,
  changeUserSystemRole,
  changeUserCurrentRole,
} from "@/app/(api)/user_api";
import { useAuth } from "@/app/hooks/AuthContext";

interface UserSidebarProps {
  user?: UserProps | null;
  onClose: () => void;
  onSave: (user: UserProps) => void;
}

export default function UserSidebar({
  user,
  onClose,
  onSave,
}: UserSidebarProps) {
  const { user: currentUser } = useAuth();
  const isNew = !user?.id;
  const isSuperAdmin = currentUser?.systemRole === "SUPER_ADMIN";

  type FormState = {
    fullName: string;
    currentRole: "VOLUNTEER" | "ATTENDEE";
    systemRole: "USER" | "ADMIN" | "SUPER_ADMIN";
    username: string;
    email: string;
    password: string;
    gender: string;
    age: string;
    org: string;
  };

  const [form, setForm] = useState<FormState>({
    fullName: user?.fullName || "",
    currentRole: (user?.currentRole as "VOLUNTEER" | "ATTENDEE") || "ATTENDEE",
    systemRole:
      (user?.systemRole as "USER" | "ADMIN" | "SUPER_ADMIN") || "USER", // ✅ Added
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    gender: user?.gender || "",
    age: user?.age?.toString() || "",
    org: user?.org || "",
  });

  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.username || !form.email) {
      alert("Name, username, and email are required.");
      return;
    }

    if (isNew && !form.password) {
      alert("Password is required for new users.");
      return;
    }

    try {
      let savedUser: UserProps;

      if (isNew) {
        // Create new user
        const createData = {
          ...form,
          age: form.age ? parseInt(form.age) : undefined,
        };
        savedUser = await createUser(createData);
      } else {
        // Update existing user
        const updateData = {
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          gender: form.gender,
          age: form.age ? parseInt(form.age) : undefined,
          org: form.org,
          ...(form.password && { newPassword: form.password }),
        };
        savedUser = await updateUser(user!.id, updateData);

        if (isSuperAdmin) {
          setIsUpdatingRoles(true);

          // Update system role if changed
          if (form.systemRole !== user?.systemRole) {
            savedUser = await changeUserSystemRole(user!.id, form.systemRole);
          }

          // Update current role if changed
          if (form.currentRole !== user?.currentRole) {
            savedUser = await changeUserCurrentRole(user!.id, form.currentRole);
          }
        }
      }

      onSave(savedUser);
      onClose();
      alert(`User ${isNew ? "created" : "updated"} successfully!`);
    } catch (err: any) {
      console.error("Error saving user:", err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsUpdatingRoles(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto p-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <div className="w-10" />
        <h2 className="text-lg font-semibold">
          {isNew ? "Create User" : `Edit User - ${user?.fullName}`}
        </h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <Input
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Username *</label>
          <Input
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="johndoe"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Password {isNew ? "*" : "(leave empty to keep current)"}
          </label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder={isNew ? "Enter password" : "Enter new password"}
          />
        </div>

        {/* Additional Information */}
        <div>
          <label className="text-sm font-medium">Gender</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Age</label>
          <Input
            type="number"
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="25"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Organization</label>
          <Input
            value={form.org}
            onChange={(e) => handleChange("org", e.target.value)}
            placeholder="Company/Organization"
          />
        </div>

        {/* Role Management (Super Admin Only) */}
        {isSuperAdmin && (
          <>
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-2">Role Management</h3>

              <div>
                <label className="text-sm font-medium">System Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.systemRole}
                  onChange={(e) => handleChange("systemRole", e.target.value)}
                  disabled={isUpdatingRoles}
                >
                  <option value="USER">User (Regular User)</option>
                  <option value="ADMIN">Admin (Event Organizer)</option>
                  <option value="SUPER_ADMIN">
                    Super Admin (System Admin)
                  </option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  System role determines overall permissions in the system
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Current Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.currentRole}
                  onChange={(e) => handleChange("currentRole", e.target.value)}
                  disabled={isUpdatingRoles}
                >
                  <option value="ATTENDEE">Attendee</option>
                  <option value="VOLUNTEER">Volunteer</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Current role determines user's active participation mode
                </p>
              </div>
            </div>
          </>
        )}

        {/* Role Display for Non-Super Admin */}
        {!isSuperAdmin && (
          <div className="border-t pt-4">
            <h3 className="text-md font-semibold mb-2">Current Roles</h3>
            <div className="text-sm">
              <p>
                <strong>System Role:</strong> {user?.systemRole}
              </p>
              <p>
                <strong>Current Role:</strong> {user?.currentRole}
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isUpdatingRoles}
          className="w-full"
        >
          {isUpdatingRoles
            ? "Updating..."
            : isNew
            ? "Create User"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
