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
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listingId = await convexClient.mutation(api.listings.createListing, {
    title,
    description,
    imageSrc,
    category,
    roomCount: parseInt(roomCount, 10),
    bathroomCount: parseInt(bathroomCount, 10),
    guestCount: parseInt(guestCount, 10),
    locationValue: location.value,
    price: parseInt(price, 10),
    userId: currentUser._id as Id<"users">,
  });

  return NextResponse.json({ id: listingId });
}
