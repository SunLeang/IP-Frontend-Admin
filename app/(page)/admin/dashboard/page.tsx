"use client";
import { useState } from "react";
import EventDetailsSummary from "./(components)/EventDetailsSummary";
import EventDetails from "./(components)/EventDetails";
import dynamic from "next/dynamic";
import { colorPairs, colors } from "./(components)/ColorPairs";
import { useQuery } from "@tanstack/react-query";
import { getAttendanceStatsByEventId } from "@/app/(api)/attendances_api";
import {
  getDashboardStats,
  getDashboardUpcoming,
} from "@/app/(api)/dashboard_api";

// Hydration Fail Error (Fix By Disabling Server Side Rendering)
const EventDetailsChart = dynamic(
  () => import("./(components)/EventDetailsChart"),
  {
    ssr: false,
  }
);

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStats(),
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => getDashboardUpcoming(),
  });

  const [isViewChart, setIsViewChart] = useState(false);

  const cardData = [
    {
      title: "Total Attendees",
      value: `${stats?.totalAttendees}`,
      growth: "+8.5%",
      note: "Up from past week",
      icon: "🧍",
      color: "text-green-500",
    },
    {
      title: "Total Volunteers",
      value: `${stats?.totalVolunteers}`,
      growth: "+1.3%",
      note: "Up from past week",
      icon: "📦",
      color: "text-green-500",
    },
    {
      title: "Total Events",
      value: `${stats?.totalEvents}`,
      growth: "-4.3%",
      note: "Down from past week",
      icon: "📈",
      color: "text-red-500",
    },
    {
      title: "Completed Events",
      value: `${stats?.completedEvents}`,
      growth: "+1.8%",
      note: "Up from past week",
      icon: "⏱️",
      color: "text-green-500",
    },
  ];

  if (!upcoming) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Events Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      {/* Summary Details and Chart */}
      {isViewChart ? (
        <EventDetailsChart
          data={upcoming || []}
          setIsViewChart={setIsViewChart}
          // colorPairs={colorPairs}
        />
      ) : (
        <EventDetailsSummary
          data={upcoming || []}
          setIsViewChart={setIsViewChart}
          colorPairs={colorPairs}
        />
      )}

      {/* Detailed Table */}
      <EventDetails data={upcoming || []} />
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  growth: string;
  note: string;
  icon: string;
  color: string;
}

const Card = ({ title, value, growth, note, icon, color }: CardProps) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className={`text-sm ${color}`}>
      {growth} {note}
    </div>
  </div>
);
