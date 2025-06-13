import { useState, useEffect } from "react";
import { getEvents } from "../(api)/events_api";

/**
 * Return type for useEvents hook
 */
interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing events data
 * Handles loading states, error handling, and data fetching
 *
 * @param filters - Optional filter parameters
 * @returns Object containing events data, loading state, and error state
 */
export function useEvents(filters?: EventsFilterParams): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches events data
   */
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching events with filters:", filters);

      const eventsData = await getEvents(filters);
      setEvents(eventsData);

      console.log(`Successfully loaded ${eventsData.length} events`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load events";
      console.error("Error in useEvents:", err);
      setError(errorMessage);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchEvents();
  };

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchEvents();
  }, [filters?.categoryId, filters?.status, filters?.acceptingVolunteers]);

  return {
    events,
    isLoading,
    error,
    refetch,
  };
}
