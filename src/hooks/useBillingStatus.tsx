import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type BillingData =
  | {
      subscription: {
        product?: {
          name?: string | null;
          isRecurring?: boolean;
        };
      } | null;
      isPremium: boolean;
      isLifetime: boolean;
    }
  | null;

type BillingContextValue = {
  data: BillingData;
  status: "loading" | "ready";
  isPremium: boolean;
  isLifetime: boolean;
};

const BillingContext = createContext<BillingContextValue | undefined>(
  undefined
);

export function BillingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const fetchBillingStatus = useAction(api.polar.getBillingStatus);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
    // Wait for auth to resolve; useQuery returns undefined while loading.
    if (currentUser === undefined) {
      setStatus("loading");
      return () => {
        cancelled = true;
      };
    }

    // If unauthenticated, clear billing immediately.
    if (currentUser === null) {
      setBilling(null);
      setStatus("ready");
      return () => {
        cancelled = true;
      };
    }

    setStatus("loading");
    fetchBillingStatus()
      .then((result) => {
        if (!cancelled) {
          setBilling(result ?? null);
        }
      })
      .catch((error) => {
        console.error("Failed to load billing status", error);
        if (!cancelled) {
          setBilling(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setStatus("ready");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchBillingStatus, currentUser]);

  const value = useMemo<BillingContextValue>(() => {
    const isPremium = Boolean(billing?.isPremium);
    const isLifetime = Boolean(billing?.isLifetime);

    return {
      data: billing,
      status,
      isPremium,
      isLifetime,
    };
  }, [billing, status]);

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBillingStatus() {
  const ctx = useContext(BillingContext);
  if (!ctx) {
    throw new Error("useBillingStatus must be used within BillingProvider");
  }
  return ctx;
}
