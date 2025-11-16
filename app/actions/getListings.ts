import { convexClient, api } from "@/lib/convexClient";
import { Id } from "@/convex/_generated/dataModel";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    const listings = await convexClient.query(api.listings.getListings, {
      userId: userId as Id<"users"> | undefined,
      category,
      roomCount: roomCount ? +roomCount : undefined,
      guestCount: guestCount ? +guestCount : undefined,
      bathroomCount: bathroomCount ? +bathroomCount : undefined,
      locationValue,
      startDate: startDate ? new Date(startDate).getTime() : undefined,
      endDate: endDate ? new Date(endDate).getTime() : undefined,
    });

    return listings;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
