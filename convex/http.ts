import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Verify Polar webhook signature (Standard Webhooks / Svix format)
async function verify(body: string, req: Request, secret: string): Promise<boolean> {
  const id = req.headers.get("webhook-id") || req.headers.get("svix-id");
  const ts = req.headers.get("webhook-timestamp") || req.headers.get("svix-timestamp");
  const sigs = req.headers.get("webhook-signature") || req.headers.get("svix-signature");
  if (!id || !ts || !sigs) return false;

  const sec = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  let b64 = sec.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  let keyBytes: Uint8Array;
  try { const bin = atob(b64); keyBytes = new Uint8Array([...bin].map(c => c.charCodeAt(0))); }
  catch { keyBytes = new TextEncoder().encode(sec); }

  const key = await crypto.subtle.importKey("raw", keyBytes.buffer as ArrayBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${ts}.${body}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(signed)));
  return sigs.split(" ").map(s => s.split(",")[1]).filter(Boolean).includes(expected);
}

// Polar webhook handler
http.route({
  path: "/polar/events",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      if (!await verify(body, request, process.env.POLAR_WEBHOOK_SECRET ?? "")) {
        console.error("Webhook verification failed");
        return new Response("", { status: 403 });
      }

      // Parse the event
      const event = JSON.parse(body);

      // Handle all event types
      switch (event.type) {
        // Order events
        case "order.paid":
          console.log("Order paid:", event.data);
          const productId = event.data.product_id;
          switch (productId) {
            // Premium products
            case process.env.VITE_POLAR_PRODUCT_ID_MONTHLY:
              console.log("User bought Premium 1 Month");
              break;
            case process.env.VITE_POLAR_PRODUCT_ID_QUARTERLY:
              console.log("User bought Premium Quarterly");
              break;
            case process.env.VITE_POLAR_PRODUCT_ID_SEMIANNUAL:
              console.log("User bought Premium Semiannual");
              break;

            // Lifetime products
            case process.env.VITE_POLAR_PRODUCT_ID_LIFETIME:
              console.log("User bought Premium Lifetime");
              break;

            // Credit/Boost products
            case process.env.VITE_POLAR_PRODUCT_ID_BOOST:
              console.log("User bought Boost");
              break;
            case process.env.VITE_POLAR_PRODUCT_ID_SUPER_BOOST:
              console.log("User bought Super Boost");
              break;
            case process.env.VITE_POLAR_PRODUCT_ID_SUPER_CONNECT:
              console.log("User bought Super Connect");
              break;
            default:
              console.log("User bought unknown product");
          }
          // e.g., Grant access, send confirmation email
          break;

        // Subscription events
        case "subscription.created":
          console.log("Subscription created:", event.data);
          break;
        case "subscription.updated":
          console.log("Subscription updated:", event.data);
          if (event.data.customerCancellationReason) {
            console.log("Cancellation reason:", event.data.customerCancellationReason);
            console.log("Cancellation comment:", event.data.customerCancellationComment);
          }
          break;
        case "subscription.active":
          console.log("Subscription active:", event.data);
          break;
        case "subscription.canceled":
          console.log("Subscription canceled:", event.data);
          break;
        case "subscription.revoked":
          console.log("Subscription revoked:", event.data);
          break;


        default:
      }

      return new Response("", { status: 202 });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response("", { status: 500 });
    }
  }),
});

export default http;
