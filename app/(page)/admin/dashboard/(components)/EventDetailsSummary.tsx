"use client";
import { getDashboardUpcoming } from "@/app/(api)/dashboard_api";
import { EventProps } from "@/app/(api)/events_api";
import { useQuery } from "@tanstack/react-query";
import { PieChart } from "lucide-react";

interface EventData {
  number: number;
  name: string;
  attendee: string;
  volunteer: string;
  progress: number;
  color?: string;
}

interface EventDetailsSummaryProps {
  data?: EventProps[];
  setIsViewChart(value: boolean): void;
  colorPairs: Record<string, string>;
}

export default function EventDetailsSummary({
  data,
  setIsViewChart,
  colorPairs,
}: EventDetailsSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold ">Event Details Summary</h2>
        <div className="flex items-center justify-between mb-4 gap-4">
          <button
            className="flex gap-2"
            onClick={() => {
              setIsViewChart(true);
            }}
          >
            <img
              width={20}
              src="https://img.icons8.com/?size=100&id=Im6MKqbsOZcm&format=png&color=737373"
              alt="Dashboard icon"
            />
            <PieChart className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-gray-500">
          <tr className="text-gray-600 border-b">
            {["No.", "Event", "Attendee", "Volunteer", "Progress"].map(
              (title, index) => (
                <th key={index}>{title}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <EventRow
              key={index}
              number={index + 1}
              name={row.name}
              attendee={row._count.attendingUsers?.toString() ?? "0"}
              volunteer={row._count.volunteers?.toString() ?? "0"}
              progress={row.progress ?? 70}
              color={colorPairs[row.name] ?? "from-green-600"}
              fromToBgMap={colorPairs}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface EventRowProps extends EventData {
  number: number;
  name: string;
  attendee: string;
  volunteer: string;
  progress: number;
  color: string | "from-green-600";
  fromToBgMap: Record<string, string>;
}

const EventRow = (eventRow: EventRowProps) => {
  const progressBarColor = "bg-green-500";

  return (
    <tr className="border-b">
      <td className="py-2">{eventRow.number}</td>
      <td className="flex items-center gap-2 py-2">
        <span
          className={`${eventRow.color.replace(
            "from-",
            "bg-"
          )} w-3 h-3 rounded-full inline-block`}
        />
        {eventRow.name}
      </td>
      <td className="py-2 lg:px-6 xl:px-6">{eventRow.attendee}</td>
      <td className="py-2 lg:px-6 xl:px-6">{eventRow.volunteer}</td>
      <td className="py-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${progressBarColor} h-2.5 rounded-full`}
            style={{ width: `${eventRow.progress}%` }}
          />
        </div>
      </td>
    </tr>
  );
};
