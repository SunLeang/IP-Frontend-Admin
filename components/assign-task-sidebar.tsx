"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import {
  assignTaskToVolunteer,
  getTasksByEventId,
  TaskProps,
} from "@/app/(api)/tasks_api";
import {
  getVolunteersByEventId,
  VolunteerProps,
} from "@/app/(api)/volunteers_api";
import axios from "axios";

interface AssignTaskSidebarProps {
  volunteerId: string;
  eventId: string;
  onClose: () => void;
}

export default function AssignVolunteerSidebar({
  volunteerId,
  eventId,
  onClose,
}: AssignTaskSidebarProps) {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByEventId(eventId);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [eventId]);

  const handleAssign = async () => {
    if (!selectedTaskId) {
      alert("Please select a task");
      return;
    }

    const result = await assignTaskToVolunteer(selectedTaskId, volunteerId);

    if (result) {
      alert("Task assigned to volunteer!");
      onClose();
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assign Volunteer to Task</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select a Volunteer</label>
        <select
          className="w-full border border-gray-300 px-3 py-2 rounded"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
        >
          <option value="">-- Choose Task --</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full" onClick={handleAssign}>
        Assign Volunteer
      </Button>
    </div>
  );
}
