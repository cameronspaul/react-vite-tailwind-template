# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Vite development server with hot module replacement
- `npm run build` - Build production application (runs TypeScript compilation then Vite build)
- `npm run preview` - Preview production build locally

### No Testing/Linting Setup
This template does not include testing frameworks or linters by default. Add these as needed for your project.

## Architecture Overview

### Tech Stack
- **React 19** with **TypeScript** for type-safe component development
- **Vite** as build tool and development server with HMR
- **Tailwind CSS 4** integrated via Vite plugin for styling
- **React Router DOM 7** for client-side routing
- **Zustand** for client-side state management with persistence
- **TanStack Query** for server state management, caching, and data fetching
- **React Hook Form** for form state management and validation
- **React Helmet Async** for dynamic document head management
- **React Hot Toast** for toast notifications
- **Lucide React** for iconography

### State Management Architecture
The application follows a clear separation of state concerns:

1. **Client State (Zustand)** - App-wide UI state, user preferences, theme management
   - Store location: `src/stores/useAppStore.ts`
   - Includes persistence middleware for local storage
   - Manages theme switching with proper DOM attribute updates

2. **Server State (TanStack Query)** - API data, caching, synchronization
   - Configured globally in `src/main.tsx`
   - DevTools enabled for development debugging
   - Use for all API calls and remote data

3. **Form State (React Hook Form)** - Form inputs, validation, submission
   - Example implementation in `src/components/ContactForm.tsx`
   - Integrates with TanStack Query mutations for API submissions

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level page components
├── stores/             # Zustand state stores
├── App.tsx            # Main app with routing and theme setup
├── main.tsx           # Application entry point with providers
└── theme.css          # Tailwind CSS imports and base styles
```

### Key Architectural Patterns

#### Provider Setup (main.tsx)
All app providers are configured in a specific order:
1. `HelmetProvider` for head management
2. `QueryClientProvider` for React Query
3. `Toaster` for global toast notifications

#### Theme System
- Theme state managed in Zustand store with persistence
- Theme updates apply `data-theme` attribute and `dark` class to document root
- Uses Tailwind's `@custom-variant` for theme-aware styling

#### Routing
- Uses React Router DOM with `BrowserRouter`
- Routes defined in `src/App.tsx`
- Current routes: `/` (Home) and `/form` (Form page)

#### Form Handling
- React Hook Form for form state and validation
- Integration pattern with TanStack Query mutations for API calls
- Toast notifications for user feedback

### Styling System
- Uses Tailwind CSS 4 with Vite plugin (no separate config file)
- Theme-aware color system with CSS custom properties
- Consistent design tokens: `background`, `foreground`, `primary`, `muted`, `border`, etc.
- Responsive design with mobile-first approach

### Development Notes
- Component examples include theme toggle, counter, and contact form
- All pages include proper SEO meta tags via React Helmet
- Toast notifications configured globally for consistent UX
- DevTools available for React Query debugging during development