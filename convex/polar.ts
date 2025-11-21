import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { action, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

const fetchAuthenticatedUser = async (
  ctx: any
): Promise<{ userId: Id<"users">; user: any }> => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("User not authenticated");
  }

  const user =
    "db" in ctx && ctx.db
      ? await ctx.db.get(userId)
      : await ctx.runQuery(api.users.getUserById, { userId });

  if (!user) {
    throw new Error("User not found");
  }

  return { userId, user };
};

export const getUserInfo = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await fetchAuthenticatedUser(ctx);
    return user;
  },
});

export const polar = new Polar(components.polar, {
  // Use the authenticated Convex user for all Polar calls
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const { userId, user } = await fetchAuthenticatedUser(ctx);
    return {
      userId: userId.toString(),
      email: user.email ?? "",
    };
  },
});

export const {
  // Lists all non-archived products via Polar's synced catalog
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

export const syncProducts = action({
  args: {},
  handler: async (ctx) => {
    await polar.syncProducts(ctx);
  },
});

export const getBillingStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    const subscription = await polar.getCurrentSubscription(ctx, {
      userId: userId.toString(),
    });

    const hasActiveEntitlement = Boolean(subscription);
    const hasLifetime =
      subscription?.product?.isRecurring === false;

    return {
      ...user,
      subscription,
      isPremium: hasActiveEntitlement,
      isLifetime: hasLifetime,
    };
  },
});
