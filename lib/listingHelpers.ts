import { safeListing } from "@/types";
import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

export interface GroupedListings {
  location: string;
  locationLabel: string;
  listings: safeListing[];
}

/**
 * Groups listings by their location and returns the top locations
 * @param listings - Array of listings to group
 * @param limit - Maximum number of location groups to return
 * @returns Array of grouped listings by location
 */
export function groupListingsByLocation(
  listings: safeListing[],
  limit: number = 5
): GroupedListings[] {
  // Group listings by location
  const locationMap = new Map<string, safeListing[]>();

  listings.forEach((listing) => {
    const existing = locationMap.get(listing.locationValue) || [];
    locationMap.set(listing.locationValue, [...existing, listing]);
  });

  // Convert to array and sort by number of listings
  const grouped = Array.from(locationMap.entries())
    .map(([location, listings]) => {
      const country = formattedCountries.find((c) => c.value === location);
      return {
        location,
        locationLabel: country?.label || location,
        listings,
      };
    })
    .sort((a, b) => b.listings.length - a.listings.length)
    .slice(0, limit);

  return grouped;
}

/**
 * Gets popular listings based on criteria (e.g., number of reservations, recent activity)
 * @param listings - Array of listings
 * @param limit - Maximum number of listings to return
 * @returns Array of popular listings
 */
export function getPopularListings(
  listings: safeListing[],
  limit: number = 10
): safeListing[] {
  // For now, return the most recent listings
  // In a real app, this could be based on number of bookings, ratings, etc.
  return listings.slice(0, limit);
}

/**
 * Groups listings by category
 * @param listings - Array of listings
 * @param limit - Maximum number of category groups to return
 * @returns Array of grouped listings by category
 */
export function groupListingsByCategory(
  listings: safeListing[],
  limit: number = 5
): { category: string; listings: safeListing[] }[] {
  const categoryMap = new Map<string, safeListing[]>();

  listings.forEach((listing) => {
    const existing = categoryMap.get(listing.category) || [];
    categoryMap.set(listing.category, [...existing, listing]);
  });

  return Array.from(categoryMap.entries())
    .map(([category, listings]) => ({
      category,
      listings,
    }))
    .sort((a, b) => b.listings.length - a.listings.length)
    .slice(0, limit);
}
