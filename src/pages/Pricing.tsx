import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { CustomerPortalLink } from "@convex-dev/polar/react";
import { api } from "../../convex/_generated/api";
import { PriceCard } from "../components/PriceCard";
import { staticProducts, type ProductWithCheckout } from "../staticProducts";
import { useBillingStatus } from "../hooks/useBillingStatus";

export const ProductList = () => {
  const location = useLocation();
  const { signIn } = useAuthActions();
  const billing = useBillingStatus();

  const billingReady = billing.status === "ready";
  const hasLifetime = billingReady && billing.isLifetime;
  const hasSubscription = billingReady && Boolean(billing.data?.subscription);
  const canSubscribe = billingReady && !hasLifetime && !hasSubscription;

  const { recurringProducts, lifetimeProducts } = useMemo(() => {
    const active = staticProducts.filter((product) => !product.isArchived);
    return {
      recurringProducts: active.filter((product) => product.isRecurring),
      lifetimeProducts: active.filter((product) => !product.isRecurring),
    };
  }, []);

  const statusLabel =
    billing.status === "loading"
      ? "Checking status..."
      : billing.data === null
        ? "Not signed in"
        : billing.data?.isLifetime
          ? "Lifetime premium"
        : billing.data?.isPremium
          ? "Recurring subscription"
          : "Free plan";

  const searchParams = new URLSearchParams(location.search);
  const checkoutId = searchParams.get("checkout_id");
  const showSuccess =
    location.pathname.startsWith("/payment/success") || Boolean(checkoutId);

  const renderCheckoutCta = (
    product: ProductWithCheckout,
    label: string,
    variant: "primary" | "ghost" = "primary"
  ) => {
    if (!product.checkoutUrl) {
      return (
        <div className="text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded-md px-3 py-2 inline-block">
          Checkout link missing. Set the matching VITE_CHECKOUT_LINK_* env var.
        </div>
      );
    }

    const baseClasses =
      "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold";
    const styles =
      variant === "primary"
        ? "bg-primary text-primary-foreground hover:opacity-90"
        : "border border-border hover:bg-muted";

    return (
      <a
        href={product.checkoutUrl}
        target="_blank"
        rel="noreferrer"
        className={`${baseClasses} ${styles}`}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="space-y-8 text-foreground">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Premium access</h2>
          <p className="text-muted-foreground">
            Plans are defined locally; checkout links are provided via env vars.
          </p>
        </div>
        {billing.data?.subscription && (
          <CustomerPortalLink
            polarApi={{ generateCustomerPortalUrl: api.polar.generateCustomerPortalUrl }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
          >
            Polar customer portal
          </CustomerPortalLink>
        )}
      </div>

      {showSuccess && (
        <div className="border border-green-200 bg-green-50 text-green-800 rounded-md p-4">
          <p className="font-semibold">Congratulations—you are now premium!</p>
          {checkoutId && (
            <p className="text-sm">Checkout ID: {checkoutId}</p>
          )}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Current status</p>
        <p className="text-xl font-semibold leading-tight">{statusLabel}</p>
        {billing.data?.subscription?.product?.name && (
          <p className="text-sm text-muted-foreground">
            {billing.data.subscription.product.name}
          </p>
        )}
      </div>

      {staticProducts.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          No products configured. Add plans in <code>src/staticProducts.ts</code>.
        </div>
      )}

      <Authenticated>
        <div className="space-y-10">
          <section className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">Recurring subscription</h3>
              <p className="text-muted-foreground">
                Pick a recurring plan (weekly/monthly/quarterly/semiannual). Checkout links come from env.
              </p>
              {!billingReady && (
                <p className="text-sm text-muted-foreground bg-muted border border-border rounded-md px-3 py-2 inline-block mt-2">
                  Checking your billing status...
                </p>
              )}
              {billingReady && hasLifetime && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 inline-block mt-2">
                  Lifetime access is active. Subscriptions are disabled.
                </p>
              )}
            </div>
            {recurringProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recurringProducts.map((product) => (
                  <PriceCard
                    key={product.id}
                    product={product}
                    action={
                      !billingReady ? (
                        <div className="text-sm text-muted-foreground bg-muted border border-border rounded-md px-3 py-2 inline-block">
                          Checking your billing status...
                        </div>
                      ) : hasLifetime ? (
                        <div className="text-sm text-muted-foreground bg-muted border border-border rounded-md px-3 py-2 inline-block">
                          Lifetime is active; no subscription needed.
                        </div>
                      ) : billing.data?.isPremium && billing.data?.subscription ? (
                        <CustomerPortalLink
                          polarApi={{ generateCustomerPortalUrl: api.polar.generateCustomerPortalUrl }}
                          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                          Update subscription
                        </CustomerPortalLink>
                      ) : canSubscribe ? (
                        renderCheckoutCta(product, "Start subscription")
                      ) : (
                        <div className="text-sm text-muted-foreground bg-muted border border-border rounded-md px-3 py-2 inline-block">
                          Subscriptions unavailable while lifetime is active.
                        </div>
                      )
                    }
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">Lifetime premium</h3>
              <p className="text-muted-foreground">
                One-time purchase for lifetime access; entitlements still validated via Polar.
              </p>
            </div>
            {lifetimeProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lifetimeProducts.map((product) => (
                  <PriceCard
                    key={product.id}
                    product={product}
                    action={
                      !billingReady ? (
                        <div className="text-sm text-muted-foreground bg-muted border border-border rounded-md px-3 py-2 inline-block">
                          Checking your billing status...
                        </div>
                      ) : billing.data?.isLifetime ? (
                        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 inline-block">
                          Lifetime premium is active for your account.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {hasSubscription && (
                            <p className="text-sm text-muted-foreground">
                              You already have a subscription; you can still purchase lifetime access.
                            </p>
                          )}
                          {renderCheckoutCta(
                            product,
                            hasSubscription ? "Upgrade to lifetime" : "Buy lifetime access",
                            "ghost"
                          )}
                        </div>
                      )
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="rounded-lg border border-border bg-card p-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Sign in to buy or manage premium access.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void signIn("github")}
              className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Sign in with GitHub
            </button>
            <button
              onClick={() => void signIn("google")}
              className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
};
