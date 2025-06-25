import { formatDateTime } from "@/components/formatDateTime";
import API from "../utils/AxiosInstance";
import { EventProps } from "./events_api";

export interface DashboardOverviewProps {
  role: "SUPER_ADMIN" | "ADMIN";
  overview: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    totalAttendees: number;
    totalVolunteers: number;
  };
  upcomingEvents: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    events: EventProps[];
  };
}

export interface DashboardStatsProps {
  role: "SUPER_ADMIN" | "ADMIN";
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalAttendees: number;
  totalVolunteers: number;
}

export async function getDashboardOverview(): Promise<DashboardOverviewProps> {
  const res = await API.get(`/events/dashboard`, {});
  return res.data;
}

export async function getDashboardStats(): Promise<DashboardStatsProps> {
  const res = await API.get(`/events/dashboard/stats`);
  const data = res.data;

  //  Handle both ADMIN and SUPER_ADMIN roles correctly
  if (data.role === "ADMIN") {
    return {
      role: data.role,
      totalEvents: data.myTotalEvents || data.overview?.myTotalEvents || 0,
      publishedEvents:
        data.myPublishedEvents || data.overview?.myPublishedEvents || 0,
      draftEvents: data.myDraftEvents || data.overview?.myDraftEvents || 0,
      completedEvents:
        data.myCompletedEvents || data.overview?.myCompletedEvents || 0,
      cancelledEvents:
        data.myCancelledEvents || data.overview?.myCancelledEvents || 0,
      totalAttendees:
        data.myTotalAttendees || data.overview?.myTotalAttendees || 0,
      totalVolunteers:
        data.myTotalVolunteers || data.overview?.myTotalVolunteers || 0,
    };
  }

  // For SUPER_ADMIN, return system-wide stats
  return {
    role: data.role,
    totalEvents: data.overview?.totalEvents || data.totalEvents || 0,
    publishedEvents:
      data.overview?.publishedEvents || data.publishedEvents || 0,
    draftEvents: data.overview?.draftEvents || data.draftEvents || 0,
    completedEvents:
      data.overview?.completedEvents || data.completedEvents || 0,
    cancelledEvents:
      data.overview?.cancelledEvents || data.cancelledEvents || 0,
    totalAttendees: data.overview?.totalAttendees || data.totalAttendees || 0,
    totalVolunteers:
      data.overview?.totalVolunteers || data.totalVolunteers || 0,
  };
}

export async function getDashboardUpcoming(): Promise<EventProps[]> {
  const res = await API.get(`events/dashboard/upcoming`, {});

  const data = res.data.data.map((item: EventProps) => ({
    ...item,
    date: formatDateTime(item.createdAt),
  }));

  return data;
}
