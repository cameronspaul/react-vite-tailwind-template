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

    const subscription = await polar.getCurrentSubscription(ctx, {
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

    const hasActiveEntitlement =
      hasSubscription || hasBenefitGrant || hasPaidOneTimeOrder;
    const hasLifetime =
      subscription?.product?.isRecurring === false ||
      (!hasSubscription && hasBenefitGrant) ||
      hasPaidOneTimeOrder;

    return {
      ...user,
      subscription,
      isPremium: hasActiveEntitlement,
      isLifetime: hasLifetime,
    };
  },
});
