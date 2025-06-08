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

// "id": "b311733e-d5f8-4fe3-9b78-e51519553a0d",
//             "name": "Upcoming Hackathon",
//             "description": "A 48-hour coding competition",
//             "profileImage": "songkran.png",
//             "coverImage": "songkran.png",
//             "dateTime": "2025-08-15T10:00:00.000Z",
//             "locationDesc": "Tech Hub",
//             "locationImage": "songkran.png",
//             "status": "DRAFT",
//             "acceptingVolunteers": true,
//             "createdAt": "2025-05-31T08:32:12.949Z",
//             "updatedAt": "2025-05-31T08:32:12.949Z",
//             "deletedAt": null,
//             "categoryId": "5e3b2694-b683-4934-a4fa-6f6c1ba1f331",
//             "organizerId": "57d55b44-31ac-4222-be13-90e3976f9858",
//             "category": {
//                 "id": "5e3b2694-b683-4934-a4fa-6f6c1ba1f331",
//                 "name": "Technology",
//                 "image": "songkran.png"
//             },
//             "organizer": {
//                 "id": "57d55b44-31ac-4222-be13-90e3976f9858",
//                 "fullName": "Event Organizer"
//             },
//             "_count": {
//                 "interestedUsers": 1,
//                 "attendingUsers": 0,
//                 "volunteers": 1
//             }
