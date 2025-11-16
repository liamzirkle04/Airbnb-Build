import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { convexClient, api } from "@/lib/convexClient";
import { Id } from "@/convex/_generated/dataModel";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  // Verify the listing belongs to the user before deleting
  const listing = await convexClient.query(api.listings.getListingById, {
    listingId: listingId as Id<"listings">,
  });

  if (!listing || listing.userId !== currentUser._id) {
    return NextResponse.error();
  }

  await convexClient.mutation(api.listings.deleteListing, {
    listingId: listingId as Id<"listings">,
  });

  return NextResponse.json({ success: true });
}
