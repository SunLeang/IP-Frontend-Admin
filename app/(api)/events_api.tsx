import { convertTo12Hour } from "@/components/convertTo12Hour";
import API from "../utils/AxiosInstance";

export interface EventProps {
  id: string;
  name: string;
  description: string;
  profileImage: string;
  coverImage: string;
  date: string;
  time: string;
  venue: string;
  locationImage: string;
  status: string;
  acceptingVolunteers: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  organizerId: string;
  category: {
    id: string;
    name: string;
    image: string;
  };
  organizer: string;
  _count: {
    interestedUsers: number;
    attendingUsers: number;
    volunteers: number;
  };
  price: number;
  progress?: number;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  dateTime: string;
  locationDesc: string;
  locationImage: string;
  profileImage: string;
  coverImage: string;
  status: "DRAFT" | "PUBLISHED";
  categoryId: string;
  acceptingVolunteers: boolean;
}

export async function createEvent(data: CreateEventPayload) {
  try {
    const response = await API.post("/events", data);
    console.log("Event created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
}

export async function getEvents(): Promise<{ data: EventProps[] }> {
  try {
    const response = await API.get("/events");
    const rawData = response.data.data;

    const data: EventProps[] = rawData.map((item: any) => {
      const [datePart, timePartWithMs] = item.dateTime.split("T");
      const timeFormatted = convertTo12Hour(timePartWithMs.split(".")[0]);

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        profileImage: item.profileImage,
        coverImage: item.coverImage,
        date: datePart,
        time: timeFormatted,
        venue: item.locationDesc,
        locationImage: item.locationImage,
        status: item.status,
        acceptingVolunteers: item.acceptingVolunteers,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
        categoryId: item.categoryId,
        organizerId: item.organizerId,
        category: {
          id: item.category.id,
          name: item.category.name,
          image: item.category.image,
        },
        organizer: item.organizer.fullName,
        _count: {
          interestedUsers: item._count.interestedUsers,
          attendingUsers: item._count.attendingUsers,
          volunteers: item._count.volunteers,
        },
        price: 8.99,
      };
    });

    return { data };
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return { data: [] };
  }
}

export async function createEvents() {
  try {
    const response = await API.post("/events");
    console.log("response:", response);
    return response;
  } catch (error) {
    console.error("Failed to create event:", error);
  }
}

export async function deleteEvent(id: string) {
  try {
    const response = await API.delete(`/events/${id}`);
    window.location.reload();
    alert(`event: ${id} is deleted!`);
    return response;
  } catch (error) {
    console.error("Failed to delete event:", error);
  } finally {
  }
}

export async function updateEvent(
  id: string,
  data: Partial<CreateEventPayload>
) {
  try {
    console.log("object: " + JSON.stringify(data));
    const response = await API.patch(`/events/${id}`, data);
    console.log("Event updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw error;
  }
}

export async function getEventsByOrganizerId(): Promise<{
  data: EventProps[];
}> {
  try {
    const organizerId = localStorage.getItem("userId");
    if (!organizerId) throw new Error("User ID not found in token");

    const response = await API.get(`/events/organizer/${organizerId}`);
    const rawData = response.data;

    const data: EventProps[] = rawData.map((item: any) => {
      const [datePart, timePartWithMs] = item.dateTime.split("T");
      const timeFormatted = convertTo12Hour(timePartWithMs.split(".")[0]);

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        profileImage: item.profileImage,
        coverImage: item.coverImage,
        date: datePart,
        time: timeFormatted,
        venue: item.locationDesc,
        locationImage: item.locationImage,
        status: item.status,
        acceptingVolunteers: item.acceptingVolunteers,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
        categoryId: item.categoryId,
        organizerId: item.organizerId,
        category: {
          id: item.category.id,
          name: item.category.name,
          image: item.category.image,
        },
        organizer: "",
        _count: {
          interestedUsers: item._count.interestedUsers,
          attendingUsers: item._count.attendingUsers,
          volunteers: item._count.volunteers,
        },
        price: 8.99,
      };
    });

    return { data };
  } catch (error) {
    console.error("Failed to fetch events by organizer:", error);
    return { data: [] };
  }
}
