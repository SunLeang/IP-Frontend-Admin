import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";

export interface AttendanceProps {
  userId: string;
  eventId: string;
  status: string;
  registeredAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    age: number;
    org: string;
    currentRole: string;
  };
}

export async function getEventAttendees(): Promise<AttendanceProps[]> {
  const eventId = "7dc32f18-71f6-4e7a-be82-eacf86e22e88";

  const res = await API.get(`/events/${eventId}/attendees`);
  const data = res.data.map((item: AttendanceProps) => ({
    ...item,
    registeredAt: formatDateTime(item.registeredAt),
  }));
  return data;
}

export async function getAttendances(): Promise<AttendanceProps[]> {
  const res = await API.get("/attendances");
  return res.data;
}

export async function getAttendanceByEventId(
  eventId: string
): Promise<AttendanceProps[]> {
  const res = await API.get(`/attendances`, {
    params: { eventId },
  });
  return res.data;
}

export async function createAttendance(
  data: Partial<AttendanceProps>
): Promise<AttendanceProps> {
  const res = await API.post("/attendances", data);
  return res.data;
}
