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
  //   console.log("res 1: " + JSON.stringify(res.data));
  return res.data;
}

export async function getDashboardStats(): Promise<DashboardStatsProps> {
  const res = await API.get(`/events/dashboard/stats`);
  const data = res.data;
  //   console.log("res 2: " + JSON.stringify(res.data));

  if (data.role === "ADMIN") {
    return {
      role: data.role,
      totalEvents: data.myTotalEvents,
      publishedEvents: data.myPublishedEvents,
      draftEvents: data.myDraftEvents,
      completedEvents: data.myCompletedEvents,
      cancelledEvents: data.myCancelledEvents,
      totalAttendees: data.myTotalAttendees,
      totalVolunteers: data.myTotalVolunteers,
    };
  }

  return data;
}

export async function getDashboardUpcoming(): Promise<EventProps[]> {
  const res = await API.get(`events/dashboard/upcoming`, {});

  const data = res.data.data.map((item: EventProps) => ({
    ...item,
    date: formatDateTime(item.createdAt),
  }));

  //   console.log("data : " + JSON.stringify(data[0].date));

  return data;
}
