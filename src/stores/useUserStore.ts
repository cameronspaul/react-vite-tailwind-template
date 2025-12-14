import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CachedUserData {
    _id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface UserState {
    // Cached user data (persisted to localStorage)
    cachedUser: CachedUserData | null;

    // Whether we've ever fetched
    hasHydrated: boolean;

    // Actions
    setUser: (data: CachedUserData | null) => void;
    clear: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            cachedUser: null,
            hasHydrated: false,

            setUser: (data) => set({ cachedUser: data, hasHydrated: true }),
            clear: () => set({ cachedUser: null, hasHydrated: false }),
        }),
        {
            name: 'user-cache',
            partialize: (state) => ({
                cachedUser: state.cachedUser,
                hasHydrated: state.hasHydrated,
            }),
        },
    ),
)
