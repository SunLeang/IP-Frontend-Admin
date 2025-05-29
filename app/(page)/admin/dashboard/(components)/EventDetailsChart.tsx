"use client";
import { PieChartIcon } from "lucide-react";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
interface EventData {
  number: number;
  name: string;
  attendee: string;
  volunteer: string;
  progress: number;
  location: string;
  dateTime: string;
  status: string;
  color?: string;
}

interface EventDetailsChartProps {
  eventNumber: number;
  data: EventData[];
  setIsViewChart: (value: boolean) => void;
  colorPairs: Record<string, string>;
}

export default function EventDetailsChart({
  eventNumber,
  setIsViewChart,
  data,
  colorPairs,
}: EventDetailsChartProps) {
  function fromToToClass(fromClass: string): string {
    if (!fromClass.startsWith("from-")) return "";
    return fromClass.replace("from-", "to-");
  }

  const colorFrom = data[0]?.color;
  const colorTo = fromToToClass(data[1]?.color || "from-green-600");

  const gradient = `bg-gradient-to-r ${colorFrom} ${colorTo}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Event Chart</h2>
        <div className="flex items-center justify-between mb-4 gap-4">
          <button className="flex gap-2" onClick={() => setIsViewChart(false)}>
            <img
              width={20}
              src="https://img.icons8.com/?size=100&id=Im6MKqbsOZcm&format=png&color=737373"
              alt="Dashboard icon"
            />
            <PieChartIcon className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Pie Chart */}
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "series A" },
              { id: 1, value: 15, label: "series B" },
              { id: 2, value: 20, label: "series C" },
            ],
            innerRadius: 30,
            outerRadius: 100,
            // paddingAngle: 5,
            cornerRadius: 5,
            startAngle: 180,
            endAngle: 60,
          },
        ]}
        width={200}
        height={200}
      />

      {/* <div className="flex justify-center">
        <div
          className={`${gradient} w-64 h-32 rounded-full flex items-center justify-center`}
        >
          <h3 className="text-white font-bold text-xl">
            {eventNumber} {eventNumber === 1 ? "Event" : "Events"}
          </h3>
        </div>
      </div> */}

      <div className="flex justify-center mt-4 gap-4">
        {data.map((event, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className={`${
                colorPairs[event.color || "from-green-600"]
              } w-3 h-3 rounded-full`}
            />

            <span>{event.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
