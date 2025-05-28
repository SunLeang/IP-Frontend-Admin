"use client";
import { PieChart } from "lucide-react";
import React from "react";
import Link from "next/link";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Attendee" value="40,689" growth="+8.5%" note="Up from yesterday" icon="🧍" color="text-green-500" />
        <Card title="Total Volunteer" value="10,293" growth="+1.3%" note="Up from past week" icon="📦" color="text-green-500" />
        <Card title="Total Event" value="2" growth="-4.3%" note="Down from yesterday" icon="📈" color="text-red-500" />
        <Card title="Pending Volunteers" value="10" growth="+1.8%" note="Up from yesterday" icon="⏱️" color="text-green-500" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className='flex justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Statistic Event Details</h2>
          <div className="flex items-center justify-between mb-4 gap-4">
         
             <Link href='/admin/dashboard/'> <img width={20} src="https://img.icons8.com/?size=100&id=Im6MKqbsOZcm&format=png&color=737373" alt="" /></Link>
               <Link href='/admin/dashboard/dashboard1'>  <PieChart className="h-5 w-5 text-blue-600" /></Link>
          
          </div>
        </div>
        
        <div>{children}</div>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500">
            <tr>
              <th>No.</th>
              <th>Event</th>
              <th>Attendee</th>
              <th>Volunteer</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <EventRow number={1} name="Songkran" attendee="121/121" volunteer="10/10" progress={100} />
            <EventRow number={2} name="BookFair" attendee="113/220" volunteer="18/20" progress={56} />
          </tbody>
        </table>
        {children}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Event Details</h2>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500">
            <tr>
              <th>Event Name</th>
              <th>state</th>
              <th>Location</th>
              <th>Date - Time</th>
              <th>Attendee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <EventDetailRow name="Songkran" location="Aeon Mall Sensok" date="12.09.2025 - 12.53 PM" attendee="121/121" status="Full" />
            <EventDetailRow name="BookFair" location="Institute of Technology of Cambodia" date="12.09.2025 - 12.53 PM" attendee="113/220" status="Pending" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Small reusable components
const Card = ({ title, value, growth, note, icon, color }: any) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className={`text-sm ${color}`}>{growth} {note}</div>
  </div>
);

const EventRow = ({ number, name, attendee, volunteer, progress }: any) => (
  <tr className="border-t">
    <td>{number}</td>
    <td>{name}</td>
    <td>{attendee}</td>
    <td>{volunteer}</td>
    <td>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-yellow-400'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </td>
  </tr>
);

const EventDetailRow = ({ name, location, date, attendee, status }: any) => (
  <tr className="border-t">
    <td>{name}</td>
    <td>{location}</td>
    <td>{date}</td>
    <td>{attendee}</td>
    <td>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Full" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {status}
      </span>
    </td>
  </tr>
);

export default Dashboard;
