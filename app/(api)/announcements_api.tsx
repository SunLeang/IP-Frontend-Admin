import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";

export interface AnnouncementProps {
  id: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  date?: string;
}

const eventId = "b311733e-d5f8-4fe3-9b78-e51519553a0d";

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
  payload: Partial<AnnouncementProps>
): Promise<AnnouncementProps> {
  const res = await API.post("/announcements", payload);
  return res.data;
}
