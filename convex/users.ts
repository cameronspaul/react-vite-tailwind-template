import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current authenticated user's profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Get a user by their ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Update the current user's profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated");
    }
    
    // Filter out undefined values to only update provided fields
    const updateData: any = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.image !== undefined) updateData.image = args.image;
    if (args.email !== undefined) updateData.email = args.email;
    
    await ctx.db.patch(userId, updateData);
    return await ctx.db.get(userId);
  },
});

// Get all users (for admin purposes)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated");
    }
    
    // In a real app, you might want to check if the user is an admin
    // For now, we'll just return all users
    return await ctx.db.query("users").collect();
  },
});