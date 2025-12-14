import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBillingStore } from "../stores/useBillingStore";

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
    hasSubscription?: boolean;
    email?: string | null;
    name?: string | null;
  }
  | null;

type BillingContextValue = {
  data: BillingData;
  /** 
   * "loading" = first-time load with no cached data
   * "refreshing" = we have cached data but are updating in background
   * "ready" = fresh data is available
   */
  status: "loading" | "refreshing" | "ready";
  isPremium: boolean;
  isLifetime: boolean;
  refresh: () => Promise<void>;
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

  // Zustand store with persistence
  const { cachedBilling, hasHydrated, isRefreshing, setBilling, setRefreshing, clear } = useBillingStore();

  const refresh = useCallback(async () => {
    // Avoid mutating state while auth is still resolving.
    if (currentUser === undefined) {
      return;
    }

    // Clear cache if unauthenticated.
    if (currentUser === null) {
      clear();
      return;
    }

    setRefreshing(true);

    try {
      const result = await fetchBillingStatus();
      setBilling(result ?? null);
    } catch (error) {
      console.error("Failed to load billing status", error);
      // Keep cached data on error - don't clear it
    } finally {
      setRefreshing(false);
    }
  }, [currentUser, fetchBillingStatus, setBilling, setRefreshing, clear]);

  useEffect(() => {
    // Wait for auth to resolve; useQuery returns undefined while loading.
    if (currentUser === undefined) {
      return;
    }

    // Clear cache if user logs out
    if (currentUser === null) {
      clear();
      return;
    }

    let cancelled = false;
    const load = async () => {
      if (cancelled) return;
      await refresh();
    };

    // Always refresh in background to keep data fresh
    void load();

    return () => {
      cancelled = true;
    };
  }, [currentUser, refresh, clear]);

  const value = useMemo<BillingContextValue>(() => {
    // Use cached data immediately - no flash!
    const billing = cachedBilling;
    const isPremium = Boolean(billing?.isPremium);
    const isLifetime = Boolean(billing?.isLifetime);

    // Determine status:
    // - "loading" only if we have NO cached data AND auth/fetch is pending
    // - "refreshing" if we have cached data but are updating it
    // - "ready" if we have data and aren't refreshing
    let status: "loading" | "refreshing" | "ready";

    if (!hasHydrated && currentUser === undefined) {
      // First load, still waiting for auth
      status = "loading";
    } else if (!hasHydrated && !cachedBilling && currentUser !== null) {
      // Authenticated but no cache yet - show loading
      status = "loading";
    } else if (isRefreshing) {
      // We have cache, just updating in background
      status = "refreshing";
    } else {
      status = "ready";
    }

    return {
      data: billing,
      status,
      isPremium,
      isLifetime,
      refresh,
    };
  }, [cachedBilling, hasHydrated, isRefreshing, currentUser, refresh]);

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
