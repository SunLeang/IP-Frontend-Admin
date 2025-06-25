import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";

export interface VolunteerProps {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  approvedAt?: string;
  whyVolunteer: string;
  cvPath?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    gender?: string;
    age?: number;
    org?: string;
  };
  event: {
    id: string;
    name: string;
    organizerId: string;
  };
}

export interface CreateVolunteerEventPayload {
  eventId: string;
  whyVolunteer: string;
  cvPath: string;
}

// Get volunteers for admin's events only
export async function getVolunteers(): Promise<{ data: VolunteerProps[] }> {
  try {
    // Get admin's events first
    const eventsResponse = await API.get(
      "/events/organizer/" + localStorage.getItem("userId")
    );
    const adminEvents = eventsResponse.data;

    if (!adminEvents || adminEvents.length === 0) {
      return { data: [] };
    }

    // Get volunteers for all admin's events
    const volunteersPromises = adminEvents.map((event: any) =>
      API.get(`/events/${event.id}/volunteers`).catch(() => ({ data: [] }))
    );

    const volunteersResponses = await Promise.all(volunteersPromises);

    // Combine all volunteers from all admin's events
    const allVolunteers: VolunteerProps[] = [];

    volunteersResponses.forEach((response, index) => {
      const eventVolunteers = response.data || [];
      const eventInfo = adminEvents[index];

      eventVolunteers.forEach((volunteer: any) => {
        allVolunteers.push({
          id: volunteer.id,
          eventId: volunteer.eventId || eventInfo.id,
          userId: volunteer.userId,
          status: volunteer.status,
          appliedAt: new Date(
            volunteer.appliedAt || volunteer.createdAt
          ).toLocaleDateString(),
          approvedAt: volunteer.approvedAt,
          whyVolunteer: volunteer.whyVolunteer || "",
          cvPath: volunteer.cvPath,
          user: volunteer.user,
          event: {
            id: eventInfo.id,
            name: eventInfo.name,
            organizerId: eventInfo.organizerId,
          },
        });
      });
    });

    return { data: allVolunteers };
  } catch (error) {
    console.error("Failed to fetch admin's volunteers:", error);
    return { data: [] };
  }
}

//  Get volunteers for a specific event
export async function getVolunteersByEventId(
  eventId: string
): Promise<{ data: VolunteerProps[] }> {
  try {
    const response = await API.get(`/events/${eventId}/volunteers`);
    const volunteers = response.data || [];

    const transformedVolunteers: VolunteerProps[] = volunteers.map(
      (volunteer: any) => ({
        id: volunteer.id,
        eventId: volunteer.eventId || eventId,
        userId: volunteer.userId,
        status: volunteer.status,
        appliedAt: new Date(
          volunteer.appliedAt || volunteer.createdAt
        ).toLocaleDateString(),
        approvedAt: volunteer.approvedAt,
        whyVolunteer: volunteer.whyVolunteer || "",
        cvPath: volunteer.cvPath,
        user: volunteer.user,
        event: volunteer.event || { id: eventId, name: "", organizerId: "" },
      })
    );

    return { data: transformedVolunteers };
  } catch (error) {
    console.error(`Failed to fetch volunteers for event ${eventId}:`, error);
    return { data: [] };
  }
}

//  Get a single volunteer by ID
export async function getVolunteersById(
  volunteerId: string
): Promise<{ data: VolunteerProps }> {
  try {
    const response = await API.get(`/volunteer/applications/${volunteerId}`);
    const volunteer = response.data;

    const transformedVolunteer: VolunteerProps = {
      id: volunteer.id,
      eventId: volunteer.eventId,
      userId: volunteer.userId,
      status: volunteer.status,
      appliedAt: new Date(
        volunteer.appliedAt || volunteer.createdAt
      ).toLocaleDateString(),
      approvedAt: volunteer.approvedAt,
      whyVolunteer: volunteer.whyVolunteer || "",
      cvPath: volunteer.cvPath,
      user: volunteer.user,
      event: volunteer.event,
    };

    return { data: transformedVolunteer };
  } catch (error) {
    console.error(`Failed to fetch volunteer ${volunteerId}:`, error);
    throw error;
  }
}

//  Update volunteer status (approve/reject)
export async function updateVolunteerStatus(
  volunteerId: string,
  status: "APPROVED" | "REJECTED"
): Promise<VolunteerProps> {
  try {
    const response = await API.patch(
      `/volunteer/applications/${volunteerId}/status`,
      {
        status,
      }
    );

    console.log(`Volunteer ${volunteerId} status updated to ${status}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to update volunteer status:`, error);
    throw error;
  }
}

export async function createVolunteerEvent(data: CreateVolunteerEventPayload) {
  try {
    const response = await API.post("/volunteer/applications", data);
    console.log("Volunteer application created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create volunteer application:", error);
    throw error;
  }
}
