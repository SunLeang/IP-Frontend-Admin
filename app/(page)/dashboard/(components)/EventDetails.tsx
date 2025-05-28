"use client";

interface Event {
  name: string;
  location: string;
  dateTime: string;
  attendee: string;
  status: string;
}

interface EventDetailsProps {
  data: Event[];
}

const eventDetailHeaders = [
  "Event Name",
  "Location",
  "Date - Time",
  "Attendee",
  "Status",
];

export default function EventDetails({ data }: EventDetailsProps) {
  return (
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
            {eventDetailHeaders.map((header, index) => (
              <th key={index} className="py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((event, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{event.name}</td>
              <td>{event.location}</td>
              <td>{event.dateTime}</td>
              <td>{event.attendee}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    event.status === "Full"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
