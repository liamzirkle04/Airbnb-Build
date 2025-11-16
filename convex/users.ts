import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) return null;
    
    return {
      ...user,
      _id: user._id,
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
    };
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) return null;
    
    return {
      ...user,
      _id: user._id,
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
    };
  },
});

// Create user
export const createUser = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      hashedPassword: args.hashedPassword,
      image: args.image,
      favoriteIds: [],
      createdAt: now,
      updatedAt: now,
    });
    
    return userId;
  },
});

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    hashedPassword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

