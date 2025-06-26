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
  fullName: string;
  email: string;
  gender?: string;
  age?: string;
  eventName: string;
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
          // ✅ Add flat fields for TaskBar compatibility
          fullName: application.user?.fullName || "",
          email: application.user?.email || "",
          gender: application.user?.gender,
          age: application.user?.age?.toString(),
          eventName: eventInfo.name,
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
        // ✅ Add flat fields for TaskBar compatibility
        fullName: application.user?.fullName || "",
        email: application.user?.email || "",
        gender: application.user?.gender,
        age: application.user?.age?.toString(),
        eventName: application.event?.name || "",
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

// ✅ FIXED: Single getVolunteersById function with proper field mapping
export async function getVolunteersById(id: string): Promise<VolunteerProps> {
  // Validation and error handling
  if (!id || id === "undefined" || id === "null") {
    console.error("❌ Invalid volunteer ID provided:", id);
    throw new Error("Invalid volunteer ID provided");
  }

  try {
    console.log(`📡 Fetching volunteer application by ID: ${id}`);
    const response = await API.get(`/volunteer/applications/${id}`);
    const application = response.data;

    if (!application) {
      throw new Error("Volunteer application not found");
    }

    // ✅ Enhanced debugging to see what backend returns
    console.log("✅ Raw volunteer data from API:", {
      id: application.id,
      fullName: application.user?.fullName,
      email: application.user?.email,
      whyVolunteer: application.whyVolunteer,
      cvPath: application.cvPath,
      // Debug the actual field names returned
      allFields: Object.keys(application),
      userFields: application.user ? Object.keys(application.user) : [],
      // Check if there are alternative field names
      alternativeFields: {
        reason: application.reason,
        volunteerReason: application.volunteerReason,
        applicationReason: application.applicationReason,
        cv: application.cv,
        cvDocument: application.cvDocument,
        documentPath: application.documentPath,
      },
    });

    const transformedApplication: VolunteerProps = {
      id: application.id,
      eventId: application.eventId,
      userId: application.userId,
      status: application.status,
      appliedAt: new Date(
        application.appliedAt || application.createdAt
      ).toLocaleDateString(),
      approvedAt: application.approvedAt,
      // ✅ Try different possible field names for volunteer reason
      whyVolunteer:
        application.whyVolunteer ||
        application.reason ||
        application.volunteerReason ||
        application.applicationReason ||
        "",
      // ✅ Try different possible field names for CV path
      cvPath:
        application.cvPath ||
        application.cv ||
        application.cvDocument ||
        application.documentPath ||
        "",
      // ✅ Add flat fields for TaskBar compatibility
      fullName: application.user?.fullName || "",
      email: application.user?.email || "",
      gender: application.user?.gender,
      age: application.user?.age?.toString(),
      eventName: application.event?.name || "Unknown Event",
      user: application.user,
      event: application.event,
    };

    console.log(
      "✅ Successfully fetched and transformed volunteer application:",
      {
        id: transformedApplication.id,
        fullName: transformedApplication.fullName,
        email: transformedApplication.email,
        whyVolunteer: transformedApplication.whyVolunteer
          ? "✅ Present"
          : "❌ Missing",
        cvPath: transformedApplication.cvPath ? "✅ Present" : "❌ Missing",
        whyVolunteerLength: transformedApplication.whyVolunteer?.length || 0,
        cvPathValue: transformedApplication.cvPath || "NOT_SET",
      }
    );

    return transformedApplication;
  } catch (error: any) {
    console.error(`❌ Failed to fetch volunteer application ${id}:`, error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("404")) {
        throw new Error(`Volunteer application with ID ${id} not found`);
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
