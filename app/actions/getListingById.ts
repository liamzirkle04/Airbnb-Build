import { convexClient, api } from "@/lib/convexClient";
import { Id } from "@/convex/_generated/dataModel";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    if (!listingId) {
      return null;
    }

    const listing = await convexClient.query(api.listings.getListingById, {
      listingId: listingId as Id<"listings">,
    });

    if (!listing) {
      return null;
    }

    return listing;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
