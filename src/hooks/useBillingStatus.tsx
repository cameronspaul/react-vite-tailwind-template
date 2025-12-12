import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const CACHE_KEYS = {
  data: "billing_status_cache",
  timestamp: "billing_status_cache_timestamp",
  lastRequest: "billing_status_last_request",
} as const;

const INTERVALS = {
  refresh: 5 * 60 * 1000,      // 5 minutes
  minRequest: 30 * 1000,       // 30 seconds
  cacheValidity: 24 * 60 * 60 * 1000, // 24 hours
} as const;

type BillingData = {
  subscription: { product?: { name?: string | null; isRecurring?: boolean } } | null;
  isPremium: boolean;
  isLifetime: boolean;
  hasSubscription?: boolean;
  email?: string | null;
  name?: string | null;
} | null;

type BillingContextValue = {
  data: BillingData;
  status: "loading" | "ready";
  isPremium: boolean;
  isLifetime: boolean;
  refresh: () => Promise<void>;
};

const BillingContext = createContext<BillingContextValue | undefined>(undefined);

// Unified cache utility
const cache = {
  get: (): BillingData | null => {
    try {
      const data = localStorage.getItem(CACHE_KEYS.data);
      const timestamp = localStorage.getItem(CACHE_KEYS.timestamp);
      if (data && timestamp && Date.now() - parseInt(timestamp, 10) < INTERVALS.cacheValidity) {
        return JSON.parse(data);
      }
    } catch { /* ignore */ }
    return null;
  },
  set: (data: BillingData) => {
    try {
      if (data) {
        localStorage.setItem(CACHE_KEYS.data, JSON.stringify(data));
        localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());
      } else {
        cache.clear();
      }
    } catch { /* ignore */ }
  },
  clear: () => {
    try {
      Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch { /* ignore */ }
  },
  canRequest: () => {
    try {
      const last = localStorage.getItem(CACHE_KEYS.lastRequest);
      return !last || Date.now() - parseInt(last, 10) >= INTERVALS.minRequest;
    } catch { return true; }
  },
  markRequest: () => {
    try { localStorage.setItem(CACHE_KEYS.lastRequest, Date.now().toString()); } catch { /* ignore */ }
  },
};

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const fetchBillingStatus = useAction(api.polar.getBillingStatus);

  const initialCache = useRef(cache.get());
  const [billing, setBilling] = useState<BillingData>(initialCache.current);
  const [status, setStatus] = useState<"loading" | "ready">(initialCache.current ? "ready" : "loading");
  const hasInitialFetch = useRef(false);
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestInProgress = useRef(false);

  const refresh = useCallback(async (silent = false) => {
    if (currentUser === undefined) return;

    if (currentUser === null) {
      setBilling(null);
      cache.clear();
      setStatus("ready");
      return;
    }

    if (requestInProgress.current || (silent && !cache.canRequest())) return;

    requestInProgress.current = true;
    if (!silent) setStatus("loading");

    try {
      cache.markRequest();
      const result = await fetchBillingStatus();
      const data = result ?? null;
      setBilling(data);
      cache.set(data);
    } catch (error) {
      console.error("Failed to load billing status", error);
      if ((error as { statusCode?: number })?.statusCode === 429) {
        console.warn("Rate limited by Polar API, will retry on next interval");
      }
    } finally {
      requestInProgress.current = false;
      setStatus("ready");
    }
  }, [currentUser, fetchBillingStatus]);

  useEffect(() => {
    if (currentUser === undefined) {
      if (!initialCache.current) setStatus("loading");
      return;
    }

    if (currentUser === null) {
      setBilling(null);
      cache.clear();
      setStatus("ready");
      hasInitialFetch.current = false;
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      }
      return;
    }

    if (!hasInitialFetch.current) {
      hasInitialFetch.current = true;
      void refresh(initialCache.current !== null);
    }

    if (!refreshInterval.current) {
      refreshInterval.current = setInterval(() => void refresh(true), INTERVALS.refresh);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const value = useMemo<BillingContextValue>(() => ({
    data: billing,
    status,
    isPremium: Boolean(billing?.isPremium),
    isLifetime: Boolean(billing?.isLifetime),
    refresh: () => refresh(false),
  }), [billing, refresh, status]);

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBillingStatus() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("useBillingStatus must be used within BillingProvider");
  return ctx;
}
