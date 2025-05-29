import React from "react";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function LogoutAlert({
  isOpen,
  onClose,
  onLogout,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[320px] text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Log out?</h2>
        <p className="text-sm text-gray-600 mb-4">Are you sure?</p>
        <div className="flex justify-between gap-3">
          <button
            className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-800 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
