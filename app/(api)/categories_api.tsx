import API from "../utils/AxiosInstance";

export interface EventCategory {
  id: string;
  name: string;
  image?: string;
}

export async function getEventCategories(): Promise<EventCategory[]> {
  try {
    const response = await API.get("/event-categories");
    const data = response.data;

    // console.log("fetched categories:", data);

    const categories = data.map((cat: EventCategory) => ({
      id: cat.id,
      name: cat.name,
    }));

    return categories;
  } catch (error) {
    console.error("Failed to fetch event categories:", error);
    return [];
  }
}
