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

//  Remove hardcoded eventId and make it dynamic
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

//  Get all announcements for admin's events
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
    const announcementsPromises = adminEvents.map(
      (event: any) =>
        API.get(`/announcements/event/${event.id}`).catch(() => ({ data: [] })) // ✅ Fixed: return object with data property
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
