import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
const creditPackages = [
    {
        id: "credits-100",
        name: "Starter Pack",
        credits: 100,
        price: 999, // Price in cents
        currency: "USD",
        description: "Perfect for trying out credits",
        checkoutUrl: "", // Add your Polar checkout URL here
        features: [
            "100 Credits",
            "Never expires",
            "Use anytime",
        ],
        popular: false,
    },
    {
        id: "credits-300",
        name: "Value Pack",
        credits: 300,
        price: 2499, // Price in cents
        currency: "USD",
        description: "Best value for regular users",
        checkoutUrl: "", // Add your Polar checkout URL here
        features: [
            "300 Credits",
            "Save 17%",
            "Never expires",
            "Priority support",
        ],
        popular: true,
    },
    {
        id: "credits-1000",
        name: "Pro Pack",
        credits: 1000,
        price: 6999, // Price in cents
        currency: "USD",
        description: "For power users and teams",
        checkoutUrl: "", // Add your Polar checkout URL here
        features: [
            "1000 Credits",
            "Save 30%",
            "Never expires",
            "Priority support",
            "Exclusive features",
        ],
        popular: false,
    },
];

export const CreditsPage = () => {
    const location = useLocation();
    const billing = useBillingStatus();
    const { refresh: refreshBilling } = billing;

    const billingReady = billing.status === "ready";

    const searchParams = new URLSearchParams(location.search);
    const checkoutId = searchParams.get("checkout_id");
    const showSuccess =
        location.pathname.startsWith("/credits/success") || Boolean(checkoutId);

    useEffect(() => {
        if (!showSuccess) return;
        void refreshBilling();
    }, [refreshBilling, showSuccess]);

    const addPrefillParams = (
        url: string,
        email?: string | null,
        name?: string | null
    ) => {
        if (!email || !url) {
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

    const formatPrice = (amount: number | undefined, currency: string = "USD") => {
        if (amount === undefined) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    const renderCheckoutCta = (
        creditPackage: typeof creditPackages[0],
        label: string,
        variant: "default" | "outline" | "ghost" | "secondary" = "default"
    ) => {
        if (!creditPackage.checkoutUrl) {
            return (
                <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Missing checkout URL.
                    </AlertDescription>
                </Alert>
            );
        }

        const checkoutHref = addPrefillParams(
            creditPackage.checkoutUrl,
            billing.data?.email,
            billing.data?.name ?? null
        );

        return (
            <Button className="w-full" asChild variant={variant}>
                <a href={checkoutHref}>
                    {label}
                </a>
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
                    ) : creditPackage.checkoutUrl ? (
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
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Spend credits on premium features and actions</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
