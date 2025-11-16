import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
    favoriteIds: v.array(v.string()), // Store as strings, convert to Id when needed
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]),

  accounts: defineTable({
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refresh_token: v.optional(v.string()),
    access_token: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string()),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["provider", "providerAccountId"]),

  listings: defineTable({
    title: v.string(),
    description: v.string(),
    imageSrc: v.string(),
    category: v.string(),
    roomCount: v.number(),
    bathroomCount: v.number(),
    guestCount: v.number(),
    locationValue: v.string(),
    userId: v.id("users"),
    price: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["category"]),

  reservations: defineTable({
    userId: v.id("users"),
    listingId: v.id("listings"),
    startDate: v.number(),
    endDate: v.number(),
    totalPrice: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_listing", ["listingId"]),
});

