import { Polar } from "@convex-dev/polar";
import { customersGetState } from "@polar-sh/sdk/funcs/customersGetState";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList";
import { customersList } from "@polar-sh/sdk/funcs/customersList";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate";
import { subscriptionsList } from "@polar-sh/sdk/funcs/subscriptionsList";
import { subscriptionsRevoke } from "@polar-sh/sdk/funcs/subscriptionsRevoke";
import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate";
import { api, components } from "./_generated/api";
import { action, internalAction, query } from "./_generated/server";
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

const backfillExistingCustomer = async (
  ctx: any,
  userId: Id<"users">,
  email: string | undefined | null
) => {
  // If the component already has this user->customer mapping, nothing to do.
  const existingLink = await ctx.runQuery(
    components.polar.lib.getCustomerByUserId,
    { userId: userId.toString() }
  );
  if (existingLink) {
    return existingLink.id;
  }

  // Some users may already exist in Polar (e.g. created in dashboard or another app)
  // which causes "email already exists" when we try to create them. Look them up by
  // email and persist the mapping so checkout session creation can proceed.
  if (!email) {
    return null;
  }

  try {
    const lookup = await customersList(polar.polar, { email, limit: 1 });
    if (lookup.ok) {
      const match = lookup.value.result.items[0];
      if (match) {
        await ctx.runMutation(components.polar.lib.upsertCustomer, {
          id: match.id,
          userId: userId.toString(),
          metadata: match.metadata ?? {},
        });
        return match.id;
      }
    } else {
      console.error("Failed to look up existing Polar customer", lookup.error);
    }
  } catch (error) {
    console.error("Error during Polar customer lookup", error);
  }

  return null;
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
  // Generates a customer portal URL for the current user.
  generateCustomerPortalUrl,

  // Changes the current subscription to the given product ID.
  changeCurrentSubscription,

  // Cancels the current subscription.
  cancelCurrentSubscription,
} = polar.api();

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

    let customer = await polar.getCustomerByUserId(ctx, userId.toString());

    // If the user bought via a standalone checkout link, backfill the mapping by email.
    if (!customer) {
      const backfilledId = await backfillExistingCustomer(ctx, userId, user.email);
      if (backfilledId) {
        customer = {
          id: backfilledId,
          userId: userId.toString(),
          metadata: {},
        };
      }
    }

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
      hasSubscription: normalizedHasSubscription,
    };
  },
});

// Create a Polar checkout session using the Checkout API
export const createCheckoutSession = action({
  args: {
    productId: v.string(),
    successUrl: v.optional(v.string()),
  },
  handler: async (ctx, { productId, successUrl }): Promise<{ url: string } | { error: string }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { error: "User not authenticated" };
    }

    const user = await ctx.runQuery(api.users.getUserById, { userId });
    if (!user) {
      return { error: "User not found" };
    }

    // Backfill customer if they already exist in Polar by email
    await backfillExistingCustomer(ctx, userId, user.email);

    try {
      const result = await checkoutsCreate(polar.polar, {
        products: [productId],
        customerEmail: user.email ?? undefined,
        customerName: user.name ?? undefined,
        successUrl: successUrl ?? `${process.env.SITE_URL ?? "http://localhost:5173"}/pricing?checkout_id={CHECKOUT_ID}`,
      });

      if (!result.ok) {
        console.error("Failed to create checkout session:", result.error);
        return { error: "Failed to create checkout session" };
      }

      return { url: result.value.url };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return { error: "Failed to create checkout session" };
    }
  },
});

// Cancel ALL active subscriptions for a customer (used when lifetime is purchased)
export const cancelAllSubscriptionsForCustomer = internalAction({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, { customerId }): Promise<{ cancelled: number; errors: string[] }> => {
    const cancelled: string[] = [];
    const errors: string[] = [];

    try {
      // Get all subscriptions for this customer
      const [subsIterator] = await subscriptionsList(polar.polar, {
        customerId: customerId,
        active: true,
        limit: 100,
      }).$inspect();

      for await (const page of subsIterator) {
        if (!page.ok) {
          console.error("Error fetching subscriptions page:", page.error);
          errors.push(`Failed to fetch subscriptions: ${page.error}`);
          continue;
        }

        for (const subscription of page.value.result.items) {
          // Only cancel recurring subscriptions that are not already cancelled
          if (
            subscription.status === "active" &&
            subscription.recurringInterval !== null // This means it's a recurring subscription
          ) {
            try {
              const revokeResult = await subscriptionsRevoke(polar.polar, {
                id: subscription.id,
              });

              if (revokeResult.ok) {
                console.log(`Successfully cancelled subscription ${subscription.id}`);
                cancelled.push(subscription.id);
              } else {
                console.error(`Failed to cancel subscription ${subscription.id}:`, revokeResult.error);
                errors.push(`Failed to cancel ${subscription.id}: ${revokeResult.error}`);
              }
            } catch (revokeError) {
              console.error(`Error revoking subscription ${subscription.id}:`, revokeError);
              errors.push(`Error revoking ${subscription.id}: ${revokeError}`);
            }
          }
        }
      }

      console.log(`Cancelled ${cancelled.length} subscriptions for customer ${customerId}`);
      return { cancelled: cancelled.length, errors };
    } catch (error) {
      console.error("Error cancelling subscriptions for customer:", error);
      errors.push(`Error: ${error}`);
      return { cancelled: 0, errors };
    }
  },
});
