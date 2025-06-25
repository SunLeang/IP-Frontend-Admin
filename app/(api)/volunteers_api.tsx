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

// Get volunteer applications for admin's events
export async function getVolunteers(): Promise<{ data: VolunteerProps[] }> {
  try {
    console.log("📡 Fetching all volunteer applications for admin");

    // Get admin's events first
    const eventsResponse = await API.get(
      "/events/organizer/" + localStorage.getItem("userId")
    );
    const adminEvents = eventsResponse.data;

    if (!adminEvents || adminEvents.length === 0) {
      console.log("❌ No events found for this admin");
      return { data: [] };
    }

    console.log(`📋 Found ${adminEvents.length} events for admin`);

    // Get volunteer applications (not volunteers) for all admin's events
    const applicationsPromises = adminEvents.map((event: any) =>
      API.get(`/volunteer/event/${event.id}/applications`).catch((error) => {
        console.warn(
          `Failed to fetch applications for event ${event.id}:`,
          error
        );
        return { data: [] };
      })
    );

    const applicationsResponses = await Promise.all(applicationsPromises);

    // Combine all applications from all admin's events
    const allApplications: VolunteerProps[] = [];

    applicationsResponses.forEach((response, index) => {
      const eventApplications = response.data || [];
      const eventInfo = adminEvents[index];

      console.log(
        `📋 Event "${eventInfo.name}" has ${eventApplications.length} applications`
      );

      eventApplications.forEach((application: any) => {
        allApplications.push({
          id: application.id,
          eventId: application.eventId || eventInfo.id,
          userId: application.userId,
          status: application.status,
          appliedAt: new Date(
            application.appliedAt || application.createdAt
          ).toLocaleDateString(),
          approvedAt: application.approvedAt,
          whyVolunteer: application.whyVolunteer || "",
          cvPath: application.cvPath,
          user: application.user,
          event: {
            id: eventInfo.id,
            name: eventInfo.name,
            organizerId: eventInfo.organizerId,
          },
        });
      });
    });

    console.log(`✅ Total applications found: ${allApplications.length}`);
    return { data: allApplications };
  } catch (error) {
    console.error("❌ Failed to fetch volunteer applications:", error);
    return { data: [] };
  }
}

// Get volunteer applications for a specific event
export async function getVolunteersByEventId(
  eventId: string
): Promise<{ data: VolunteerProps[] }> {
  try {
    console.log(`📡 Fetching volunteer applications for event: ${eventId}`);

    // Use the applications endpoint instead of volunteers endpoint
    const response = await API.get(`/volunteer/event/${eventId}/applications`);
    const applications = response.data || [];

    console.log(
      `📋 Found ${applications.length} applications for event ${eventId}`
    );

    const transformedApplications: VolunteerProps[] = applications.map(
      (application: any) => ({
        id: application.id,
        eventId: application.eventId || eventId,
        userId: application.userId,
        status: application.status,
        appliedAt: new Date(
          application.appliedAt || application.createdAt
        ).toLocaleDateString(),
        approvedAt: application.approvedAt,
        whyVolunteer: application.whyVolunteer || "",
        cvPath: application.cvPath,
        user: application.user,
        event: application.event || { id: eventId, name: "", organizerId: "" },
      })
    );

    console.log(
      `✅ Transformed ${transformedApplications.length} applications`
    );
    return { data: transformedApplications };
  } catch (error) {
    console.error(
      `❌ Failed to fetch applications for event ${eventId}:`,
      error
    );
    return { data: [] };
  }
}

// Get a single volunteer application by ID
export async function getVolunteersById(
  volunteerId: string
): Promise<{ data: VolunteerProps }> {
  // alidation and error handling
  if (!volunteerId || volunteerId === "undefined" || volunteerId === "null") {
    console.error("❌ Invalid volunteer ID provided:", volunteerId);
    throw new Error("Invalid volunteer ID provided");
  }

  try {
    console.log(`📡 Fetching volunteer application by ID: ${volunteerId}`);
    const response = await API.get(`/volunteer/applications/${volunteerId}`);
    const application = response.data;

    if (!application) {
      throw new Error("Volunteer application not found");
    }

    const transformedApplication: VolunteerProps = {
      id: application.id,
      eventId: application.eventId,
      userId: application.userId,
      status: application.status,
      appliedAt: new Date(
        application.appliedAt || application.createdAt
      ).toLocaleDateString(),
      approvedAt: application.approvedAt,
      whyVolunteer: application.whyVolunteer || "",
      cvPath: application.cvPath,
      user: application.user,
      event: application.event,
    };

    console.log(
      "✅ Successfully fetched volunteer application:",
      transformedApplication
    );
    return { data: transformedApplication };
  } catch (error) {
    console.error(
      `❌ Failed to fetch volunteer application ${volunteerId}:`,
      error
    );

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("404")) {
        throw new Error(
          `Volunteer application with ID ${volunteerId} not found`
        );
      } else if (error.message.includes("403")) {
        throw new Error(
          "You don't have permission to view this volunteer application"
        );
      } else {
        throw new Error(
          `Failed to fetch volunteer application: ${error.message}`
        );
      }
    }

    throw new Error("Failed to fetch volunteer application data");
  }
}

// Update volunteer application status (approve/reject)
export async function updateVolunteerStatus(
  volunteerId: string,
  status: "APPROVED" | "REJECTED"
): Promise<VolunteerProps> {
  // Validate volunteer ID
  if (!volunteerId || volunteerId === "undefined" || volunteerId === "null") {
    console.error("❌ Invalid volunteer ID provided:", volunteerId);
    throw new Error("Invalid volunteer ID provided");
  }

  try {
    console.log(
      `📝 Updating volunteer application ${volunteerId} status to ${status}`
    );
    const response = await API.patch(
      `/volunteer/applications/${volunteerId}/status`,
      {
        status,
      }
    );

    console.log(
      `✅ Volunteer application ${volunteerId} status updated to ${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to update volunteer application status:`, error);
    throw error;
  }
}

export async function createVolunteerEvent(data: CreateVolunteerEventPayload) {
  try {
    console.log("📤 Creating volunteer application:", data);
    const response = await API.post("/volunteer/applications", data);
    console.log("✅ Volunteer application created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create volunteer application:", error);
    throw error;
  }
}
