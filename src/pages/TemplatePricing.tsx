import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CustomerPortalLink } from "@convex-dev/polar/react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { staticProducts, type ProductWithCheckout } from "../components/staticProducts";
import { useBillingStatus } from "../hooks/useBillingStatus";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Check, AlertTriangle, CheckCircle } from "lucide-react";
import { Separator } from "../components/ui/separator";

export const ProductList = () => {
  const location = useLocation();
  const billing = useBillingStatus();
  const { refresh: refreshBilling } = billing;
  const createCheckoutSession = useAction(api.polar.createCheckoutSession);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

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

  const searchParams = new URLSearchParams(location.search);
  const checkoutId = searchParams.get("checkout_id");
  const showSuccess =
    location.pathname.startsWith("/payment/success") || Boolean(checkoutId);

  useEffect(() => {
    if (!showSuccess) return;
    void refreshBilling();
  }, [refreshBilling, showSuccess]);

  const formatPrice = (amount: number | undefined, currency: string = "USD") => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const handleCheckout = async (polarProductId: string) => {
    setLoadingProductId(polarProductId);
    try {
      const result = await createCheckoutSession({ productId: polarProductId });
      if ("url" in result) {
        window.location.href = result.url;
      } else {
        console.error("Checkout error:", result.error);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const renderCheckoutCta = (
    product: ProductWithCheckout,
    label: string,
    variant: "default" | "outline" | "ghost" | "secondary" = "default"
  ) => {
    if (!product.polarProductId) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Missing product ID.
          </AlertDescription>
        </Alert>
      );
    }

    const isLoading = loadingProductId === product.polarProductId;

    return (
      <Button
        className="w-full"
        variant={variant}
        disabled={isLoading}
        onClick={() => handleCheckout(product.polarProductId!)}
      >
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          label
        )}
      </Button>
    );
  };

  const renderLoadingButton = () => (
    <Button disabled className="w-full">
      <Skeleton className="h-4 w-20" />
    </Button>
  );

  const renderSignInButton = () => (
    <Button disabled variant="secondary" className="w-full">
      Sign in to purchase
    </Button>
  );

  const SubscriptionCard = ({ product }: { product: ProductWithCheckout }) => {
    const price = product.prices[0];
    const isPopular = product.recurringInterval === "month"; // Example logic

    return (
      <Card
        className={`flex flex-col relative ${isPopular ? "border-primary shadow-md scale-105 z-10" : "border-border"
          }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
            <Badge className="bg-primary text-primary-foreground hover:bg-primary">Most Popular</Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">
              {formatPrice(price?.priceAmount, price?.priceCurrency)}
            </span>
            <span className="text-muted-foreground">
              /{product.recurringInterval}
            </span>
          </div>
          <Separator />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Unlimited Access</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Premium Support</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>All features included</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {!billingReady ? (
            renderLoadingButton()
          ) : !billing.data ? (
            renderSignInButton()
          ) : hasLifetime ? (
            <Button disabled variant="secondary" className="w-full">
              Lifetime Active
            </Button>
          ) : billing.data?.isPremium && hasSubscription ? (
            <Button asChild variant="outline" className="w-full">
              <CustomerPortalLink polarApi={{ generateCustomerPortalUrl: api.polar.generateCustomerPortalUrl }}>
                Manage Subscription
              </CustomerPortalLink>
            </Button>
          ) : canSubscribe ? (
            renderCheckoutCta(product, "Subscribe Now", isPopular ? "default" : "outline")
          ) : (
            <Button disabled variant="secondary" className="w-full">
              Unavailable
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const LifetimeCard = ({ product }: { product: ProductWithCheckout }) => {
    const price = product.prices[0];
    return (
      <Card className="flex flex-col border-2 border-muted bg-muted/20">
        <CardHeader>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">
              {formatPrice(price?.priceAmount, price?.priceCurrency)}
            </span>
            <span className="text-muted-foreground">one-time</span>
          </div>
          <Separator />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Lifetime Access</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>No Recurring Fees</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Future Updates Included</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {!billingReady ? (
            renderLoadingButton()
          ) : !billing.data ? (
            renderSignInButton()
          ) : billing.data?.isLifetime ? (
            <Button disabled variant="default" className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" /> Owned
            </Button>
          ) : (
            renderCheckoutCta(
              product,
              hasSubscription ? "Upgrade to Lifetime" : "Get Lifetime Access",
              "default"
            )
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you.
          No hidden fees.
        </p>
      </div>

      {showSuccess && (
        <Alert className="bg-primary/10 border-primary/20 text-foreground mb-8 max-w-2xl mx-auto">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Payment Successful!</AlertTitle>
          <AlertDescription>Your account has been upgraded.</AlertDescription>
        </Alert>
      )}

      {billing.isPremium && (
        <div className="flex justify-center mb-12">
          <Button asChild variant="outline">
            <CustomerPortalLink polarApi={{ generateCustomerPortalUrl: api.polar.generateCustomerPortalUrl }}>
              Open Customer Portal
            </CustomerPortalLink>
          </Button>
        </div>
      )}

      {/* Subscription Plans */}
      {recurringProducts.length > 0 && (
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {recurringProducts.map((product) => (
              <SubscriptionCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Lifetime Plan Section */}
      {lifetimeProducts.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Lifetime Access</h2>
            <p className="text-muted-foreground">Pay once, own it forever.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {lifetimeProducts.map((product) => (
              <LifetimeCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
