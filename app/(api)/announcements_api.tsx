import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";

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

const eventId = "7dc32f18-71f6-4e7a-be82-eacf86e22e88";

export async function getAnnouncementsByEventId(): Promise<
  AnnouncementProps[]
> {
  const res = await API.get(`/announcements/event/${eventId}`);

  const data = res.data.map((item: AnnouncementProps) => ({
    ...item,
    date: formatDateTime(item.createdAt),
  }));

  return data;
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
