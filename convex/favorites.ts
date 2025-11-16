import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Toggle favorite (add or remove listing from user's favorites)
export const toggleFavorite = mutation({
  args: {
    userId: v.id("users"),
    listingId: v.id("listings"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const favoriteIds = user.favoriteIds || [];
    const listingIdStr = args.listingId;
    const isFavorite = favoriteIds.includes(listingIdStr);
    
    const updatedFavoriteIds = isFavorite
      ? favoriteIds.filter((id) => id !== listingIdStr)
      : [...favoriteIds, listingIdStr];
    
    await ctx.db.patch(args.userId, {
      favoriteIds: updatedFavoriteIds,
      updatedAt: Date.now(),
    });
    
    return !isFavorite;
  },
});

// Get favorite listings for a user
export const getFavoriteListings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user || !user.favoriteIds || user.favoriteIds.length === 0) {
      return [];
    }
    
    const listings = await Promise.all(
      user.favoriteIds.map((listingIdStr) => ctx.db.get(listingIdStr as any))
    );
    
    return listings
      .filter((listing) => listing !== null)
      .map((list) => ({
        ...list!,
        id: list!._id,
        createdAt: new Date(list!.createdAt).toISOString(),
      }));
  },
});

