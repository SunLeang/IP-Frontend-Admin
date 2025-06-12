import React from "react";

interface ConfirmPopupProps {
  position: { x: number; y: number };
  onOpenTask: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onView?: () => void;
  showView?: boolean;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  position,
  onOpenTask,
  onDelete,
  onCancel,
  onView,
  showView = false,
}) => {
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
      <button
        className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
        onClick={() => {
          onOpenTask();
        }}
      >
        Open Task Sidebar
      </button>
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
};

export default ConfirmPopup;
