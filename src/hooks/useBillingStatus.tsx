import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

export function BillingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const fetchBillingStatus = useAction(api.polar.getBillingStatus);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  const refresh = useCallback(async () => {
    // Avoid mutating state while auth is still resolving.
    if (currentUser === undefined) {
      return;
    }

    // Clear immediately if unauthenticated.
    if (currentUser === null) {
      setBilling(null);
      setStatus("ready");
      return;
    }

    setStatus("loading");

    try {
      const result = await fetchBillingStatus();
      setBilling(result ?? null);
    } catch (error) {
      console.error("Failed to load billing status", error);
      setBilling(null);
    } finally {
      setStatus("ready");
    }
  }, [currentUser, fetchBillingStatus]);

  useEffect(() => {
    // Wait for auth to resolve; useQuery returns undefined while loading.
    if (currentUser === undefined) {
      setStatus("loading");
      return;
    }

    let cancelled = false;
    const load = async () => {
      if (cancelled) return;
      await refresh();
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [currentUser, refresh]);

  const value = useMemo<BillingContextValue>(() => {
    const isPremium = Boolean(billing?.isPremium);
    const isLifetime = Boolean(billing?.isLifetime);

    return {
      data: billing,
      status,
      isPremium,
      isLifetime,
      refresh,
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
