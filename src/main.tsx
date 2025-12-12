import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './components/ui/sonner'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import App from './App.tsx'

const queryClient = new QueryClient()
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConvexAuthProvider client={convex}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-center" />
      </ConvexAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
