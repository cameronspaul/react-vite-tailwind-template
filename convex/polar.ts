import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { QueryCtx, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// Import Polar product IDs from environment variables
// In Convex, environment variables are accessed through the process object
const POLAR_PREMIUM_WEEKLY_PRODUCT_ID = process.env.POLAR_PREMIUM_WEEKLY_PRODUCT_ID!;
const POLAR_PREMIUM_MONTHLY_PRODUCT_ID = process.env.POLAR_PREMIUM_MONTHLY_PRODUCT_ID!;
const POLAR_PREMIUM_QUARTERLY_PRODUCT_ID = process.env.POLAR_PREMIUM_QUARTERLY_PRODUCT_ID!;
const POLAR_PREMIUM_SEMIANNUAL_PRODUCT_ID = process.env.POLAR_PREMIUM_SEMIANNUAL_PRODUCT_ID!;
const POLAR_LIFETIME_PRODUCT_ID = process.env.POLAR_LIFETIME_PRODUCT_ID!;

// User query to use in the Polar component
export const getUserInfo = query({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) {
        throw new Error("User not authenticated");
      }
      
      const user = await ctx.db.get(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error in getUserInfo:", error);
      throw error;
    }
  },
});

// Helper function for Polar that returns the expected format
const polarGetUserInfo = async (ctx: any) => {
  try {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Return the format expected by Polar
    return {
      userId: userId.toString(),
      email: user.email || "",
    };
  } catch (error) {
    console.error("Error in polarGetUserInfo:", error);
    throw error;
  }
};

export const polar = new Polar(components.polar, {
  getUserInfo: polarGetUserInfo,
  products: {
    premiumWeekly: POLAR_PREMIUM_WEEKLY_PRODUCT_ID,
    premiumMonthly: POLAR_PREMIUM_MONTHLY_PRODUCT_ID,
    premiumQuarterly: POLAR_PREMIUM_QUARTERLY_PRODUCT_ID,
    premiumSemiannual: POLAR_PREMIUM_SEMIANNUAL_PRODUCT_ID,
    lifetime: POLAR_LIFETIME_PRODUCT_ID,
  }
});

export const {
  // If you configure your products by key in the Polar constructor,
  // this query provides a keyed object of the products.
  getConfiguredProducts,

  // Lists all non-archived products, useful if you don't configure products by key.
  listAllProducts,

  // Generates a checkout link for the given product IDs.
  generateCheckoutLink,

  // Generates a customer portal URL for the current user.
  generateCustomerPortalUrl,

  // Changes the current subscription to the given product ID.
  changeCurrentSubscription,

  // Cancels the current subscription.
  cancelCurrentSubscription,
} = polar.api();

// Get the current authenticated user with subscription information
const getCurrentUserWithSubscription = async (ctx: QueryCtx) => {
  try {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Convert user._id to string for the Polar API
    const userIdString = userId.toString();
    
    // Get subscription information with proper error handling
    let subscription = null;
    try {
      subscription = await polar.getCurrentSubscription(ctx, {
        userId: userIdString,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Continue without subscription info if there's an error
    }
    
    const productKey = subscription?.productKey;
    const isPremium =
      productKey === "premiumWeekly" ||
      productKey === "premiumMonthly" ||
      productKey === "premiumQuarterly" ||
      productKey === "premiumSemiannual";
    const isLifetime = productKey === "lifetime";
    
    return {
      ...user,
      isFree: !isPremium && !isLifetime,
      isPremium,
      isLifetime,
      subscription,
    };
  } catch (error) {
    console.error("Error in getCurrentUserWithSubscription:", error);
    throw error;
  }
};

// Query that returns the current user with subscription information
export const getCurrentUserWithSubscriptionQuery = query({
  handler: async (ctx) => {
    return getCurrentUserWithSubscription(ctx);
  },
});
