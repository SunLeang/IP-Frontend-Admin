import React from "react";

interface ConfirmPopupProps {
  position: { x: number; y: number };
  onOpenTask: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onView?: () => void;
  showView?: boolean;
  showOpenTaskSidebar?: boolean;
  onAssignTask?: () => void;
  showAssignTask?: boolean;
  onViewDetails?: () => void;
  showViewDetails?: boolean;
}

export default function ConfirmPopup({
  position,
  onOpenTask,
  onDelete,
  onCancel,
  onView,
  showView = false,
  showOpenTaskSidebar = false,
  onAssignTask,
  showAssignTask = false,
  onViewDetails,
  showViewDetails = false,
}: ConfirmPopupProps) {
  return (
    <div
      className="absolute bg-white shadow-lg border border-gray-200 rounded-md z-50"
      style={{
        top: position.y + window.scrollY,
        left: position.x,
      }}
    >
      {showView && (
        <button
          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
          onClick={() => {
            onView?.();
            onCancel();
          }}
        >
          View
        </button>
      )}

      {showAssignTask && onAssignTask && (
        <button
          onClick={() => {
            onAssignTask();
            onCancel();
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Create Task
        </button>
      )}

      {showViewDetails && onViewDetails && (
        <button
          onClick={() => {
            onViewDetails();
            onCancel();
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          View Details
        </button>
      )}

      {showOpenTaskSidebar && (
        <button
          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
          onClick={() => {
            onOpenTask();
          }}
        >
          Open Task Sidebar
        </button>
      )}

      <button
        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
        onClick={() => {
          onDelete();
        }}
      >
        Delete
      </button>
      <button
        className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}
