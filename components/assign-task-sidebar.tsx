"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { assignTaskToVolunteer } from "@/app/(api)/tasks_api";
import {
  getVolunteersByEventId,
  VolunteerProps,
} from "@/app/(api)/volunteers_api";

interface AssignVolunteerSidebarProps {
  taskId: string;
  eventId: string;
  onClose: () => void;
}

export default function AssignVolunteerSidebar({
  taskId,
  eventId,
  onClose,
}: AssignVolunteerSidebarProps) {
  const [volunteers, setVolunteers] = useState<VolunteerProps[]>([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const data = await getVolunteersByEventId(eventId);
        setVolunteers(data.data);
      } catch (error) {
        console.error("Failed to fetch volunteers:", error);
      }
    };

    fetchVolunteers();
  }, [eventId]);

  const handleAssign = async () => {
    if (!selectedVolunteerId) {
      alert("Please select a volunteer");
      return;
    }

    console.log("VolunteerId: " + selectedVolunteerId);
    try {
      await assignTaskToVolunteer(taskId, selectedVolunteerId);
      alert("Volunteer assigned to task!");
      onClose();
    } catch (error) {
      console.error("Failed to assign volunteer:", error);
      alert("Failed to assign volunteer.");
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
          value={selectedVolunteerId}
          onChange={(e) => setSelectedVolunteerId(e.target.value)}
        >
          <option value="">-- Choose Volunteer --</option>
          {volunteers.map((volunteer) => (
            <option key={volunteer.id} value={volunteer.id}>
              {volunteer.user?.fullName} ({volunteer.user?.email})
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
