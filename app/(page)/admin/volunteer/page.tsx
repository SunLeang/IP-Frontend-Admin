"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Printer,
} from "lucide-react";

const tasks = [
  {
    id: "ev-000001",
    description: "Event Setup & Cleanup",
    status: "Pending",
    type: "Logistic",
    date: "12-12-2024",
  },
  {
    id: "ev-000002",
    description: "Book Organization",
    status: "Pending",
    type: "Logistic",
    date: "12-12-2024",
  },
  {
    id: "ev-000003",
    description: "Guess Assistance",
    status: "Pending",
    type: "Assistance",
    date: "12-12-2024",
  },
  {
    id: "ev-000004",
    description: "Inventory Management",
    status: "Done",
    type: "Logistic",
    date: "12-12-2024",
  },
  {
    id: "ev-000005",
    description: "Event Photography",
    status: "Done",
    type: "Media",
    date: "12-12-2024",
  },
  {
    id: "ev-000006",
    description: "Safety & Security Awareness",
    status: "Pending",
    type: "Assistance",
    date: "12-12-2024",
  },
  {
    id: "ev-000007",
    description: "Visitor Feedback Collection",
    status: "Done",
    type: "Media",
    date: "12-12-2024",
  },
  {
    id: "ev-000008",
    description: "Announcement Assistance",
    status: "Pending",
    type: "Assistance",
    date: "12-12-2024",
  },
  {
    id: "ev-000009",
    description: "Decor & Atmosphere",
    status: "Done",
    type: "IT",
    date: "12-12-2024",
  },
  {
    id: "ev-000010",
    description: "Vendor & Exhibitor Support",
    status: "Done",
    type: "Assistance",
    date: "12-12-2024",
  },
];

function TaskDetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg px-3 py-2 flex justify-between items-center">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="flex items-center gap-2 text-sm">
        <span>{value}</span>
        <DropdownMenu />
      </div>
    </div>
  );
}

function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600 text-sm"
      >
        ✎
      </button>
      {open && (
        <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
            Assign to
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  type Task = {
    id: string;
    description: string;
    status: string;
    type: string;
    date: string;
  };
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const menuRef = useRef(null);

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setActiveMenu(null);
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Events Task:</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Home size={16} className="text-gray-400" />
            <span className="text-gray-600">Events</span>
            <span>&gt;</span>
            <span className="font-medium text-gray-800">Volunteers</span>
          </div>

          <div className="relative flex items-center border border-gray-300 rounded-full px-3 py-1 w-full sm:w-72 bg-white shadow-sm">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="flex-grow outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Filter size={16} className="text-gray-400 mx-2" />
            <button onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-10 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10"
              >
                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm">
                  <Plus size={16} className="mr-2" /> Create
                </button>
                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm">
                  <Printer size={16} className="mr-2" /> Print
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-600 font-semibold">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Types</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, i) => (
                  <tr
                    key={task.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{task.id}</td>
                    <td className="px-4 py-2">{task.description}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "Done"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{task.type}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col items-start relative">
                        <span className="text-sm">{task.date}</span>
                        <button
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === task.id ? null : task.id
                            )
                          }
                        >
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                        {activeMenu === task.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10"
                          >
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 w-full"
                              onClick={() => {
                                setSelectedTask(task);
                                setActiveMenu(null);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 w-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Complete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-4">
                    No matching tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span>
                1 – {pageSize} of {tasks.length}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  &laquo;
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  &lsaquo;
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  &rsaquo;
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedTask && (
        <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl border-l p-4 z-50 overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h2 className="text-base font-semibold text-gray-700">
              Tasks-{selectedTask.id}
            </h2>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-gray-500 hover:text-red-500 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            {(["description", "type", "status"] as (keyof Task)[]).map(
              (field) => (
                <TaskDetailField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={selectedTask[field]}
                />
              )
            )}

            <div>
              <h3 className="text-base font-semibold mt-4 mb-1">
                Description:
              </h3>
              <div className="flex justify-between items-start">
                <p className="text-sm leading-snug text-gray-600">
                  Help arrange tables, book displays, banners, and decorations
                  before and after the event.
                </p>
                <DropdownMenu />
              </div>
            </div>

            <div className="pt-4">
              <button className="px-4 py-1.5 bg-indigo-900 text-white text-sm rounded">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
