import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";

export interface AnnouncementProps {
  id: string;
  eventId: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    name: string;
    organizerId: string;
  };
  date?: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  image: string;
  eventId: string;
}

export interface UpdateAnnouncementPayload {
  title: string;
  description: string;
  image: string;
}

// ✅ Remove hardcoded eventId and make it dynamic
export async function getAnnouncementsByEventId(
  eventId: string
): Promise<AnnouncementProps[]> {
  try {
    const res = await API.get(`/announcements/event/${eventId}`);

    const data = res.data.map((item: AnnouncementProps) => ({
      ...item,
      date: formatDateTime(item.createdAt),
    }));

    return data;
  } catch (error) {
    console.error(`Failed to fetch announcements for event ${eventId}:`, error);
    return [];
  }
}

// ✅ Get all announcements for admin's events
export async function getAnnouncementsForAdminEvents(): Promise<
  AnnouncementProps[]
> {
  try {
    // Get admin's events first
    const eventsResponse = await API.get(
      "/events/organizer/" + localStorage.getItem("userId")
    );
    const adminEvents = eventsResponse.data;

    if (!adminEvents || adminEvents.length === 0) {
      return [];
    }

    // Get announcements for all admin's events
    const announcementsPromises = adminEvents.map((event: any) =>
      API.get(`/announcements/event/${event.id}`).catch(() => ({ data: [] }))
    );

    const announcementsResponses = await Promise.all(announcementsPromises);

    // Combine all announcements from all admin's events
    const allAnnouncements: AnnouncementProps[] = [];

    announcementsResponses.forEach((response, index) => {
      const eventInfo = adminEvents[index];

      const eventAnnouncements = Array.isArray(response)
        ? response
        : response.data || [];

      eventAnnouncements.forEach((announcement: any) => {
        allAnnouncements.push({
          ...announcement,
          date: formatDateTime(announcement.createdAt),
          event: {
            id: eventInfo.id,
            name: eventInfo.name,
            organizerId: eventInfo.organizerId,
          },
        });
      });
    });

    return allAnnouncements;
  } catch (error) {
    console.error("Failed to fetch admin's announcements:", error);
    return [];
  }
}

//  Get ALL announcements (for super admin)
export async function getAllAnnouncements(): Promise<AnnouncementProps[]> {
  try {
    // Get all events first
    const eventsResponse = await API.get("/events");

    // Handle different response structures
    let allEvents;
    if (eventsResponse.data?.data) {
      // If response has nested data property
      allEvents = eventsResponse.data.data;
    } else if (Array.isArray(eventsResponse.data)) {
      // If response.data is directly an array
      allEvents = eventsResponse.data;
    } else if (eventsResponse.data?.events) {
      // If response has events property
      allEvents = eventsResponse.data.events;
    } else {
      console.warn(
        "Unexpected events response structure:",
        eventsResponse.data
      );
      return [];
    }

    // Ensure allEvents is an array
    if (!Array.isArray(allEvents)) {
      console.error("Events data is not an array:", allEvents);
      return [];
    }

    if (allEvents.length === 0) {
      console.log("No events found");
      return [];
    }

    console.log(`Found ${allEvents.length} events, fetching announcements...`);

    // Get announcements for each event (sequential to avoid overwhelming server)
    const allAnnouncements: AnnouncementProps[] = [];

    for (const event of allEvents) {
      try {
        const announcementsResponse = await API.get(
          `/announcements/event/${event.id}`
        );

        // Handle announcements response structure
        let eventAnnouncements;
        if (Array.isArray(announcementsResponse.data)) {
          eventAnnouncements = announcementsResponse.data;
        } else if (announcementsResponse.data?.data) {
          eventAnnouncements = announcementsResponse.data.data;
        } else {
          eventAnnouncements = [];
        }

        eventAnnouncements.forEach((announcement: any) => {
          allAnnouncements.push({
            ...announcement,
            date: formatDateTime(announcement.createdAt),
            event: {
              id: event.id,
              name: event.name,
              organizerId: event.organizerId,
            },
          });
        });
      } catch (eventError) {
        // Continue to next event if this one fails
        console.warn(
          `Failed to get announcements for event ${event.name || event.id}:`,
          eventError
        );
        continue;
      }
    }

    console.log(`Found ${allAnnouncements.length} total announcements`);
    return allAnnouncements;
  } catch (error) {
    console.error("Failed to fetch all announcements:", error);

    // Fallback: Try to get announcements for admin events only
    try {
      console.log("Falling back to admin events...");
      return await getAnnouncementsForAdminEvents();
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return [];
    }
  }
}

export async function createAnnouncement(
  data: CreateAnnouncementPayload
): Promise<AnnouncementProps> {
  try {
    const response = await API.post("/announcements", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create announcement:", error);
    throw error;
  }
}

export async function getAnnouncementById(
  id: string
): Promise<AnnouncementProps | null> {
  try {
    const response = await API.get(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get announcement:", error);
    return null;
  }
}

export async function updateAnnouncement(
  id: string,
  data: UpdateAnnouncementPayload
): Promise<AnnouncementProps> {
  try {
    const response = await API.put(`/announcements/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update announcement:", error);
    throw error;
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    await API.delete(`/announcements/${id}`);
    console.log(`Announcement ${id} deleted.`);
    return true;
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return false;
  }
}
