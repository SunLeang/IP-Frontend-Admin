"use client";
import { PieChartIcon } from "lucide-react";
import * as React from "react";
import { legendClasses } from "@mui/x-charts/ChartsLegend";
import { PieChart } from "@mui/x-charts/PieChart";
import { PiecewiseColorLegend } from "@mui/x-charts/ChartsLegend";
import { EventProps } from "@/app/(api)/events_api";

interface EventDetailsChartProps {
  data?: EventProps[];
  setIsViewChart: (value: boolean) => void;
}

export default function EventDetailsChart({
  setIsViewChart,
  data,
}: EventDetailsChartProps) {
  function fromToToClass(fromClass: string): string {
    if (!fromClass.startsWith("from-")) return "";
    return fromClass.replace("from-", "to-");
  }

  const colorFrom = "from-blue-600";
  const colorTo = fromToToClass("from-green-600");

  const gradient = `bg-gradient-to-r ${colorFrom} ${colorTo}`;

  const pie = data?.map((event, index) => ({
    id: index + 1,
    value: Math.floor(Math.random() * 101),
    label: event.name,
  }));

  if (data?.length === 0) {
    return <div className="text-center text-gray-500">No upcoming events.</div>;
  }

  return (
    <div className="bg-white pt-4 pr-4 pl-4 rounded-lg shadow-md mb-6">
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
            data: pie ?? [],
            innerRadius: 90,
            outerRadius: 145,
            // cornerRadius: 5,
            startAngle: -90,
            endAngle: 90,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            cx: 145,
            cy: 150,
            // paddingAngle: 5,
            // arcLabel: (item) => `${item.value}%`,
          },
        ]}
        // slots={{ legend: PiecewiseColorLegend }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: {
              vertical: "bottom",
              horizontal: "center",
            },
            sx: {
              gap: "16px",
              [`.${legendClasses.mark}`]: {
                height: 15,
                width: 15,
              },
              [".MuiChartsLegend-series"]: {
                gap: "8px",
              },
            },
          },
        }}
        // hideLegend={false}
        width={300}
        height={200}
      />

      <div className="flex justify-center relative bottom-24">
        <h3 className="text-gray-600 font-bold text-l text-center">
          <div>{data?.length}</div>
          <div>{data?.length === 1 ? "Event" : "Events"}</div>
        </h3>
      </div>

      {/* Manual Legends */}
      {/* <div className="flex justify-center pb-10 gap-4">
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
      </div> */}
    </div>
  );
}
