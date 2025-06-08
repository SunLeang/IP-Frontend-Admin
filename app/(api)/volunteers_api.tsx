import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";

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
