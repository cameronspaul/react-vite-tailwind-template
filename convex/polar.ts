import { Polar } from "@convex-dev/polar";
import { customersGetState } from "@polar-sh/sdk/funcs/customersGetState";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList";
import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate";
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

  // Generates a customer portal URL for the current user.
  generateCustomerPortalUrl,

  // Changes the current subscription to the given product ID.
  changeCurrentSubscription,

  // Cancels the current subscription.
  cancelCurrentSubscription,
} = polar.api();

// Generates a checkout link for the given product IDs with lifetime enforcement.
export const generateCheckoutLink = action({
  args: {
    productIds: v.array(v.string()),
    origin: v.string(),
    successUrl: v.string(),
    subscriptionId: v.optional(v.string()),
  },
  returns: v.object({ url: v.string() }),
  handler: async (ctx, args): Promise<{ url: string }> => {
    const { userId, user } = await fetchAuthenticatedUser(ctx);

    // Reuse the billing status logic to prevent duplicate purchases.
    const billing = await ctx.runAction(api.polar.getBillingStatus);
    const hasSubscription = Boolean(billing?.subscription);
    const hasLifetime = Boolean(billing?.isLifetime);

    // Load products to understand whether the request is for recurring vs lifetime.
    const products = await ctx.runQuery(api.polar.listAllProducts);
    const productMap = new Map((products ?? []).map((p) => [p.id, p]));
    const selected = args.productIds.map((id) => {
      const product = productMap.get(id);
      if (!product) {
        throw new Error("Invalid product selection.");
      }
      return product;
    });

    const containsRecurring = selected.some((p) => p.isRecurring);
    const isLifetimeOnly = selected.every((p) => p.isRecurring === false);

    // Lifetime owners should not initiate any checkout.
    if (hasLifetime) {
      throw new Error("Lifetime access already active - no checkout needed.");
    }

    // Subscribers cannot start another subscription, but they may purchase lifetime.
    if (hasSubscription && containsRecurring) {
      throw new Error(
        "A subscription is already active - manage changes from the customer portal."
      );
    }

    // Mixed carts (recurring + lifetime) are not allowed when a subscription exists.
    if (hasSubscription && !isLifetimeOnly) {
      throw new Error("Invalid checkout selection for your current subscription.");
    }

    // Otherwise create checkout via Polar helper (does customer creation, etc).
    const checkout = await polar.createCheckoutSession(ctx, {
      productIds: args.productIds,
      userId: userId.toString(),
      email: user.email ?? "",
      origin: args.origin,
      successUrl: args.successUrl,
      subscriptionId: args.subscriptionId,
    });

    return { url: checkout.url };
  },
});

export const syncProducts = action({
  args: {},
  handler: async (ctx) => {
    await polar.syncProducts(ctx);
  },
});

export const getBillingStatus = action({
  args: {},
  handler: async (ctx): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.runQuery(api.users.getUserById, { userId });
    if (!user) {
      return null;
    }

    let subscription = await polar.getCurrentSubscription(ctx, {
      userId: userId.toString(),
    });

    const customer = await polar.getCustomerByUserId(ctx, userId.toString());

    // Fetch the authoritative customer state from Polar so we catch
    // one-time (lifetime) purchases that don't create subscriptions.
    let customerState: CustomerState | null = null;
    if (customer) {
      try {
        const stateResult = await customersGetState(polar.polar, {
          id: customer.id,
        });
        if (stateResult.ok) {
          customerState = stateResult.value;
        } else {
          console.error("Polar customer state error", stateResult.error);
        }
      } catch (error) {
        console.error("Failed to fetch Polar customer state", error);
      }
    }

    const hasBenefitGrant =
      (customerState?.grantedBenefits?.length ?? 0) > 0;
    const hasSubscription =
      Boolean(subscription) ||
      (customerState?.activeSubscriptions?.length ?? 0) > 0;

    let hasPaidOneTimeOrder = false;
    if (customer) {
      try {
        const [ordersIterator] = await ordersList(polar.polar, {
          customerId: customer.id,
          productBillingType: "one_time",
          limit: 25,
        }).$inspect();

        for await (const page of ordersIterator) {
          if (!page.ok) {
            console.error("Polar orders page error", page.error);
            continue;
          }
          const foundPaidLifetime = page.value.result.items.some(
            (order) =>
              order.paid &&
              order.status !== "pending" &&
              order.product?.isRecurring === false
          );
          if (foundPaidLifetime) {
            hasPaidOneTimeOrder = true;
            break;
          }
        }
      } catch (error) {
        console.error("Failed to fetch Polar orders", error);
      }
    }

    let hasActiveEntitlement =
      hasSubscription || hasBenefitGrant || hasPaidOneTimeOrder;
    let hasLifetime =
      subscription?.product?.isRecurring === false ||
      (!hasSubscription && hasBenefitGrant) ||
      hasPaidOneTimeOrder;

    // If a user owns lifetime access but still has an active recurring subscription,
    // automatically cancel the subscription to avoid double billing.
    if (
      hasLifetime &&
      subscription &&
      subscription.product?.isRecurring !== false &&
      subscription.status === "active"
    ) {
      try {
        await polar.cancelSubscription(ctx, { revokeImmediately: true });
        subscription = await polar.getCurrentSubscription(ctx, {
          userId: userId.toString(),
        });
      } catch (error) {
        console.error(
          "Failed to auto-cancel subscription after lifetime purchase",
          error
        );
      }
    }

    const normalizedHasSubscription =
      Boolean(subscription) ||
      (customerState?.activeSubscriptions?.length ?? 0) > 0;
    hasActiveEntitlement =
      normalizedHasSubscription || hasBenefitGrant || hasPaidOneTimeOrder;
    hasLifetime =
      subscription?.product?.isRecurring === false ||
      (!normalizedHasSubscription && hasBenefitGrant) ||
      hasPaidOneTimeOrder;

    return {
      ...user,
      subscription,
      isPremium: hasActiveEntitlement,
      isLifetime: hasLifetime,
    };
  },
});
