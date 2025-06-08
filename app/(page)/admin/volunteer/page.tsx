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
import DataTable from "../events/(components)/DataTable";
import Loading from "../events/(components)/Loading";
import ErrorMessage from "../events/(components)/ErrorMessage";
import { getVolunteers } from "@/app/(api)/volunteers_api";
import { useQuery } from "@tanstack/react-query";

type Task = {
  id: string;
  description: string;
  status: string;
  type: string;
  date: string;
};

function Page() {
  const [pageSize, setPageSize] = useState(10);

  const {
    data: volunteers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["volunteers"],
    queryFn: getVolunteers,
    select: (res) => res.data,
  });

  if (isLoading) return <Loading message="Loading tasks..." />;
  if (isError) return <ErrorMessage message="Failed to load tasks." />;

  return (
    <>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Event Volunteers</h1>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <DataTable rows={volunteers || []} title="" dataType="volunteer1" />

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
                1 – {Math.min(pageSize, volunteers?.length ?? 0)} of{" "}
                {volunteers?.length ?? 0}
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
    </>
  );
}

export default Page;
