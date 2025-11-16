import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get reservations by user
export const getReservationsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reservations = await ctx.db
      .query("reservations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    const reservationsWithListing = await Promise.all(
      reservations.map(async (reservation) => {
        const listing = await ctx.db.get(reservation.listingId);
        return {
          ...reservation,
          id: reservation._id,
          createdAt: new Date(reservation.createdAt).toISOString(),
          startDate: new Date(reservation.startDate).toISOString(),
          endDate: new Date(reservation.endDate).toISOString(),
          listing,
        };
      })
    );
    
    return reservationsWithListing;
  },
});

// Get reservations by listing
export const getReservationsByListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const reservations = await ctx.db
      .query("reservations")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();
    
    return reservations.map((reservation) => ({
      ...reservation,
      id: reservation._id,
      createdAt: new Date(reservation.createdAt).toISOString(),
      startDate: new Date(reservation.startDate).toISOString(),
      endDate: new Date(reservation.endDate).toISOString(),
    }));
  },
});

// Create reservation
export const createReservation = mutation({
  args: {
    userId: v.id("users"),
    listingId: v.id("listings"),
    startDate: v.number(),
    endDate: v.number(),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const reservationId = await ctx.db.insert("reservations", {
      userId: args.userId,
      listingId: args.listingId,
      startDate: args.startDate,
      endDate: args.endDate,
      totalPrice: args.totalPrice,
      createdAt: Date.now(),
    });
    
    return reservationId;
  },
});

// Delete reservation
export const deleteReservation = mutation({
  args: { reservationId: v.id("reservations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reservationId);
  },
});

