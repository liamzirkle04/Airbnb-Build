import getCurrentUser from "@/app/actions/getCurrentUser";
import { convexClient, api } from "@/lib/convexClient";
import { NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser._id) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const reservationId = await convexClient.mutation(api.reservations.createReservation, {
    userId: currentUser._id as Id<"users">,
    listingId: listingId as Id<"listings">,
    startDate: new Date(startDate).getTime(),
    endDate: new Date(endDate).getTime(),
    totalPrice: parseInt(totalPrice, 10),
  });

  return NextResponse.json({ id: reservationId });
}
