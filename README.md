# React + Vite + Tailwind Template

This is a streamlined template for building modern React applications using Vite as the build tool and Tailwind CSS for styling. It combines the power of React's component-based architecture with Vite's fast development experience and Tailwind's utility-first CSS framework to provide a robust foundation for your projects.

## Features

- **React 19**: Latest version of React with modern hooks and concurrent features
- **Vite**: Lightning-fast build tool with hot module replacement
- **Tailwind CSS 4**: Utility-first CSS framework integrated via Vite plugin
- **TypeScript**: Full TypeScript support for type safety
- **ES Modules**: Modern module system for better tree-shaking

- **React Router DOM**: Client-side routing for navigation between pages
- **Zustand**: Lightweight state management for React applications
- **TanStack Query**: Powerful data fetching and caching for API interactions
- **React Helmet Async**: Dynamic document head management for SEO
- **React Hook Form**: Performant form handling with validation
- **Lucide React**: Beautiful and customizable SVG icons
- **React Hot Toast**: Toast notifications for user feedback
- **Theme Toggle**: Dark/light mode switching with Zustand persistence
- **Comprehensive .gitignore**: Includes common ignore patterns for Node.js, React, and Vite projects

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone or download this template
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will start the Vite dev server with hot module replacement.

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
react-vite-tailwind-template/
├── public/
│   ├── react.svg
│   ├── tailwind.svg
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── ContactForm.tsx
│   ├── pages/
│   │   ├── Form.tsx
│   │   └── Home.tsx
│   ├── stores/
│   │   └── useAppStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── theme.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Technologies Used

### Dependencies
- **@tailwindcss/vite**: `^4.1.14` - Tailwind CSS Vite plugin
- **react**: `^19.1.1` - React library
- **react-dom**: `^19.1.1` - React DOM rendering
- **react-hook-form**: `^7.64.0` - Performant form library with validation
- **react-router-dom**: `^7.9.4` - Routing library for React
- **zustand**: `^5.0.8` - Simple state management library
- **@tanstack/react-query**: `^5.90.2` - Data fetching and caching library
- **@tanstack/react-query-devtools**: `^5.90.2` - Developer tools for React Query
- **lucide-react**: `^0.545.0` - Beautiful SVG icons
- **react-helmet-async**: `^2.0.5` - Dynamic document head management
- **react-hot-toast**: `^2.6.0` - Toast notifications

### Dev Dependencies
- **@types/node**: `^24.6.0` - TypeScript types for Node.js
- **@types/react**: `^19.1.16` - TypeScript types for React
- **@types/react-dom**: `^19.1.9` - TypeScript types for React DOM
- **@vitejs/plugin-react**: `^5.0.4` - Vite plugin for React
- **typescript**: `~5.9.3` - TypeScript compiler
- **vite**: `^7.1.7` - Vite build tool

## Customization

### Tailwind Configuration

Tailwind CSS is configured via the `@tailwindcss/vite` plugin in `vite.config.ts`. You can customize your design system by modifying the Tailwind directives in `src/index.css`.

### React Router Configuration

The template includes basic routing setup with React Router DOM. Add new routes in `src/App.tsx` by adding more `<Route>` components inside `<Routes>`. Create new page components in the `src/pages/` directory.

### State Management

The template provides a comprehensive state management setup following best practices:

- **Zustand for Client State**: Use for app-wide state like user preferences, UI states, or any client-side data that doesn't come from APIs. The template includes a basic store (`src/stores/useAppStore.ts`) with theme state and persistence.

- **TanStack Query for Server State**: Handles data fetching, caching, synchronization, and mutations for API interactions. Configured globally in `src/main.tsx` with DevTools for development.

- **React Hook Form for Form State**: Efficiently manages form inputs, validation, and submission. A basic example is in `src/components/ContactForm.tsx`. Integrates with TanStack Query's `useMutation` for API submissions and Zustand for form-related global state.

This separation keeps your codebase clean and efficient—server state (APIs) managed by React Query, client state (UI/app logic) by Zustand, and form state by React Hook Form. For complex workflows, forms can trigger mutations that update query caches and Zustand stores.

### Vite Configuration

Modify `vite.config.ts` to add plugins, configure build options, or set up aliases.
Added Host to allow for local testing

## Contributing

This is a template repository. Feel free to fork and customize it for your own projects.

## License

This template is provided as-is for personal and commercial use.