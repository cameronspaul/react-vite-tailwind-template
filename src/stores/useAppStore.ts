import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Cached user data
interface CachedUser {
  _id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

// Cached billing data
interface CachedBilling {
  isPremium: boolean
  isLifetime: boolean
  hasSubscription?: boolean
  subscription?: { product?: { name?: string | null; isRecurring?: boolean } } | null
}

interface AppState {
  // Theme
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void

  // User cache
  user: CachedUser | null
  setUser: (data: CachedUser | null) => void

  // Billing cache
  billing: CachedBilling | null
  setBilling: (data: CachedBilling | null) => void

  // State flags
  hydrated: boolean
  refreshing: boolean
  setRefreshing: (v: boolean) => void

  // Clear all cached data
  clear: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),

      // User cache
      user: null,
      setUser: (user) => set({ user, hydrated: true }),

      // Billing cache
      billing: null,
      setBilling: (billing) => set({ billing, hydrated: true }),

      // State flags
      hydrated: false,
      refreshing: false,
      setRefreshing: (refreshing) => set({ refreshing }),

      // Clear all cached data
      clear: () => set({ user: null, billing: null, hydrated: false }),
    }),
    {
      name: 'app-store',
      partialize: ({ theme, user, billing, hydrated }) => ({ theme, user, billing, hydrated }),
    }
  )
)

// Re-export types for convenience
export type { CachedUser, CachedBilling }
