import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Cached user data
interface CachedUser {
    _id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

// Cached billing data
interface CachedBilling {
    isPremium: boolean;
    isLifetime: boolean;
    hasSubscription?: boolean;
    subscription?: { product?: { name?: string | null; isRecurring?: boolean } } | null;
}

interface CacheState {
    user: CachedUser | null;
    billing: CachedBilling | null;
    hydrated: boolean;
    refreshing: boolean;

    setUser: (data: CachedUser | null) => void;
    setBilling: (data: CachedBilling | null) => void;
    setRefreshing: (v: boolean) => void;
    clear: () => void;
}

export const useCacheStore = create<CacheState>()(
    persist(
        (set) => ({
            user: null,
            billing: null,
            hydrated: false,
            refreshing: false,

            setUser: (user) => set({ user, hydrated: true }),
            setBilling: (billing) => set({ billing, hydrated: true }),
            setRefreshing: (refreshing) => set({ refreshing }),
            clear: () => set({ user: null, billing: null, hydrated: false }),
        }),
        {
            name: 'app-cache',
            partialize: ({ user, billing, hydrated }) => ({ user, billing, hydrated }),
        }
    )
)
