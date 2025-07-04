"use client";
import { EventProps } from "@/app/(api)/events_api";
import { getMinioImageUrl } from "@/app/(api)/file_upload_api";
import { Star, StarIcon } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  events: EventProps[];
  onSeeMore?: () => void;
  isExpanded?: boolean;
  showSeeMoreButton?: boolean;
  showView?: boolean;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
}

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export default function EventCard({
  events,
  onSeeMore,
  isExpanded,
  showSeeMoreButton,
}: EventCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/images/placeholder.png";
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-14">
        {events.map(
          (
            {
              id,
              name,
              coverImage,
              date,
              venue,
              time,
              price,
              _count,
              category,
            },
            index
          ) => (
            <Link
              key={`event-${id}-${index}`}
              href={`/superAdmin/events/${id}`}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md border cursor-pointer hover:shadow-lg transition">
                {/* Use regular img tag for MinIO images */}
                <div className="relative">
                  <div>
                    <img
                      src={getMinioImageUrl(coverImage)}
                      alt={`${name} cover image`}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute bottom-0 bg-orange-300 text-sm text-white px-2 py-1">
                      {category?.name || "Uncategorized"}
                    </div>
                  </div>
                  {/* Top-right Save Icon */}
                  <div className="absolute top-2 right-2 bg-white px-1 py-1 rounded-full shadow">
                    <StarIcon size={12} color="black" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex gap-4 items-start h-16">
                    <div className="text-center">
                      {/* month */}
                      {Array.isArray(date) && date.length >= 4 ? (
                        <>
                          <div className="text-md font-semibold text-purple-800">
                            {month[parseInt(date[1], 10) - 1] || "Jan"}
                          </div>
                          <div className="text-xl font-bold">{date[2]}</div>
                        </>
                      ) : (
                        <div className="text-gray-400">Invalid date</div>
                      )}

                      <div className="text-xl font-bold">
                        {/* day */}
                        {Array.isArray(date) && date.length >= 4 ? date[3] : ""}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-semibold leading-tight">
                        {name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{venue}</p>
                    </div>
                  </div>

                  {/* Time, Price, Interested */}
                  <div className="flex sm:flex-col sm:items-start 2xl:flex-row justify-between items-center mt-4 text-sm text-gray-600">
                    <div>
                      <p>{time}</p>
                    </div>
                    <div className="flex gap-2">
                      <span>$ {price || 0}</span>
                      <span>💙 {_count?.interestedUsers || 0} interested</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      {/* See More */}
      {showSeeMoreButton && events.length > 0 && (
        <div className="flex justify-center mt-10">
          <button onClick={onSeeMore} className="px-6 py-2 border rounded-full">
            {isExpanded ? "See Less" : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}
