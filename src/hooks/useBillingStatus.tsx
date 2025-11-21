import { createContext, useContext, useMemo } from "react";
import { useQuery } from "convex/react";
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
  const billing = useQuery(api.polar.getBillingStatus);

  const value = useMemo<BillingContextValue>(() => {
    const status = billing === undefined ? "loading" : "ready";
    const isPremium = Boolean(billing?.isPremium);
    const isLifetime = Boolean(billing?.isLifetime);

    return {
      data: billing ?? null,
      status,
      isPremium,
      isLifetime,
    };
  }, [billing]);

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
