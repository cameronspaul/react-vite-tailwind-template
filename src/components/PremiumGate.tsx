import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useBillingStatus } from "../hooks/useBillingStatus";

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
        <div className="text-sm text-muted-foreground">Checking premium…</div>
      )
    );
  }

  if (isPremium || isLifetime) {
    return <>{children}</>;
  }

  return (
    fallback ?? (
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
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
            <button
              onClick={() => void signIn("github")}
              className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Sign in with GitHub
            </button>
            <button
              onClick={() => void signIn("google")}
              className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted"
            >
              Sign in with Google
            </button>
          </div>
        </Unauthenticated>
      </div>
    )
  );
}
