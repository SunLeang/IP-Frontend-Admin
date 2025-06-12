"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCategories } from "@/services/category-service";
import { Category } from "@/types/category";
import { useEvents } from "@/hooks/useEvents";
import { EventsFilter } from "@/components/events/events-filter";
import { EventsGrid } from "@/components/events/events-grid";

/**
 * Events Page Component
 * Displays a filterable list of events with category filters
 *
 * Features:
 * - Category-based filtering
 * - Loading states
 * - Responsive grid layout
 * - URL parameter support
 */
export default function EventsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryId
  );
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Use the custom hook for events data
  const {
    events,
    isLoading: eventsLoading,
    error,
  } = useEvents(
    selectedCategory
      ? { categoryId: selectedCategory, status: "PUBLISHED" }
      : { status: "PUBLISHED" }
  );

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  /**
   * Handles category filter change
   */
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Category Filters */}
      <EventsFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        isLoading={categoriesLoading}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Events Grid */}
      <EventsGrid events={events} isLoading={eventsLoading} />
    </div>
  );
}
