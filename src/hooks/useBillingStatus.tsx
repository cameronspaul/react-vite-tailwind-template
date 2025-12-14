import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCacheStore } from "../stores/useCacheStore";

type BillingContextValue = {
  status: "loading" | "refreshing" | "ready";
  isPremium: boolean;
  isLifetime: boolean;
  refresh: () => Promise<void>;
};

const BillingContext = createContext<BillingContextValue | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const fetchBilling = useAction(api.polar.getBillingStatus);
  const { billing, hydrated, refreshing, setBilling, setRefreshing, clear } = useCacheStore();

  const refresh = useCallback(async () => {
    if (currentUser === undefined) return;
    if (currentUser === null) { clear(); return; }

    setRefreshing(true);
    try {
      const result = await fetchBilling();
      if (result) setBilling({ isPremium: result.isPremium, isLifetime: result.isLifetime, subscription: result.subscription });
    } catch (e) {
      console.error("Failed to load billing", e);
    } finally {
      setRefreshing(false);
    }
  }, [currentUser, fetchBilling, setBilling, setRefreshing, clear]);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser === null) { clear(); return; }
    void refresh();
  }, [currentUser, refresh, clear]);

  const value = useMemo<BillingContextValue>(() => {
    const isPremium = Boolean(billing?.isPremium);
    const isLifetime = Boolean(billing?.isLifetime);
    const status = (!hydrated && !billing) ? "loading" : refreshing ? "refreshing" : "ready";
    return { status, isPremium, isLifetime, refresh };
  }, [billing, hydrated, refreshing, refresh]);

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBillingStatus() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("useBillingStatus must be used within BillingProvider");
  return ctx;
}
