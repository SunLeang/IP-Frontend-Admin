"use client";

import React, { useState, useEffect } from "react";
import { Download, Eye, AlertTriangle } from "lucide-react";
import {
  VolunteerProps,
  getVolunteersById,
  updateVolunteerStatus,
} from "@/app/(api)/volunteers_api";
import {
  getMinioDocumentUrl,
  getMinioDocumentProxyUrl,
  normalizeDocumentPath,
  isOldPathFormat,
} from "@/app/(api)/file_upload_api";
import PDFViewer from "./PDFViewer";

interface TaskBarProps {
  onClose: () => void;
  volunteerId: string;
}

export default function TaskBar({ onClose, volunteerId }: TaskBarProps) {
  const [volunteer, setVolunteer] = useState<VolunteerProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📡 Fetching volunteer data for ID:", volunteerId);

        const volunteerData = await getVolunteersById(volunteerId);
        console.log("✅ Volunteer data received:", {
          id: volunteerData.id,
          fullName: volunteerData.fullName,
          email: volunteerData.email,
          whyVolunteer: volunteerData.whyVolunteer,
          cvPath: volunteerData.cvPath,
          whyVolunteerExists: !!volunteerData.whyVolunteer,
          cvPathExists: !!volunteerData.cvPath,
          whyVolunteerLength: volunteerData.whyVolunteer?.length || 0,
        });

        setVolunteer(volunteerData);

        // Enhanced CV path processing
        if (volunteerData.cvPath && volunteerData.cvPath.trim() !== "") {
          console.log("📄 Processing CV path:", {
            original: volunteerData.cvPath,
            isOldFormat: isOldPathFormat(volunteerData.cvPath),
          });

          if (isOldPathFormat(volunteerData.cvPath)) {
            console.warn(
              "⚠️ Old CV format detected - file may not be accessible:",
              volunteerData.cvPath
            );
            setError("CV file is in old format and may not be accessible");
          } else {
            const proxyUrl = getMinioDocumentProxyUrl(volunteerData.cvPath);
            if (proxyUrl) {
              setPdfUrl(proxyUrl);
              console.log("📄 CV proxy URL set:", proxyUrl);
            } else {
              console.warn("⚠️ Could not generate CV proxy URL");
              setError("CV file is not accessible");
            }
          }
        } else {
          console.log("📄 No CV path provided");
        }
      } catch (error: any) {
        console.error("❌ Error fetching volunteer:", error);
        setError(error.message || "Failed to load volunteer data");
      } finally {
        setLoading(false);
      }
    };

    if (volunteerId) {
      fetchVolunteer();
    }
  }, [volunteerId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!volunteer) return;

    try {
      console.log(
        `🔄 Updating volunteer status to: ${newStatus} for ID: ${volunteerId}`
      );

      await updateVolunteerStatus(
        volunteerId,
        newStatus as "APPROVED" | "REJECTED"
      );
      setVolunteer((prev) =>
        prev ? { ...prev, status: newStatus as any } : null
      );
      console.log("✅ Volunteer status updated successfully");
    } catch (error: any) {
      console.error("❌ Error updating volunteer status:", error);
      setError(error.message || "Failed to update status");
    }
  };

  const handleViewCV = () => {
    if (!volunteer?.cvPath) {
      setError("No CV available to view");
      return;
    }

    if (isOldPathFormat(volunteer.cvPath)) {
      setError("CV is in old format and cannot be viewed");
      return;
    }

    if (!pdfUrl) {
      setError("CV URL is not available");
      return;
    }

    console.log("👁️ Opening CV viewer with URL:", pdfUrl);
    setShowPDFViewer(true);
  };

  const handleDownloadCV = () => {
    if (!volunteer?.cvPath) {
      setError("No CV available to download");
      return;
    }

    if (isOldPathFormat(volunteer.cvPath)) {
      setError("CV is in old format and cannot be downloaded");
      return;
    }

    const downloadUrl = getMinioDocumentUrl(volunteer.cvPath);
    if (!downloadUrl) {
      setError("CV download URL is not available");
      return;
    }

    console.log("📥 Downloading CV from URL:", downloadUrl);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `CV_${volunteer.fullName || "volunteer"}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading volunteer details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !volunteer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Volunteer Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {volunteer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900">{volunteer.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{volunteer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event
                  </label>
                  <p className="text-gray-900">{volunteer.eventName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      volunteer.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : volunteer.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {volunteer.status}
                  </span>
                </div>
              </div>

              {/* Show actual volunteer reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to volunteer?
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">
                  {volunteer.whyVolunteer &&
                  volunteer.whyVolunteer.trim() !== ""
                    ? volunteer.whyVolunteer
                    : "No reason provided"}
                </p>
                {/* Debug info */}
                <p className="text-xs text-gray-400 mt-1">
                  Debug: whyVolunteer length ={" "}
                  {volunteer.whyVolunteer?.length || 0}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {/* Show actual CV status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV Document
                </label>
                {volunteer.cvPath && volunteer.cvPath.trim() !== "" ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleViewCV}
                      disabled={isOldPathFormat(volunteer.cvPath) || !pdfUrl}
                      className={`flex items-center px-4 py-2 rounded text-white ${
                        isOldPathFormat(volunteer.cvPath) || !pdfUrl
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View CV
                    </button>
                    <button
                      onClick={handleDownloadCV}
                      disabled={isOldPathFormat(volunteer.cvPath)}
                      className={`flex items-center px-4 py-2 rounded text-white ${
                        isOldPathFormat(volunteer.cvPath)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download CV
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">No CV uploaded</p>
                )}
                {/* Debug CV path */}
                {volunteer.cvPath && (
                  <p className="text-xs text-gray-400 mt-1">
                    Debug: CV Path = {volunteer.cvPath}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                {volunteer.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate("REJECTED")}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("APPROVED")}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPDFViewer && pdfUrl && (
        <PDFViewer
          filename={volunteer?.cvPath || ""}
          onClose={() => setShowPDFViewer(false)}
          applicantName={volunteer?.fullName}
        />
      )}
    </>
  );
}
