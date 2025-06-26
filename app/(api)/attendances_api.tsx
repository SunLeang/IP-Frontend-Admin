import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";

export interface AttendanceProps {
  id: string;
  userId: string;
  eventId: string;
  status: "JOINED" | "LEFT";
  registeredAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    age?: number;
    org?: string;
  };
  event?: {
    id: string;
    name: string;
    organizerId: string;
  };
}

export interface AttendanceStatsProps {
  total?: string;
  joined?: string;
  leftEarly?: string;
  noShow?: string;
}

//  Get attendees for admin's events only
export async function getEventAttendees(): Promise<AttendanceProps[]> {
  try {
    // Get admin's events first
    const eventsResponse = await API.get(
      "/events/organizer/" + localStorage.getItem("userId")
    );
    const adminEvents = eventsResponse.data;

    if (!adminEvents || adminEvents.length === 0) {
      return [];
    }

    // Get attendees for all admin's events
    const attendeesPromises = adminEvents.map((event: any) =>
      API.get(`/events/${event.id}/attendees`)
    );

    const attendeesResponses = await Promise.all(attendeesPromises);

    // Combine all attendees from all admin's events
    const allAttendees: AttendanceProps[] = [];

    attendeesResponses.forEach((response, index) => {
      const eventAttendees = response.data.data || response.data || [];
      const eventInfo = adminEvents[index];

      eventAttendees.forEach((attendee: any) => {
        allAttendees.push({
          id: attendee.id,
          userId: attendee.userId,
          eventId: attendee.eventId,
          status: attendee.status,
          registeredAt: new Date(attendee.updatedAt).toLocaleDateString(),
          updatedAt: attendee.updatedAt,
          user: attendee.user,
          event: {
            id: eventInfo.id,
            name: eventInfo.name,
            organizerId: eventInfo.organizerId,
          },
        });
      });
    });

    return allAttendees;
  } catch (error) {
    console.error("Failed to fetch admin's event attendees:", error);
    return [];
  }
}

//  Get attendees for a specific event (with permission check)
export async function getEventAttendeesByEventId(
  eventId: string
): Promise<AttendanceProps[]> {
  try {
    const response = await API.get(`/events/${eventId}/attendees`);
    const attendees = response.data.data || response.data || [];

    return attendees.map((attendee: any) => ({
      id: attendee.id,
      userId: attendee.userId,
      eventId: attendee.eventId,
      status: attendee.status,
      registeredAt: new Date(attendee.updatedAt).toLocaleDateString(),
      updatedAt: attendee.updatedAt,
      user: attendee.user,
    }));
  } catch (error) {
    console.error(`Failed to fetch attendees for event ${eventId}:`, error);
    return [];
  }
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

export async function getAttendanceStatsByEventId(): Promise<
  AttendanceStatsProps[]
> {
  const eventId = "7dc32f18-71f6-4e7a-be82-eacf86e22e88";

  const res = await API.get(`/attendance/event/${eventId}/stats`, {
    params: { eventId },
  });
  console.log("res: " + JSON.stringify(res.data));
  return res.data;
}
