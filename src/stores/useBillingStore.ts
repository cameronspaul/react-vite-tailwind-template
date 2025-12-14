import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BillingData {
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

interface BillingState {
    // Cached billing data (persisted to localStorage)
    cachedBilling: BillingData | null;

    // Whether we've ever fetched (to know if cache is stale)
    hasHydrated: boolean;

    // Whether a background refresh is in progress
    isRefreshing: boolean;

    // Actions
    setBilling: (data: BillingData | null) => void;
    setRefreshing: (isRefreshing: boolean) => void;
    clear: () => void;
}

export const useBillingStore = create<BillingState>()(
    persist(
        (set) => ({
            cachedBilling: null,
            hasHydrated: false,
            isRefreshing: false,

            setBilling: (data) => set({ cachedBilling: data, hasHydrated: true }),
            setRefreshing: (isRefreshing) => set({ isRefreshing }),
            clear: () => set({ cachedBilling: null, hasHydrated: false }),
        }),
        {
            name: 'billing-cache',
            // Only persist these fields
            partialize: (state) => ({
                cachedBilling: state.cachedBilling,
                hasHydrated: state.hasHydrated,
            }),
        },
    ),
)
