import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppStore, type CachedBilling } from "../stores/useAppStore";

type BillingContextValue = {
  data: CachedBilling | null;
  status: "loading" | "refreshing" | "ready";
  isPremium: boolean;
  isLifetime: boolean;
  refresh: () => Promise<void>;
};

const BillingContext = createContext<BillingContextValue | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const fetchBilling = useAction(api.polar.getBillingStatus);
  const { billing, hydrated, refreshing, setBilling, setRefreshing, clear } = useAppStore();

  const refresh = useCallback(async () => {
    if (currentUser === undefined) return;
    if (currentUser === null) return void clear();

    setRefreshing(true);
    try {
      const r = await fetchBilling();
      if (r) setBilling({ isPremium: r.isPremium, isLifetime: r.isLifetime, hasSubscription: r.hasSubscription, subscription: r.subscription });
    } catch (e) {
      console.error("Failed to load billing", e);
    } finally {
      setRefreshing(false);
    }
  }, [currentUser, fetchBilling, setBilling, setRefreshing, clear]);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser === null) return void clear();
    void refresh();
  }, [currentUser, refresh, clear]);

  const value = useMemo<BillingContextValue>(() => ({
    data: currentUser === null ? null : billing,
    status: !hydrated && !billing ? "loading" : refreshing ? "refreshing" : "ready",
    isPremium: Boolean(billing?.isPremium),
    isLifetime: Boolean(billing?.isLifetime),
    refresh,
  }), [billing, hydrated, refreshing, currentUser, refresh]);

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBillingStatus() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("useBillingStatus must be used within BillingProvider");
  return ctx;
}
