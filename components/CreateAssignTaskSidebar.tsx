"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { X } from "lucide-react";

import {
  getVolunteersByEventId,
  VolunteerProps,
} from "@/app/(api)/volunteers_api";
import { assignTaskToVolunteer, createTask } from "@/app/(api)/tasks_api";

interface CreateAssignTaskSidebarProps {
  eventId: string;
  onClose: () => void;
}

export default function CreateAssignTaskSidebar({
  eventId,
  onClose,
}: CreateAssignTaskSidebarProps) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    status: "Pending" as "Pending" | "In Progress" | "Completed",
    description: "",
    volunteerId: "",
  });

  const [volunteers, setVolunteers] = useState<VolunteerProps[]>([]);

  useEffect(() => {
    const loadVolunteers = async () => {
      const result = await getVolunteersByEventId(eventId);
      setVolunteers(result?.data || []);
    };
    loadVolunteers();
  }, [eventId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const task = await createTask({
        name: form.name,
        type: form.type,
        status: form.status,
        description: form.description,
        eventId,
      });

      if (form.volunteerId) {
        await assignTaskToVolunteer(task.id, form.volunteerId);
      }

      alert("Task created and assigned!");
      onClose();
    } catch (error) {
      console.error("Error creating or assigning task", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create & Assign Task</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Task Name</label>
        <Input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter task name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Input
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          placeholder="Enter task type"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <select
          className="w-full border border-gray-300 px-3 py-2 rounded"
          value={form.status}
          onChange={(e) =>
            handleChange(
              "status",
              e.target.value as "Pending" | "In Progress" | "Completed"
            )
          }
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Assign to Volunteer</label>
        <select
          className="w-full border border-gray-300 px-3 py-2 rounded"
          value={form.volunteerId}
          onChange={(e) => handleChange("volunteerId", e.target.value)}
        >
          <option value="">-- Select a volunteer --</option>
          {volunteers.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.fullName}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Create & Assign Task
      </Button>
    </div>
  );
}
