import { convexClient, api } from "@/lib/convexClient";
import getCurrentUser from "./getCurrentUser";
import { Id } from "@/convex/_generated/dataModel";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser._id) {
      return [];
    }

    const favorites = await convexClient.query(api.favorites.getFavoriteListings, {
      userId: currentUser._id as Id<"users">,
    });

    return favorites;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
