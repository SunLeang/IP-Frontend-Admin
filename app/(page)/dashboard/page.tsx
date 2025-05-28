"use client";

import { useState } from "react";
import EventDetailsChart from "./(components)/EventDetailsChart";
import EventDetailsSummary from "./(components)/EventDetailsSummary";
import EventDetails from "./(components)/EventDetails";

const cardData = [
  {
    title: "Total Attendee",
    value: "40,689",
    growth: "+8.5%",
    note: "Up from yesterday",
    icon: "🧍",
    color: "text-green-500",
  },
  {
    title: "Total Volunteer",
    value: "10,293",
    growth: "+1.3%",
    note: "Up from past week",
    icon: "📦",
    color: "text-green-500",
  },
  {
    title: "Total Event",
    value: "2",
    growth: "-4.3%",
    note: "Down from yesterday",
    icon: "📈",
    color: "text-red-500",
  },
  {
    title: "Pending Volunteers",
    value: "10",
    growth: "+1.8%",
    note: "Up from yesterday",
    icon: "⏱️",
    color: "text-green-500",
  },
];

const eventData = [
  {
    number: 1,
    name: "Songkran",
    attendee: "121/121",
    volunteer: "10/10",
    progress: 100,
    location: "Aeon Mall Sensok",
    dateTime: "12.09.2025 - 12.53 PM",
    status: "Full",
  },
  {
    number: 2,
    name: "BookFair",
    attendee: "113/220",
    volunteer: "18/20",
    progress: 56,
    location: "Institute of Technology of Cambodia",
    dateTime: "12.09.2025 - 12.53 PM",
    status: "Pending",
  },
];

const colorPairs: Record<string, string> = {
  "from-green-600": "bg-green-600",
  "from-yellow-500": "bg-yellow-500",
  "from-red-600": "bg-red-600",
  "from-blue-500": "bg-blue-500",
  "from-purple-600": "bg-purple-600",
  "from-pink-600": "bg-pink-600",
};

const colors = Object.keys(colorPairs);

// Assign a random color to each event
const enhancedEventData = eventData.map((event, index) => {
  const color = colors[index % colors.length];
  return { ...event, color };
});

export default function Dashboard() {
  const [isViewChart, setIsViewChart] = useState(true);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Download Report
        </button>
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
          eventNumber={enhancedEventData.length}
          data={enhancedEventData}
          setIsViewChart={setIsViewChart}
          colorPairs={colorPairs}
        />
      ) : (
        <EventDetailsSummary
          data={enhancedEventData}
          setIsViewChart={setIsViewChart}
          colorPairs={colorPairs}
        />
      )}

      {/* Detailed Table */}
      <EventDetails data={enhancedEventData} />
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
