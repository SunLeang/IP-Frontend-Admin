"use client";

import React, { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { updateEvent } from "@/app/(api)/events_api";

interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  organizer: string;
  status: string;
}

interface EventDetailSidebarProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailSidebar({
  event,
  onClose,
}: EventDetailSidebarProps) {
  const [editableEvent, setEditableEvent] = useState(event);
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    venue: false,
    // date: false,
    // time: false,
    organizer: false,
    status: false,
  });

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof Event, value: string) => {
    setEditableEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { id, ...rest } = editableEvent;
      const payload = {
        ...rest,
        status: (["DRAFT", "PUBLISHED"].includes(rest.status)
          ? rest.status
          : "DRAFT") as "DRAFT" | "PUBLISHED",
      };

      await updateEvent(editableEvent.id, {
        name: editableEvent.name,
        description: editableEvent.description,
        // dateTime: `${editableEvent.date}T${editableEvent.time}`,
        locationDesc: editableEvent.venue,
        status: editableEvent.status as "DRAFT" | "PUBLISHED",
      });
      alert("Event updated!");
      onClose();
    } catch (err) {
      console.error("Failed to update event", err);
      alert("Error updating event.");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto p-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <div className="w-10" />
        <h2 className="text-lg font-semibold">Event - {event.name}</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <Field
        label="Name"
        value={editableEvent.name}
        editing={isEditing.name}
        onChange={(val) => handleChange("name", val)}
        onToggle={() => toggleEdit("name")}
      />

      <Field
        label="Venue"
        value={editableEvent.venue}
        editing={isEditing.venue}
        onChange={(val) => handleChange("venue", val)}
        onToggle={() => toggleEdit("venue")}
      />

      {/* <Field
        label="Date"
        value={editableEvent.date}
        editing={isEditing.date}
        type="date"
        onChange={(val) => handleChange("date", val)}
        onToggle={() => toggleEdit("date")}
      /> */}

      {/* <Field
        label="Time"
        value={editableEvent.time}
        editing={isEditing.time}
        type="time"
        onChange={(val) => handleChange("time", val)}
        onToggle={() => toggleEdit("time")}
      /> */}

      <Field
        label="Organizer"
        value={editableEvent.organizer}
        editing={isEditing.organizer}
        onChange={(val) => handleChange("organizer", val)}
        onToggle={() => toggleEdit("organizer")}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        {isEditing.status ? (
          <select
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={editableEvent.status}
            onChange={(e) =>
              handleChange("status", e.target.value as "DRAFT" | "PUBLISHED")
            }
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        ) : (
          <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
            <span>{editableEvent.status}</span>
            <button onClick={() => toggleEdit("status")}>
              <Pencil size={18} />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Description:</label>
        <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded relative">
          {isEditing.description ? (
            <Textarea
              value={editableEvent.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          ) : (
            <p>{editableEvent.description}</p>
          )}
          <button onClick={() => toggleEdit("description")}>
            <Pencil size={18} />
          </button>
        </div>
      </div>

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
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
  type?: "text" | "textarea" | "select" | "date" | "time";
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
        {editing ? (
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
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
