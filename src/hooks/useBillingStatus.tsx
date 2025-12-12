import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Local storage key for caching billing status (persists across browser sessions)
const BILLING_CACHE_KEY = "billing_status_cache";
const BILLING_CACHE_TIMESTAMP_KEY = "billing_status_cache_timestamp";
const BILLING_LAST_REQUEST_KEY = "billing_status_last_request";
// Refresh interval: 5 minutes in milliseconds
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
// Minimum time between API requests (prevents rate limiting)
const MIN_REQUEST_INTERVAL_MS = 30 * 1000;
// Cache validity: 24 hours - we always validate in background, this just prevents
// showing stale premium status for too long if the user was away for a while
const CACHE_VALIDITY_MS = 24 * 60 * 60 * 1000;

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
  status: "loading" | "ready";
  isPremium: boolean;
  isLifetime: boolean;
  refresh: () => Promise<void>;
};

const BillingContext = createContext<BillingContextValue | undefined>(
  undefined
);

// Helper to get cached billing data from localStorage
function getCachedBillingData(): BillingData | null {
  try {
    const cachedData = localStorage.getItem(BILLING_CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(BILLING_CACHE_TIMESTAMP_KEY);

    if (cachedData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp < CACHE_VALIDITY_MS) {
        return JSON.parse(cachedData) as BillingData;
      }
    }
  } catch (error) {
    console.warn("Failed to read billing cache:", error);
  }
  return null;
}

// Helper to set cached billing data in localStorage
function setCachedBillingData(data: BillingData): void {
  try {
    if (data) {
      localStorage.setItem(BILLING_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(BILLING_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } else {
      localStorage.removeItem(BILLING_CACHE_KEY);
      localStorage.removeItem(BILLING_CACHE_TIMESTAMP_KEY);
    }
  } catch (error) {
    console.warn("Failed to write billing cache:", error);
  }
}

// Helper to clear billing cache
function clearBillingCache(): void {
  try {
    localStorage.removeItem(BILLING_CACHE_KEY);
    localStorage.removeItem(BILLING_CACHE_TIMESTAMP_KEY);
    localStorage.removeItem(BILLING_LAST_REQUEST_KEY);
  } catch (error) {
    console.warn("Failed to clear billing cache:", error);
  }
}

// Helper to check if we can make a new request (rate limit cooldown)
function canMakeRequest(): boolean {
  try {
    const lastRequest = localStorage.getItem(BILLING_LAST_REQUEST_KEY);
    if (!lastRequest) return true;
    const lastRequestTime = parseInt(lastRequest, 10);
    return Date.now() - lastRequestTime >= MIN_REQUEST_INTERVAL_MS;
  } catch {
    return true;
  }
}

// Helper to mark that we made a request
function markRequestMade(): void {
  try {
    localStorage.setItem(BILLING_LAST_REQUEST_KEY, Date.now().toString());
  } catch {
    // Ignore errors
  }
}

export function BillingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const fetchBillingStatus = useAction(api.polar.getBillingStatus);

  // Initialize with cached data to prevent pop-in (only read once)
  const initialCachedData = useRef(getCachedBillingData());
  const [billing, setBilling] = useState<BillingData | null>(initialCachedData.current);
  // If we have cached data, start as "ready" to prevent pop-in
  const [status, setStatus] = useState<"loading" | "ready">(initialCachedData.current ? "ready" : "loading");

  // Track if initial fetch has been done
  const hasInitialFetch = useRef(false);
  // Track the interval for cleanup
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track if a request is currently in progress
  const isRequestInProgress = useRef(false);

  const refresh = useCallback(async (silent = false) => {
    // Avoid mutating state while auth is still resolving.
    if (currentUser === undefined) {
      return;
    }

    // Clear cache and billing if unauthenticated.
    if (currentUser === null) {
      setBilling(null);
      clearBillingCache();
      setStatus("ready");
      return;
    }

    // Prevent concurrent requests and respect rate limit cooldown
    if (isRequestInProgress.current) {
      return;
    }

    // For silent refreshes, check rate limit cooldown
    if (silent && !canMakeRequest()) {
      return;
    }

    isRequestInProgress.current = true;

    // Only set loading status if not a silent refresh (background refresh)
    if (!silent) {
      setStatus("loading");
    }

    try {
      markRequestMade();
      const result = await fetchBillingStatus();
      const billingData = result ?? null;
      setBilling(billingData);
      // Cache the result for session persistence
      setCachedBillingData(billingData);
    } catch (error: unknown) {
      console.error("Failed to load billing status", error);

      // Check for rate limit error (429) - respect the retry-after
      const err = error as { statusCode?: number };
      if (err?.statusCode === 429) {
        console.warn("Rate limited by Polar API, will retry on next interval");
        // Keep using cached data, don't clear it
      }
    } finally {
      isRequestInProgress.current = false;
      setStatus("ready");
    }
  }, [currentUser, fetchBillingStatus]);

  useEffect(() => {
    // Wait for auth to resolve; useQuery returns undefined while loading.
    if (currentUser === undefined) {
      // Only set loading if we don't have cached data
      if (!initialCachedData.current) {
        setStatus("loading");
      }
      return;
    }

    // If user logged out, clear everything
    if (currentUser === null) {
      setBilling(null);
      clearBillingCache();
      setStatus("ready");
      hasInitialFetch.current = false;

      // Clear any existing refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    let cancelled = false;

    const load = async () => {
      if (cancelled) return;

      // Skip if we already did the initial fetch
      if (hasInitialFetch.current) return;
      hasInitialFetch.current = true;

      // If we have cached data, do a silent refresh (no loading state)
      const shouldSilentRefresh = initialCachedData.current !== null;

      await refresh(shouldSilentRefresh);
    };

    void load();

    // Set up 5-minute refresh interval for background updates
    // Only create interval if not already created
    if (!refreshIntervalRef.current) {
      refreshIntervalRef.current = setInterval(() => {
        if (!cancelled) {
          // Silent refresh - don't show loading state
          void refresh(true);
        }
      }, REFRESH_INTERVAL_MS);
    }

    return () => {
      cancelled = true;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
    // Note: We intentionally exclude 'refresh' from deps to prevent re-running
    // The refresh callback is stable enough for our use case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const value = useMemo<BillingContextValue>(() => {
    const isPremium = Boolean(billing?.isPremium);
    const isLifetime = Boolean(billing?.isLifetime);

    return {
      data: billing,
      status,
      isPremium,
      isLifetime,
      refresh: () => refresh(false), // Public refresh is non-silent
    };
  }, [billing, refresh, status]);

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
