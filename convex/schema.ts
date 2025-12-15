import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Additional fields for comprehensive profile
    creationDate: v.number(), // Store creation timestamp
    provider: v.optional(v.string()), // Track which OAuth provider was used
    providerId: v.optional(v.string()), // Unique ID from the provider
  })
    .index("email", ["email"])
    .index("by_provider", ["provider"]),

  // Credits table - stores user credit balances
  credits: defineTable({
    userId: v.id("users"),
    balance: v.number(), // Current credit balance
    lastUpdated: v.number(), // Timestamp of last update
  })
    .index("by_userId", ["userId"]),

  // Feedback table - stores user feedback submissions
  feedback: defineTable({
    userId: v.id("users"),
    userEmail: v.union(v.string(), v.null()),
    userName: v.union(v.string(), v.null()),
    type: v.union(
      v.literal("bug"),
      v.literal("feature"),
      v.literal("improvement"),
      v.literal("other")
    ),
    message: v.string(),
    page: v.union(v.string(), v.null()),
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),
});

export default schema;