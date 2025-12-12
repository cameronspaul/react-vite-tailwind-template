import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { CustomerPortalLink } from "@convex-dev/polar/react";
import { api } from "../../convex/_generated/api";
import { PriceCard } from "../components/PriceCard";
import { staticProducts, type ProductWithCheckout } from "../components/staticProducts";
import { useBillingStatus } from "../hooks/useBillingStatus";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

export const ProductList = () => {
  const location = useLocation();
  const billing = useBillingStatus();
  const { refresh: refreshBilling } = billing;

  const billingReady = billing.status === "ready";
  const hasLifetime = billingReady && billing.isLifetime;
  const hasSubscription =
    billingReady &&
    Boolean(billing.data?.hasSubscription ?? billing.data?.subscription);
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
        : billing.isLifetime
          ? "Lifetime premium"
          : billing.isPremium
            ? "Recurring subscription"
            : "Free plan";

  const searchParams = new URLSearchParams(location.search);
  const checkoutId = searchParams.get("checkout_id");
  const showSuccess =
    location.pathname.startsWith("/payment/success") || Boolean(checkoutId);

  // After returning from checkout, refresh billing so the portal link appears immediately.
  useEffect(() => {
    if (!showSuccess) return;
    void refreshBilling();
  }, [refreshBilling, showSuccess]);

  const addPrefillParams = (
    url: string,
    email?: string | null,
    name?: string | null
  ) => {
    if (!email) {
      return url;
    }

    try {
      const parsed = new URL(url);
      parsed.searchParams.set("customer_email", email);
      if (name) {
        parsed.searchParams.set("customer_name", name);
      }
      return parsed.toString();
    } catch (error) {
      console.error("Failed to prefill checkout link", error);
      return url;
    }
  };

  const renderCheckoutCta = (
    product: ProductWithCheckout,
    label: string,
    variant: "default" | "outline" | "ghost" = "default"
  ) => {
    if (!product.checkoutUrl) {
      return (
        <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Checkout link missing. Set the matching VITE_CHECKOUT_LINK_* env var.
          </AlertDescription>
        </Alert>
      );
    }

    const checkoutHref = addPrefillParams(
      product.checkoutUrl,
      billing.data?.email,
      billing.data?.name ?? null
    );

    return (
      <Button asChild variant={variant}>
        <a href={checkoutHref}>
          {label}
        </a>
      </Button>
    );
  };

  const renderSignInPrompt = () => (
    <p className="text-sm text-muted-foreground">
      Sign in to purchase or manage premium access.
    </p>
  );

  const renderLoadingState = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Skeleton className="h-4 w-4 rounded-full" />
      <span>Checking your billing status...</span>
    </div>
  );

  return (
    <div className="space-y-8 text-foreground">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Premium access</h2>
          <p className="text-muted-foreground">
            Plans are defined locally; checkout links are provided via env vars.
          </p>
        </div>
        {hasSubscription && (
          <CustomerPortalLink
            polarApi={{ generateCustomerPortalUrl: api.polar.generateCustomerPortalUrl }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
          >
            Polar customer portal
          </CustomerPortalLink>
        )}
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Congratulations - you are now premium!</AlertTitle>
          {checkoutId && (
            <AlertDescription>Checkout ID: {checkoutId}</AlertDescription>
          )}
        </Alert>
      )}

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Current status</p>
          <p className="text-xl font-semibold leading-tight">{statusLabel}</p>
        </CardContent>
      </Card>

      {staticProducts.length === 0 && (
        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No products configured. Add plans in <code className="text-sm">src/staticProducts.ts</code>.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-10">
        <section className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold">Recurring subscription</h3>
            <p className="text-muted-foreground">
              Pick a recurring plan (weekly/monthly/quarterly/semiannual). Checkout links come from env.
            </p>
            {!billingReady && (
              <div className="mt-2">{renderLoadingState()}</div>
            )}
            {billingReady && hasLifetime && (
              <Alert className="mt-2 bg-green-50 border-green-200 text-green-700">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Lifetime access is active. Subscriptions are disabled.
                </AlertDescription>
              </Alert>
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
                      renderLoadingState()
                    ) : !billing.data ? (
                      renderSignInPrompt()
                    ) : hasLifetime ? (
                      <Badge variant="secondary">
                        Lifetime is active; no subscription needed.
                      </Badge>
                    ) : billing.data?.isPremium && hasSubscription ? (
                      <CustomerPortalLink
                        polarApi={{ generateCustomerPortalUrl: api.polar.generateCustomerPortalUrl }}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Update subscription
                      </CustomerPortalLink>
                    ) : canSubscribe ? (
                      renderCheckoutCta(product, "Start subscription")
                    ) : (
                      <Badge variant="secondary">
                        Subscriptions unavailable while lifetime is active.
                      </Badge>
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
                      renderLoadingState()
                    ) : !billing.data ? (
                      renderSignInPrompt()
                    ) : billing.data?.isLifetime ? (
                      <Alert className="bg-green-50 border-green-200 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Lifetime premium is active for your account.
                        </AlertDescription>
                      </Alert>
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
                          "outline"
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
    </div>
  );
};
