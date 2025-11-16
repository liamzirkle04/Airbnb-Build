import { convexClient, api } from "@/lib/convexClient";
import { Id } from "@/convex/_generated/dataModel";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservation(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    let reservations = [];

    if (listingId) {
      reservations = await convexClient.query(api.reservations.getReservationsByListing, {
        listingId: listingId as Id<"listings">,
      });
    } else if (userId) {
      reservations = await convexClient.query(api.reservations.getReservationsByUser, {
        userId: userId as Id<"users">,
      });
    } else if (authorId) {
      // For authorId, we need to get listings first, then reservations
      const listings = await convexClient.query(api.listings.getListings, {
        userId: authorId as Id<"users">,
      });
      
      const allReservations = await Promise.all(
        listings.map((listing) =>
          convexClient.query(api.reservations.getReservationsByListing, {
            listingId: listing.id as Id<"listings">,
          })
        )
      );
      
      reservations = allReservations.flat();
    }

    return reservations;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
