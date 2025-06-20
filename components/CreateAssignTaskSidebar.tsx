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
import { usePathname } from "next/navigation";

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
    dueDate: "",
    // status: "Pending" as "Pending" | "In Progress" | "Completed",
    description: "",
  });

  const pathname = usePathname();
  const eventIdPath = pathname.startsWith("/admin/events/")
    ? pathname.split("/")[3]
    : null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("object: " + JSON.stringify(form));
    console.log("2: " + eventIdPath);

    try {
      const task = await createTask({
        name: form.name,
        type: form.type,
        description: form.description,
        dueDate: form.dueDate,
        eventId: eventIdPath ?? eventId,
      });

      alert("Task created");
      onClose();
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.error(
          "You can only create tasks for events you organize.",
          error
        );
        alert("You can only create tasks for events you organize!");
      } else {
        console.error("Error creating task", error);
        alert("Error creating task.");
      }
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
        <label className="text-sm font-medium">Due Date</label>
        <Input
          type="datetime-local"
          value={form.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          placeholder="Select due date and time"
        />
      </div>

      {/* <div className="space-y-2">
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
      </div> */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Create Task
      </Button>
    </div>
  );
}
