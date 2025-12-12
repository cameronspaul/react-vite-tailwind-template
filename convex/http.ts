import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { polar } from "./polar";
import { auth } from "./auth";
import { internal } from "./_generated/api";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

const http = httpRouter();

auth.addHttpRoutes(http);

/**
 * Custom webhook handler for order events (one-time/lifetime purchases)
 * The Polar component only handles subscription.* events, so we need this
 * for order.paid events which occur with one-time purchases.
 * 
 * IMPORTANT: You must configure a separate webhook in the Polar dashboard
 * pointing to: https://your-convex-url.convex.site/polar/orders
 * with the "order.paid" event selected.
 */
http.route({
  path: "/polar/orders",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("POLAR_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await request.text();

    // Convert Headers to plain object for webhook validation
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let event;
    try {
      event = validateEvent(body, headers, webhookSecret);
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        console.error("Webhook verification failed:", error.message);
        return new Response("Invalid webhook signature", { status: 403 });
      }
      throw error;
    }

    console.log("Received Polar order webhook:", event.type);

    // Handle order.paid event for one-time purchases
    if (event.type === "order.paid") {
      const order = event.data;
      const customer = order.customer;
      const product = order.product;

      // Only send email for one-time (non-recurring) products
      if (product && product.isRecurring === false) {
        const email = customer?.email;
        const name = customer?.name || customer?.email?.split("@")[0];

        if (email) {
          console.log("One-time purchase detected, sending premium welcome email to:", email);
          await ctx.runMutation(internal.emails.schedulePremiumWelcomeEmail, {
            email,
            name,
            productName: product.name || "Premium",
            isLifetime: true,
          });
        } else {
          console.warn("No email found for customer in order.paid event");
        }
      }
    }

    return new Response("OK", { status: 200 });
  }),
});

polar.registerRoutes(http, {
  // Optional custom path, default is "/polar/events"
  path: "/polar/events",

  // Callback for when a NEW subscription is created (recurring subscriptions)
  onSubscriptionCreated: async (ctx, event) => {
    console.log("New subscription created!", event);

    const subscription = event.data;
    const customer = subscription.customer;
    const product = subscription.product;

    // Extract customer details
    const email = customer?.email;
    const name = customer?.name || customer?.email?.split("@")[0];

    if (email) {
      // Schedule the premium welcome email to be sent via mutation
      await ctx.runMutation(internal.emails.schedulePremiumWelcomeEmail, {
        email,
        name,
        productName: product?.name || "Premium",
        isLifetime: product?.isRecurring === false,
      });
    } else {
      console.warn("No email found for customer, skipping welcome email");
    }
  },

  // Callback for when a subscription is updated (canceled, renewed, etc.)
  onSubscriptionUpdated: async (ctx, event) => {
    console.log("Subscription updated", event);

    const subscription = event.data;

    // Handle cancellation
    if (subscription.customerCancellationReason) {
      console.log(
        "Customer cancellation reason:",
        subscription.customerCancellationReason
      );
      console.log(
        "Customer cancellation comment:",
        subscription.customerCancellationComment
      );

      // Schedule a cancellation confirmation email via mutation
      const email = subscription.customer?.email;
      if (email) {
        await ctx.runMutation(internal.emails.scheduleCancellationEmail, {
          email,
        });
      }
    }
  },

  // Other available callbacks (not implemented yet)
  onProductCreated: undefined,
  onProductUpdated: undefined,
});

export default http;
