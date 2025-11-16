import getCurrentUser from "@/app/actions/getCurrentUser";
import { convexClient, api } from "@/lib/convexClient";
import { NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

interface IPrisma {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IPrisma }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser._id) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  const isFavorite = await convexClient.mutation(api.favorites.toggleFavorite, {
    userId: currentUser._id as Id<"users">,
    listingId: listingId as Id<"listings">,
  });

  const updatedUser = await convexClient.query(api.users.getUserById, {
    userId: currentUser._id as Id<"users">,
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: IPrisma }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser._id) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  const isFavorite = await convexClient.mutation(api.favorites.toggleFavorite, {
    userId: currentUser._id as Id<"users">,
    listingId: listingId as Id<"listings">,
  });

  const updatedUser = await convexClient.query(api.users.getUserById, {
    userId: currentUser._id as Id<"users">,
  });

  return NextResponse.json(updatedUser);
}
