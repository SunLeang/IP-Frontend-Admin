"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserProps, createUser, updateUser } from "@/app/(api)/user_api";

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
  const isNew = !user?.id;

  type FormState = {
    fullName: string;
    currentRole: "VOLUNTEER" | "ATTENDEE";
    username: string;
    email: string;
    password: string;
  };

  const [form, setForm] = useState<FormState>({
    fullName: user?.fullName || "",
    currentRole: (user?.currentRole as "VOLUNTEER" | "ATTENDEE") || "VOLUNTEER",
    username: user?.username || "",
    email: user?.email || "",
    password: user?.password || "",
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.username || !form.email) {
      alert("All fields are required.");
      return;
    }
    try {
      if (isNew) {
        const created = await createUser(form);
        onSave(created);
      } else {
        const updated = await updateUser(user!.id, form);
        onSave(updated);
      }
      onClose();
      alert(`User ${isNew ? "created" : "updated"} successfully!`);
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Something went wrong.");
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

      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Username</label>
          <Input
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.currentRole}
            onChange={(e) => handleChange("currentRole", e.target.value)}
          >
            <option value="VOLUNTEER">Volunteer</option>
            <option value="ATTENDEE">Attendee</option>
          </select>
        </div>

        <Button onClick={handleSubmit}>{isNew ? "Create" : "Save"}</Button>
      </div>
    </div>
  );
}
