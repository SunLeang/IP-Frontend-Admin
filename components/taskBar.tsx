import { useState } from "react";

export default function TaskBar({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Tasks–ev00001
        </h2>

        <div className="space-y-2">
          <div>
            <span className="font-semibold">Name:</span> Yem Daro
          </div>
          <div>
            <span className="font-semibold">Gender:</span> Male
          </div>
          <div>
            <span className="font-semibold">Age:</span> 21
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span className="text-blue-600">Undergraduate</span>
          </div>
          <div>
            <span className="font-semibold">Organization:</span>{" "}
            <span className="text-blue-600">
              Institute of Technology of Cambodia
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Why want to join?</h3>
          <p className="text-gray-700">
            My name is daro single i want to join because i want free drink
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">CV</h3>
          <div className="flex items-center justify-between bg-gray-100 rounded-md p-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">PDF</span>
              <span className="text-sm">Google-certificate.pdf</span>
              <span className="text-green-500 text-sm">• Completed</span>
            </div>
            <button className="text-gray-500 hover:text-red-500 text-xl">
              🗑️
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-4 gap-2">
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Reject
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Accept
          </button>
          <button className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
            Done
          </button>
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
