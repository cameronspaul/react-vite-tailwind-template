import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
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
import { Check, CheckCircle, AlertTriangle } from "lucide-react";
import { Separator } from "../components/ui/separator";

// Credit packages configuration - customize these for your needs
// All bundles use the same Polar product ID with "custom" price type
// The actual price is set dynamically at checkout via the `amount` parameter
// Add your Polar product ID in .env.local as VITE_POLAR_PRODUCT_ID_CREDITS
const CREDITS_PRODUCT_ID = import.meta.env.VITE_POLAR_PRODUCT_ID_CREDITS as string | undefined;

const creditPackages = [
    {
        id: "credits-100",
        name: "Starter Pack",
        credits: 100,
        price: 999, // Price in cents ($9.99)
        currency: "USD",
        description: "Perfect for trying things out",
        polarProductId: CREDITS_PRODUCT_ID,
        features: [
            "100 Credits",
            "~$0.10 per credit",
            "Never expires",
        ],
        popular: false,
    },
    {
        id: "credits-300",
        name: "Pro Pack",
        credits: 300,
        price: 2499, // Price in cents ($24.99)
        currency: "USD",
        description: "Best value for regular users",
        polarProductId: CREDITS_PRODUCT_ID,
        features: [
            "300 Credits",
            "~$0.08 per credit",
            "Save 17%",
            "Never expires",
        ],
        popular: true,
    },
    {
        id: "credits-1000",
        name: "Power Pack",
        credits: 1000,
        price: 6999, // Price in cents ($69.99)
        currency: "USD",
        description: "For power users and teams",
        polarProductId: CREDITS_PRODUCT_ID,
        features: [
            "1000 Credits",
            "~$0.07 per credit",
            "Save 30%",
            "Never expires",
            "Priority support",
        ],
        popular: false,
    },
];

export const CreditsPage = () => {
    const location = useLocation();
    const billing = useBillingStatus();
    const { refresh: refreshBilling } = billing;
    const createCheckoutSession = useAction(api.polar.createCheckoutSession);
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

    const billingReady = billing.status === "ready";

    const searchParams = new URLSearchParams(location.search);
    const checkoutId = searchParams.get("checkout_id");
    const showSuccess =
        location.pathname.startsWith("/credits/success") || Boolean(checkoutId);

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

    // Handle checkout with custom amount for credit bundles
    const handleCheckout = async (creditPackage: typeof creditPackages[0]) => {
        if (!creditPackage.polarProductId) return;

        setLoadingProductId(creditPackage.id); // Track by bundle id since all use same product
        try {
            const result = await createCheckoutSession({
                productId: creditPackage.polarProductId,
                successUrl: `${window.location.origin}/credits?checkout_id={CHECKOUT_ID}`,
                // Set custom price for the bundle (in cents)
                amount: creditPackage.price,
                // Include bundle info in metadata for order tracking
                metadata: {
                    bundle_id: creditPackage.id,
                    credits: creditPackage.credits,
                    bundle_name: creditPackage.name,
                },
            });
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
        creditPackage: typeof creditPackages[0],
        label: string,
        variant: "default" | "outline" | "ghost" | "secondary" = "default"
    ) => {
        if (!creditPackage.polarProductId) {
            return (
                <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Missing product ID.
                    </AlertDescription>
                </Alert>
            );
        }

        // Track loading by bundle id since all bundles share the same product id
        const isLoading = loadingProductId === creditPackage.id;

        return (
            <Button
                className="w-full"
                variant={variant}
                disabled={isLoading || loadingProductId !== null}
                onClick={() => handleCheckout(creditPackage)}
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

    const CreditPackageCard = ({ creditPackage }: { creditPackage: typeof creditPackages[0] }) => {
        const isPopular = creditPackage.popular;

        return (
            <Card
                className={`flex flex-col relative ${isPopular ? "border-primary shadow-md scale-105 z-10" : "border-border"
                    }`}
            >
                {isPopular && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary">Best Value</Badge>
                    </div>
                )}
                <CardHeader>
                    <CardTitle className="text-xl">{creditPackage.name}</CardTitle>
                    <CardDescription>{creditPackage.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                            {formatPrice(creditPackage.price, creditPackage.currency)}
                        </span>
                        <span className="text-muted-foreground">
                            one-time
                        </span>
                    </div>
                    <Separator />
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {creditPackage.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    {!billingReady ? (
                        renderLoadingButton()
                    ) : !billing.data ? (
                        renderSignInButton()
                    ) : creditPackage.polarProductId ? (
                        renderCheckoutCta(creditPackage, `Buy ${creditPackage.credits} Credits`, isPopular ? "default" : "outline")
                    ) : (
                        <Button disabled variant="secondary" className="w-full">
                            Coming Soon
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Purchase Credits
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Credits can be used to unlock premium features and actions.
                    No hidden fees.
                </p>
            </div>

            {showSuccess && (
                <Alert className="bg-primary/10 border-primary/20 text-foreground mb-8 max-w-2xl mx-auto">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Purchase Successful!</AlertTitle>
                    <AlertDescription>Your credits have been added to your account.</AlertDescription>
                </Alert>
            )}

            {/* Credits Packages Grid */}
            <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {creditPackages.map((creditPackage) => (
                        <CreditPackageCard key={creditPackage.id} creditPackage={creditPackage} />
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold">How Credits Work</h2>
                    <p className="text-muted-foreground">Buy once, use anytime.</p>
                </div>
                <Card className="flex flex-col border-2 border-muted bg-muted/20">
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Credits never expire — use them whenever you need</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Buy larger packs for better value per credit</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Instant delivery to your account</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
