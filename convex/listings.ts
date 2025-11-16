import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all listings with optional filters
export const getListings = query({
  args: {
    userId: v.optional(v.id("users")),
    category: v.optional(v.string()),
    roomCount: v.optional(v.number()),
    guestCount: v.optional(v.number()),
    bathroomCount: v.optional(v.number()),
    locationValue: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let listings = await ctx.db.query("listings").collect();
    
    // Filter by userId
    if (args.userId) {
      listings = listings.filter((l) => l.userId === args.userId);
    }
    
    // Filter by category
    if (args.category) {
      listings = listings.filter((l) => l.category === args.category);
    }
    
    // Filter by roomCount
    if (args.roomCount) {
      listings = listings.filter((l) => l.roomCount >= args.roomCount!);
    }
    
    // Filter by guestCount
    if (args.guestCount) {
      listings = listings.filter((l) => l.guestCount >= args.guestCount!);
    }
    
    // Filter by bathroomCount
    if (args.bathroomCount) {
      listings = listings.filter((l) => l.bathroomCount >= args.bathroomCount!);
    }
    
    // Filter by locationValue
    if (args.locationValue) {
      listings = listings.filter((l) => l.locationValue === args.locationValue);
    }
    
    // Filter by date availability (exclude listings with conflicting reservations)
    if (args.startDate && args.endDate) {
      const reservations = await ctx.db
        .query("reservations")
        .collect();
      
      const conflictingReservationIds = new Set(
        reservations
          .filter((r) => {
            return (
              (r.startDate <= args.startDate! && r.endDate >= args.startDate!) ||
              (r.startDate <= args.endDate! && r.endDate >= args.endDate!)
            );
          })
          .map((r) => r.listingId)
      );
      
      listings = listings.filter((l) => !conflictingReservationIds.has(l._id));
    }
    
    // Sort by createdAt descending
    listings.sort((a, b) => b.createdAt - a.createdAt);
    
    return listings.map((list) => ({
      ...list,
      id: list._id,
      createdAt: new Date(list.createdAt).toISOString(),
    }));
  },
});

// Get listing by ID
export const getListingById = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    
    if (!listing) return null;
    
    const user = await ctx.db.get(listing.userId);
    
    return {
      ...listing,
      id: listing._id,
      createdAt: new Date(listing.createdAt).toISOString(),
      user: user ? {
        ...user,
        id: user._id,
        createdAt: new Date(user.createdAt).toISOString(),
        updatedAt: new Date(user.updatedAt).toISOString(),
        emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
      } : null,
    };
  },
});

// Create listing
export const createListing = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageSrc: v.string(),
    category: v.string(),
    roomCount: v.number(),
    bathroomCount: v.number(),
    guestCount: v.number(),
    locationValue: v.string(),
    price: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const listingId = await ctx.db.insert("listings", {
      title: args.title,
      description: args.description,
      imageSrc: args.imageSrc,
      category: args.category,
      roomCount: args.roomCount,
      bathroomCount: args.bathroomCount,
      guestCount: args.guestCount,
      locationValue: args.locationValue,
      price: args.price,
      userId: args.userId,
      createdAt: Date.now(),
    });
    
    return listingId;
  },
});

// Delete listing
export const deleteListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.listingId);
  },
});

