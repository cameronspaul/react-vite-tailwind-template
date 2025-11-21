import { useEffect, useState } from "react";
import { Authenticated, Unauthenticated, useAction, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { CheckoutLink, CustomerPortalLink } from "@convex-dev/polar/react";
import { api } from "../../convex/_generated/api";
import { PriceCard, type Product } from "../components/PriceCard";
import { useBillingStatus } from "../hooks/useBillingStatus";

export const ProductList = () => {
  const products = useQuery(api.polar.listAllProducts);
  const syncProducts = useAction(api.polar.syncProducts);
  const { signIn } = useAuthActions();
  const billing = useBillingStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const hasLifetime = billing.isLifetime;
  const canSubscribe = !hasLifetime;
  
  useEffect(() => {
    if (hasSynced || isSyncing) return;
    setHasSynced(true);
    setIsSyncing(true);
    syncProducts()
      .catch((error) => {
        console.error("Error syncing products:", error);
      })
      .finally(() => setIsSyncing(false));
  }, [hasSynced, isSyncing, syncProducts]);
  
  if (products === undefined) {
    return <div className="text-foreground">Loading products...</div>;
  }

  const activeProducts: Product[] = products ?? [];
  const recurringProducts = activeProducts.filter((product) => product.isRecurring);
  const lifetimeProducts = activeProducts.filter((product) => !product.isRecurring);

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
  
  return (
    <div className="space-y-8 text-foreground">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Premium access</h2>
          <p className="text-muted-foreground">
            Products are synced from Polar—no hard-coded IDs.
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

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Current status</p>
        <p className="text-xl font-semibold leading-tight">{statusLabel}</p>
        {billing.data?.subscription?.product?.name && (
          <p className="text-sm text-muted-foreground">
            {billing.data.subscription.product.name}
          </p>
        )}
      </div>

      {isSyncing && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
          Syncing products from Polar...
        </div>
      )}

      {!isSyncing && activeProducts.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          No products found after syncing. Check your Polar configuration.
        </div>
      )}

      <Authenticated>
        <div className="space-y-10">
          <section className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">Recurring subscription</h3>
              <p className="text-muted-foreground">
                Pick a recurring plan (monthly/yearly) synced from Polar.
              </p>
              {hasLifetime && (
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
                      hasLifetime ? (
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
                        <CheckoutLink
                          polarApi={{ generateCheckoutLink: api.polar.generateCheckoutLink }}
                          productIds={[product.id]}
                          embed={false}
                          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                          Start subscription
                        </CheckoutLink>
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
                One-time purchase for lifetime access, verified via Polar entitlements.
              </p>
            </div>
            {lifetimeProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lifetimeProducts.map((product) => (
                  <PriceCard
                    key={product.id}
                    product={product}
                    action={
                      billing.data?.isLifetime ? (
                        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 inline-block">
                          Lifetime premium is active for your account.
                        </div>
                      ) : (
                        <CheckoutLink
                          polarApi={{ generateCheckoutLink: api.polar.generateCheckoutLink }}
                          productIds={[product.id]}
                          embed={false}
                          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                        >
                          Buy lifetime access
                        </CheckoutLink>
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
