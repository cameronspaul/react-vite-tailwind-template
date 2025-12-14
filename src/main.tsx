import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './components/ui/sonner'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
import { DialogProvider } from './components/Modal.tsx'
import App from './App.tsx'

const queryClient = new QueryClient()
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

// Initialize PostHog if environment variables are configured
const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

if (posthogKey && posthogKey !== 'your_posthog_project_api_key') {
  posthog.init(posthogKey, {
    api_host: posthogHost || 'https://us.i.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.debug()
      }
    },
    // Capture pageviews automatically
    capture_pageview: true,
    // Capture page leaves (time on page)
    capture_pageleave: true,
    // Disable in development if you want (set to true to enable)
    disable_session_recording: false,
    // Respect Do Not Track browser setting
    respect_dnt: true,
    // Persistence options
    persistence: 'localStorage+cookie',
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <ConvexAuthProvider client={convex}>
          <DialogProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster position="top-center" />
          </DialogProvider>
        </ConvexAuthProvider>
      </QueryClientProvider>
    </PostHogProvider>
  </StrictMode>,
)

