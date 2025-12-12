import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useBillingStatus } from "../hooks/useBillingStatus";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type PremiumGateProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const { status, isPremium, isLifetime } = useBillingStatus();
  const { signIn } = useAuthActions();

  if (status === "loading") {
    return (
      fallback ?? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-4 rounded-full" />
          <span>Checking premium...</span>
        </div>
      )
    );
  }

  if (isPremium || isLifetime) {
    return <>{children}</>;
  }

  return (
    fallback ?? (
      <Card>
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Premium access is required to view this section.
          </p>
          <Authenticated>
            <p className="text-sm text-muted-foreground">
              Upgrade from the Pricing page to continue.
            </p>
          </Authenticated>
          <Unauthenticated>
            <div className="flex gap-2">
              <Button
                onClick={() => void signIn("github")}
                variant="default"
                size="sm"
              >
                Sign in with GitHub
              </Button>
              <Button
                onClick={() => void signIn("google")}
                variant="outline"
                size="sm"
              >
                Sign in with Google
              </Button>
            </div>
          </Unauthenticated>
        </CardContent>
      </Card>
    )
  );
}
