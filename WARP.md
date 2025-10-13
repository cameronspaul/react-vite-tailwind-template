# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project summary
- React 19 + TypeScript app scaffolded for Vite with Tailwind CSS v4 via the official Vite plugin.
- Client-side routing (react-router-dom), global client state via Zustand (with persistence), server state via TanStack Query, form state via React Hook Form, toast notifications via react-hot-toast.

Commands
Prerequisites
- Node.js >= 18
- npm (package-lock.json is present; this repo uses npm)

Setup
- Install dependencies: npm install

Develop
- Start dev server with HMR: npm run dev
  - Vite serves the app (default http://localhost:5173).

Build & Preview
- Production build: npm run build
  - Runs TypeScript project build (tsc -b) then Vite build.
- Preview built app locally: npm run preview

Type checking
- Type-check only (no emit): npx tsc -b

Linting & tests
- No ESLint configuration or test runner is present in this repository.

High-level architecture
Runtime composition
- Entry point: src/main.tsx
  - Creates a TanStack QueryClient and wraps the app in QueryClientProvider.
  - Enables React Query Devtools in development.
  - Mounts a global Toaster for notifications.
- App shell and routing: src/App.tsx
  - BrowserRouter with two routes: "/" → Home, "/form" → Form.
  - Synchronizes the theme to the DOM by toggling the data-theme attribute and the dark class on documentElement.

State management
- Client state: src/stores/useAppStore.ts
  - Zustand store persisted to localStorage (key: "app-store").
  - Stores a simple counter and the theme ("light" | "dark").
- Server state: Configured via TanStack Query (providers in src/main.tsx). No concrete queries exist yet in this template.
- Form state: src/components/ContactForm.tsx uses React Hook Form for validation and submission. Currently logs and shows a success toast; hook points for integrating a useMutation are indicated via comments.

Styling and theming
- Tailwind CSS v4 is integrated through @tailwindcss/vite in vite.config.ts; there is no tailwind.config file in this template.
- src/theme.css
  - Defines CSS custom properties (tokens) for both light and dark themes and imports Tailwind via @import "tailwindcss".
  - Applies semantic utility shim classes (e.g., bg-background, text-foreground, bg-card, border-border, etc.) that map to the token values so components can use simple class names without bespoke CSS.
  - Dark mode is controlled by adding the dark class and/or setting data-theme="dark" on :root; App.tsx toggles both accordingly.

Assets and public files
- Static assets (react.svg, vite.svg, tailwind.svg) live under public/ and are referenced via absolute paths (e.g., "/react.svg").

TypeScript configuration
- tsconfig.json references two projects: tsconfig.app.json (app code) and tsconfig.node.json (Vite config/types).
- tsconfig.app.json enables strict mode, bundler module resolution, and react-jsx; includes only src/.
- tsconfig.node.json targets Vite config typing; both projects use noEmit builds to rely on Vite for output.

Where to make common changes
- Add a route: Edit src/App.tsx (add a <Route>), and create a new page in src/pages/.
- Add global UI/app state: Extend src/stores/useAppStore.ts (persisted by default).
- Add data fetching/mutations: Create hooks with TanStack Query (providers are already set in src/main.tsx).
- Adjust theme or design tokens: Edit src/theme.css; tokens are consumed via utility class shims and Tailwind.

Notes
- Added React Helmet Async to the template for dynamic document head management.
- This template intentionally omits ESLint/Prettier and a test runner. If you introduce them later, add their commands here (e.g., npm run lint, npm run test) and any key configuration pointers.
