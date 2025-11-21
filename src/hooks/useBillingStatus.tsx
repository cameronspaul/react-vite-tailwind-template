import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAction } from "convex/react";
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
  const fetchBillingStatus = useAction(api.polar.getBillingStatus);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
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
  }, [fetchBillingStatus]);

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
