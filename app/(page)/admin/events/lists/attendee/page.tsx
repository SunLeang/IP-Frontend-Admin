"use client";

import Header from "../../(components)/Header";
import DataTable from "../../(components)/DataTable";

interface Attendee {
  id: string;
  name: string;
  status: "Attending" | "Interested";
  gender: "Male" | "Female";
  date: string;
}

const attendees = [
  {
    id: "ev-000001",
    name: "Sun Leang",
    status: "Attending",
    gender: "Male",
    date: "12-12-2024",
  },
  {
    id: "ev-000002",
    name: "Kishima",
    status: "Attending",
    gender: "Male",
    date: "12-12-2024",
  },
  {
    id: "ev-000003",
    name: "Wathrak",
    status: "Attending",
    gender: "Female",
    date: "12-12-2024",
  },
  {
    id: "ev-000004",
    name: "Jeffrey",
    status: "Attending",
    gender: "Male",
    date: "12-12-2024",
  },
  {
    id: "ev-000005",
    name: "Srey Roth",
    status: "Attending",
    gender: "Female",
    date: "12-12-2024",
  },
  {
    id: "ev-000006",
    name: "Arata",
    status: "Interested",
    gender: "Female",
    date: "12-12-2024",
  },
  {
    id: "ev-000007",
    name: "Srey Neth",
    status: "Attending",
    gender: "Female",
    date: "12-12-2024",
  },
  {
    id: "ev-000008",
    name: "Subaru",
    status: "Interested",
    gender: "Male",
    date: "12-12-2024",
  },
  {
    id: "ev-000009",
    name: "Melissa",
    status: "Interested",
    gender: "Male",
    date: "12-12-2024",
  },
  {
    id: "ev-000010",
    name: "CR7",
    status: "Attending",
    gender: "Female",
    date: "12-12-2024",
  },
];

const headers = ["No.", "ID", "Name", "Status", "Gender", "Date", ""];

export default function page() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="table-box">
        {/* <h2 className="text-xl font-semibold mb-4">Attendees</h2> */}
        <DataTable
          title="Attendees"
          headers={headers}
          rows={attendees}
          filterStatus="Attending"
          showStatusToggle={true}
        />
      </div>
    </div>
  );
}
