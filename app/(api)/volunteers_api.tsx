import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";
import axios from "axios";

export interface VolunteerProps {
  id: string;
  name: string;
  whyVolunteer: string;
  cvPath: string;
  status: string;
  appliedAt: string;
  processedAt: string | null;
  userId: string;
  eventId: string;
  event: {
    id: string;
    name: string;
    dateTime: string;
    status: string;
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    age: number;
    org: string;
  };
}

interface CreateVolunteerPayload {
  whyVolunteer: string;
  cvPath: string;
}

export async function getVolunteers() {
  try {
    const response = await API.get("/volunteer/my-applications");
    const rawData = response.data;

    const data: VolunteerProps[] = rawData.map((item: any) => ({
      id: item.id,
      name: "volunteer",
      whyVolunteer: item.whyVolunteer,
      cvPath: item.cvPath,
      status: item.status,
      appliedAt: formatDateTime(item.appliedAt),
      processedAt: formatDateTime(item.processedAt),
      userId: item.userId,
      eventId: item.eventId,
      event: {
        id: item.event.id,
        name: item.event.name,
        dateTime: formatDateTime(item.event.dateTime),
        status: item.event.status,
      },
    }));

    console.log("volunteers:", data);

    return { data };
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return { data: [] };
  }
}

export async function createVolunteerEvent(data: CreateVolunteerPayload) {
  const eventId = "315a4d03-2a7e-4488-b844-6f7494c705e8";

  const payload = {
    ...data,
    eventId,
  };

  console.log("createVolunteerEvent Data:", payload);
  try {
    const response = await API.post("/volunteer/applications", payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      console.log("Conflict: Volunteer application already exists.");
    } else {
      console.error("Failed to create volunteer event:", error);
    }
    throw error;
  }
}

export async function deleteEventVolunteer(
  eventId: string,
  volunteerId: string
) {
  try {
    const response = await API.delete(
      `/volunteer/event/${eventId}/volunteers/&${volunteerId}`
    );
    window.location.reload();
    return response;
  } catch (error) {
    console.error("Failed to delete event:", error);
  } finally {
    alert(`event: ${eventId} is deleted!`);
  }
}

export async function getVolunteersByEventId(eventId: string) {
  try {
    // console.log("eventID Inside API: " + eventId);

    const response = await API.get(`/volunteer/event/${eventId}/applications`);
    const rawData = response.data;

    const data: VolunteerProps[] = rawData.map((item: any) => ({
      id: item.id,
      whyVolunteer: item.whyVolunteer,
      cvPath: item.cvPath,
      status: item.status,
      appliedAt: formatDateTime(item.appliedAt),
      processedAt: formatDateTime(item.processedAt),
      userId: item.userId,
      eventId: item.eventId,
      user: {
        id: item.user.id,
        fullName: item.user.fullName,
        email: item.user.email,
        gender: item.user.status,
        age: item.user.age,
        org: item.user.org,
      },
    }));

    console.log("volunteers By EventId:", data);

    return { data };
  } catch (error) {
    console.error("Error fetching volunteers by Event Id:", error);
    return { data: [] };
  }
}

export async function getVolunteersById(id: string) {
  try {
    const response = await API.get(
      `/volunteer/applications/${id.slice(-38, -1).slice(1)}`
    );
    const data = response.data;
    console.log("volunteers By Id:", data);

    return { data };
  } catch (error) {
    console.error("Error fetching volunteers by Id:", error);
    return { data: [] };
  }
}

export async function updateVolunteerStatus(id: string, status: string) {
  try {
    const response = await API.patch(`/volunteer/applications/${id}/status`, {
      status: status,
    });
    window.location.reload();
    return response;
  } catch (error) {
    console.error("Failed to update volunteer status:", error);
  } finally {
    alert(`Volunteer Status is updated!`);
  }
}
