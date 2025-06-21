"use client";

import React, { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { updateTask } from "@/app/(api)/tasks_api";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface TaskDetailSidebarProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailSidebar({
  task,
  onClose,
}: TaskDetailSidebarProps) {
  const [editableTask, setEditableTask] = useState(task);
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    status: false,
  });

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof Task, value: string) => {
    setEditableTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { id, name, description, status } = editableTask;

      const payload = { name, description, status };

      await updateTask(id, payload);

      alert("Task updated!");
      onClose();
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Error updating task.");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto p-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <div className="w-10" />
        <h2 className="text-lg font-semibold">Tasks-{task.name}</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Name */}
      <Field
        label="Name"
        value={editableTask.name}
        editing={isEditing.name}
        onChange={(val) => handleChange("name", val)}
        onToggle={() => toggleEdit("name")}
      />

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description:</label>
        <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded relative">
          {isEditing.description ? (
            <Textarea
              value={editableTask.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          ) : (
            <p>{editableTask.description}</p>
          )}
          <button onClick={() => toggleEdit("description")}>
            <Pencil size={18} />
          </button>
        </div>
      </div>

      <Field
        label="Status"
        value={editableTask.status}
        editing={isEditing.status}
        onChange={(val) => handleChange("status", val)}
        onToggle={() => toggleEdit("status")}
        type="select"
        options={["PENDING", "IN_PROGRESS", "COMPLETED"]}
      />

      <Button onClick={handleSave}>Done</Button>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  onToggle,
  type = "text",
  options,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
  type?: "text" | "textarea" | "select" | "date" | "time";
  options?: string[]; // for select type
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
        {editing ? (
          type === "textarea" ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : type === "select" && options ? (
            <select
              className="w-full bg-white"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <Input
              type={type === "date" || type === "time" ? type : "text"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        ) : (
          <span>{value}</span>
        )}
        <button onClick={onToggle}>
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}
