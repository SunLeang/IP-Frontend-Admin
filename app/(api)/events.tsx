import { useState } from "react";
import { EventProps } from "../(page)/admin/events/EventCard";
import API from "../utils/AxiosInstance";

export async function getEvents() {
  try {
    const response = await API.get("/events");
    const rawData = response.data.data;

    const data: EventProps[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      img: item.coverImage,
      date: item.dateTime.split("T")[0].split("-"),
      venue: item.locationDesc,
      time: item.dateTime.split("T")[1].split(".")[0],
      price: 8.99,
      interested: item._count.interestedUsers,
      category: item.category.name,
    }));

    console.log("response:", data);

    return { data };
  } catch (error) {}
  return { data: [] };
}

export async function createEvents() {
  try {
    const response = await API.post("/events");
    console.log("response:", response);

    return response;
  } catch (error) {}
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
