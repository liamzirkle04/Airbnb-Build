import getCurrentUser from "@/app/actions/getCurrentUser";
import { convexClient, api } from "@/lib/convexClient";
import { NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser._id) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid Id");
  }

  // Get reservation to verify ownership
  const reservations = await convexClient.query(api.reservations.getReservationsByUser, {
    userId: currentUser._id as Id<"users">,
  });

  const reservation = reservations.find((r) => r.id === reservationId);

  if (!reservation) {
    // Check if user owns the listing - get all user's listings and check their reservations
    const userListings = await convexClient.query(api.listings.getListings, {
      userId: currentUser._id as Id<"users">,
    });
    
    for (const listing of userListings) {
      const listingReservations = await convexClient.query(api.reservations.getReservationsByListing, {
        listingId: listing.id as Id<"listings">,
      });
      
      const foundReservation = listingReservations.find((r) => r.id === reservationId);
      if (foundReservation) {
        await convexClient.mutation(api.reservations.deleteReservation, {
          reservationId: reservationId as Id<"reservations">,
        });
        return NextResponse.json({ success: true });
      }
    }
    
    return NextResponse.error();
  }

  await convexClient.mutation(api.reservations.deleteReservation, {
    reservationId: reservationId as Id<"reservations">,
  });

  return NextResponse.json({ success: true });
}
