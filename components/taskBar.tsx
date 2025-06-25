import {
  getVolunteersById,
  updateVolunteerStatus,
  VolunteerProps,
} from "@/app/(api)/volunteers_api";
import { useState, useEffect } from "react";

interface TaskBarProps {
  onClose: () => void;
  volunteerId: string;
}

export default function TaskBar({ onClose, volunteerId }: TaskBarProps) {
  const [volunteer, setVolunteer] = useState<VolunteerProps>();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      console.log(`📝 Updating application ${id} to ${status}`);
      await updateVolunteerStatus(id, status);
      // Refresh volunteer data after update
      await fetchVolunteerData();
      alert(`Application ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Failed to update volunteer status:", err);
      alert("Failed to update volunteer status");
    }
  };

  const fetchVolunteerData = async () => {
    // Validate volunteer ID first
    if (!volunteerId || volunteerId === "undefined" || volunteerId === "null") {
      console.error("❌ Invalid volunteer ID:", volunteerId);
      setError("Invalid volunteer ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(
        "📡 Fetching volunteer application data for ID:",
        volunteerId
      );

      const result = await getVolunteersById(volunteerId);
      setVolunteer(result.data);
      console.log("✅ Volunteer application data loaded:", result.data);
    } catch (err) {
      console.error("❌ Failed to fetch volunteer application data:", err);
      setError("Failed to load volunteer application information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerData();
  }, [volunteerId]);

  if (!visible) return null;

  // show error state if volunteer ID is invalid
  if (error) {
    return (
      <aside className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <aside className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading volunteer application...</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Volunteer Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Event</h3>
          <p className="text-blue-700">{volunteer?.event?.name || "N/A"}</p>
        </div>

        <div className="space-y-2">
          <div>
            <span className="font-semibold">Applicant Name: </span>
            {volunteer?.user?.fullName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            {volunteer?.user?.email || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Gender: </span>
            {volunteer?.user?.gender || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Age: </span>
            {volunteer?.user?.age || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Organization: </span>
            {volunteer?.user?.org || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Applied At: </span>
            {volunteer?.appliedAt || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Status: </span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                volunteer?.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : volunteer?.status === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {volunteer?.status || "PENDING"}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Why want to volunteer?</h3>
          <p className="text-gray-700 bg-gray-50 p-3 rounded">
            {volunteer?.whyVolunteer || "No reason provided"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">CV</h3>
          <div className="flex items-center justify-between bg-gray-100 rounded-md p-4 mt-2 mb-6">
            <div className="flex justify-between w-full">
              <div className="flex gap-2 items-center">
                <span className="text-red-500 font-bold">PDF</span>
                <span className="text-sm">
                  {volunteer?.cvPath || "cv_document.pdf"}
                </span>
              </div>
              <span className="text-green-500 text-sm">• Available</span>
            </div>
          </div>

          {/* Only show action buttons if volunteer exists and is pending */}
          {volunteer && volunteer.status === "PENDING" && (
            <div className="flex justify-around w-full gap-4">
              <button
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() =>
                  volunteer.id && handleStatusUpdate(volunteer.id, "REJECTED")
                }
              >
                Reject
              </button>
              <button
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() =>
                  volunteer.id && handleStatusUpdate(volunteer.id, "APPROVED")
                }
              >
                Approve
              </button>
            </div>
          )}

          {volunteer && volunteer.status !== "PENDING" && (
            <div className="text-center py-2">
              <span
                className={`px-4 py-2 rounded ${
                  volunteer.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Application {volunteer.status}
              </span>
            </div>
          )}
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
