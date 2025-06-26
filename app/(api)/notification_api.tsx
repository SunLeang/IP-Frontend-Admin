import API from "@/app/utils/AxiosInstance";

export interface Notification {
  id: string;
  userId: string;
  eventId?: string;
  announcementId?: string;
  applicationId?: string;
  type: string;
  message: string;
  read: boolean;
  sentAt: string;
  event?: { id: string; name: string };
  announcement?: any;
  application?: {
    id: string;
    status: string;
    event: { id: string; name: string };
  };
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await API.get("/notifications");
  console.log("DDDD: " + res.data);
  return res.data;
}

export async function getNotificationById(id: string): Promise<Notification> {
  const res = await API.get(`/notifications/${id}`);
  return res.data;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await API.get("/notifications/unread-count");

  return res.data.count;
}

export async function markNotificationAsRead(
  id: string
): Promise<Notification> {
  const res = await API.patch(`/notifications/${id}/read`);
  return res.data;
}
