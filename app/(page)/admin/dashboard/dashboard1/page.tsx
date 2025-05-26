"use client";
import { PieChart } from "lucide-react";
import React from "react";
import Link from "next/link";


export default function Dashboard1() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
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
      {/* Top Stats */}
      {/* <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Attendee", value: "40,689", change: "+8.5%", desc: "Up from yesterday", color: "text-green-500", icon: "🧑‍🤝‍🧑" },
          { label: "Total Volunteer", value: "10,293", change: "+1.3%", desc: "Up from past week", color: "text-green-500", icon: "📦" },
          { label: "Total Event", value: "2", change: "-4.3%", desc: "Down from yesterday", color: "text-red-500", icon: "📊" },
          { label: "Total Volunteer Pending", value: "10", change: "+1.8%", desc: "Up from yesterday", color: "text-green-500", icon: "⏰" },
        ].map((stat, index) => (
          <Card key={index} className="col-span-1">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h2 className="text-xl font-bold">{stat.value}</h2>
                  <p className={`text-xs ${stat.color}`}>{stat.change} {stat.desc}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Statistic Event Details */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Statistic Event Details</h2>
          <div className="flex items-center justify-between mb-4 gap-4">
         
             <Link href='/admin/dashboard/'> <img width={20} src="https://img.icons8.com/?size=100&id=Im6MKqbsOZcm&format=png&color=737373" alt="" /></Link>
               <Link href='/admin/dashboard/dashboard1'>  <PieChart className="h-5 w-5 text-blue-600" /></Link>
          
          </div>
        
        </div>
        <hr className="mb-4" />
        <div className="flex justify-center">
          {/* Placeholder for chart */}
          <div className="w-64 h-32 bg-gradient-to-r from-blue-400 to-green-500 rounded-full flex items-center justify-center">
            <h3 className="text-white font-bold text-xl">2 Events</h3>
          </div>
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-600 rounded-full" />
            <span>Songkran</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>BookFair</span>
          </div>
        </div>
      </div>

      {/* Event Details Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Event Details</h2>
          <select className="border rounded px-2 py-1 text-sm">
            <option>October</option>
          </select>
        </div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2">Event Name</th>
              <th>Location</th>
              <th>Date - Time</th>
              <th>Attendee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Songkran</td>
              <td>Aeon Mall Sensok</td>
              <td>12.09.2025 - 12.53 PM</td>
              <td>121/121</td>
              <td><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Full</span></td>
            </tr>
            <tr>
              <td className="py-2">BookFair</td>
              <td>Institute of Technology of Cambodia</td>
              <td>12.09.2025 - 12.53 PM</td>
              <td>113/220</td>
              <td><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  function Card({ title, value, growth, note, icon, color }: any) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-sm ${color}`}>{growth} {note}</div>
      </div>
    );
  }
}
