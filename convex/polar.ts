import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { QueryCtx, mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

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
  // Don't configure products by key, rely on sync instead
});

export const {
  // Lists all non-archived products
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

// Create a wrapper query that logs the results of listAllProducts
export const listAllProductsWithLogging = query({
  args: {},
  handler: async (ctx) => {
    console.log("Calling listAllProducts...");
    // Use the polar instance to call listProducts directly
    const products = await polar.listProducts(ctx);
    console.log("listAllProducts result:", products);
    return products;
  },
});

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
    
    // Since we're not using product keys, determine subscription type based on product properties
    const product = subscription?.product;
    const isPremium = product?.isRecurring === true;
    const isLifetime = product?.isRecurring === false;
    
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

// Action to sync products from Polar API to Convex database
export const syncProductsAction = action({
  args: {},
  handler: async (ctx) => {
    await polar.syncProducts(ctx);
  },
});
