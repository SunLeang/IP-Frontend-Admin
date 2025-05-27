"use client";

import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";

interface Attendee {
  id: string;
  name: string;
  gender: "Male" | "Female";
  date: string;
  status?: string;
}

const volunteers = [
  {
    id: "ev-000011",
    name: "Yem Daro",
    gender: "Male",
    date: "12-12-2024",
    status: "",
  },
  {
    id: "ev-000012",
    name: "Chhoung Seang",
    gender: "Male",
    date: "12-12-2024",
    status: "Volunteering",
  },
  {
    id: "ev-000013",
    name: "Meng Hour",
    gender: "Male",
    date: "12-12-2024",
    status: "Volunteering",
  },
  {
    id: "ev-000014",
    name: "Ratanak",
    gender: "Male",
    date: "12-12-2024",
    status: "",
  },
  {
    id: "ev-000015",
    name: "Yeata",
    gender: "Female",
    date: "12-12-2024",
    status: "Volunteering",
  },
  {
    id: "ev-000016",
    name: "Lita",
    gender: "Female",
    date: "12-12-2024",
    status: "",
  },
  {
    id: "ev-000017",
    name: "Choranay",
    gender: "Female",
    date: "12-12-2024",
    status: "",
  },
  {
    id: "ev-000018",
    name: "Nita",
    gender: "",
    date: "12-12-2024",
    status: "Volunteering",
  },
  {
    id: "ev-000019",
    name: "Sonit",
    gender: "",
    date: "12-12-2024",
    status: "Volunteering",
  },
  {
    id: "ev-000020",
    name: "Sivhou",
    gender: "",
    date: "12-12-2024",
    status: "",
  },
];

const headers = ["No.", "ID", "Name", "Gender", "Date", ""];

export default function page() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Volunteer</h2>
        <DataTable
          title="Volunteer"
          headers={headers}
          rows={volunteers}
          filterStatus="Volunteering"
          showStatusToggle={true}
        />
      </div>
    </div>
  );
}
