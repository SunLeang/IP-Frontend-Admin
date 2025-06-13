import {
  getVolunteersById,
  updateVolunteerStatus,
  VolunteerProps,
} from "@/app/(api)/volunteers_api";
import { useState } from "react";

interface TaskBarProps {
  onClose: () => void;
  volunteerId: string;
}

import { useEffect } from "react";

export default function TaskBar({ onClose, volunteerId }: TaskBarProps) {
  const [volunteer, setVolunteer] = useState<VolunteerProps>();
  const [visible, setVisible] = useState(true);

  const handleStatusUpdate = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    await updateVolunteerStatus(id, status);
  };

  useEffect(() => {
    getVolunteersById(volunteerId).then((result) => {
      setVolunteer(result.data);
    });
  }, [volunteerId]);

  if (!visible) return null;

  return (
    <aside className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          {volunteer?.event?.name}
        </h2>

        <div className="space-y-2">
          <div>
            <span className="font-semibold">Name: </span>{" "}
            {volunteer?.user?.fullName}
          </div>
          <div>
            <span className="font-semibold">Gender: </span>
            {volunteer?.user?.gender.toLocaleLowerCase()}
          </div>
          <div>
            <span className="font-semibold">Age: </span> {volunteer?.user?.age}
          </div>
          <div>
            <span className="font-semibold">Status: </span>
            <span className="text-blue-600">{volunteer?.status}</span>
          </div>
          <div>
            <span className="font-semibold">Organization: </span>
            <span className="text-blue-600">{volunteer?.user?.org}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Why want to join?</h3>
          <p className="text-gray-700">
            My name is daro single i want to join because i want free drink.
          </p>
          {/* <p className="text-gray-700">{volunteer?.whyVolunteer}</p> */}
        </div>

        <div>
          <h3 className="text-lg font-semibold">CV</h3>
          <div className="flex items-center justify-between bg-gray-100 rounded-md p-4 mt-2 mb-6">
            <div className="flex justify-between w-full">
              <div className="flex gap-2 items-center">
                <span className="text-red-500 font-bold">PDF </span>
                <span className="text-sm">my_certificate.pdf</span>
              </div>
              <span className="text-green-500 text-sm">• Completed</span>
            </div>
          </div>
          <div className="flex justify-around w-full">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() =>
                volunteer?.id && handleStatusUpdate(volunteer.id, "REJECTED")
              }
            >
              Reject
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() =>
                volunteer?.id && handleStatusUpdate(volunteer.id, "APPROVED")
              }
            >
              Accept
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={onClose}
          >
            Close Sidebar
          </button>
        </div>
      </div>
    </aside>
  );
}
