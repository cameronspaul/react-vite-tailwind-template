# react-vite-tailwind-template

A modern, production-ready React template with authentication, real-time data, and comprehensive tooling. This template combines the best of React's ecosystem with Convex's backend-as-a-service for rapid application development.

## ✨ Features

- **🚀 Modern React Stack** - React 19 with TypeScript, Vite, and Tailwind CSS v4
- **🔐 Authentication Ready** - OAuth integration with GitHub and Google via Convex Auth
- **📊 Real-time Database** - Convex backend with auto-generated type-safe API
- **🎨 Beautiful UI** - Dark/light theme with semantic design tokens
- **⚡ Fast Development** - Hot module replacement and optimized build pipeline
- **📱 Responsive Design** - Mobile-first approach with Tailwind utilities
- **🔧 Developer Experience** - Strict TypeScript, comprehensive tooling, and clear conventions

## 🚀 Quick Start

Get your application running in minutes:

```bash
# Clone the repository
git clone <repository-url>
cd react-vite-tailwind-template

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Convex and OAuth credentials

# Start Convex backend (in a separate terminal)
npx convex dev

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to see your application running!

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Auth.tsx        # Authentication components
│   │   └── Header.tsx      # Main header with theme toggle
│   ├── pages/              # Route-level page components
│   │   └── TemplateHome.tsx # Home page
│   ├── stores/             # State management
│   │   └── useAppStore.ts  # Zustand store for app state
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── theme.css           # CSS theme variables
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema definition
│   ├── auth.config.ts      # Authentication configuration
│   ├── auth.ts             # Authentication logic
│   ├── users.ts            # User-related functions
│   └── _generated/         # Auto-generated types and API
├── public/                 # Static assets
└── config files            # TypeScript, Vite, and Tailwind configs
```

## 🏗️ Architecture Overview

### Provider Stack

The application uses a layered provider architecture in [`main.tsx`](src/main.tsx):

```tsx
<StrictMode>
  <HelmetProvider>
    <QueryClientProvider>
      <ConvexAuthProvider>
        <Toaster />
        <App />
      </ConvexAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
</StrictMode>
```

### Key Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Project** | react-vite-tailwind-template | 0.0.0 | Project name and version |
| **Frontend** | React | 19.1.1 | UI library |
| | React DOM | 19.1.1 | React DOM renderer |
| | TypeScript | 5.9.3 | Type safety |
| | Vite | 7.1.7 | Build tool & dev server |
| | Tailwind CSS | 4.1.14 | Styling framework |
| | @tailwindcss/vite | 4.1.14 | Tailwind Vite integration |
| | React Router DOM | 7.9.4 | Client-side routing |
| | React Helmet Async | 2.0.5 | Head management |
| | Lucide React | 0.545.0 | Icon library |
| | React Hook Form | 7.64.0 | Form handling |
| | React Hot Toast | 2.6.0 | Toast notifications |
| **State Management** | Zustand | 5.0.8 | Client state |
| | TanStack Query | 5.90.2 | Server state |
| | TanStack React Query DevTools | 5.90.2 | Query debugging |
| **Backend** | Convex | 1.28.2 | Backend-as-a-Service |
| | @convex-dev/auth | 0.0.90 | Authentication |
| | @auth/core | 0.37.0 | Authentication core |
| **Development** | @types/node | 24.6.0 | Node.js type definitions |
| | @types/react | 19.1.16 | React type definitions |
| | @types/react-dom | 19.1.9 | React DOM type definitions |
| | @vitejs/plugin-react | 5.0.4 | Vite React plugin |

### Theme System

The template includes a comprehensive theming system with:

- **Semantic Design Tokens** - CSS custom properties for consistent styling
- **Dark/Light Mode** - Persistent theme switching with Zustand
- **Responsive Design** - Mobile-first approach with Tailwind utilities

```css
:root {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(240 10% 3.9%);
  --color-primary: hsl(240 5.9% 10%);
}

:root.dark {
  --color-background: hsl(240 10% 3.9%);
  --color-foreground: hsl(0 0% 98%);
  --color-primary: hsl(0 0% 98%);
}
```

## 🔧 Development Guide

### Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Configure required variables:**
   - `CONVEX_DEPLOYMENT` - Production Convex deployment URL
   - `VITE_CONVEX_URL` - Local Convex development URL
   - `GOOGLE_CLIENT_ID/SECRET` - Google OAuth credentials
   - `GITHUB_CLIENT_ID/SECRET` - GitHub OAuth credentials

### Development Commands

```bash
# Start development server
npm run dev

# Build for production (runs TypeScript check then Vite build)
npm run build

# Preview production build
npm run preview

# Start Convex backend (separate terminal)
npx convex dev
```

### Coding Standards

#### Naming Conventions

- **Components/Hooks:** PascalCase (`UserProfile.tsx`, `useUserData.ts`)
- **Files:** PascalCase for components, camelCase for utilities
- **Stores:** End with `Store.ts` (`useAppStore.ts`)
- **Pages:** Follow `<Feature>Page.tsx` pattern

#### Code Style

- **Indentation:** 2 spaces
- **TypeScript:** Strict mode enabled, no implicit `any`
- **Components:** Functional components with hooks
- **Styling:** Tailwind utility classes preferred

#### Component Patterns

**Authentication:**
```tsx
<Authenticated>
  <UserProfileHeader />
</Authenticated>
<Unauthenticated>
  <SignIn />
</Unauthenticated>
```

**Data Fetching:**
```tsx
const currentUser = useQuery(api.users.getCurrentUser);
const { signIn, signOut } = useAuthActions();
```

## 🔐 Authentication

The template includes a complete authentication system with Convex Auth:

### Supported Providers

- **GitHub OAuth** - One-click authentication with GitHub accounts
- **Google OAuth** - Sign in with Google accounts

### Adding New Providers

1. Update [`convex/auth.config.ts`](convex/auth.config.ts) with provider configuration
2. Add environment variables for client ID/secret
3. Configure OAuth app in the provider's developer console

### User Data Structure

Users are stored with the following information:
- Profile image and name
- Email address
- Authentication provider
- Account creation and last login timestamps

## 📊 Database Schema

The Convex schema is defined in [`convex/schema.ts`](convex/schema.ts) and includes:

```typescript
// Authentication tables (auto-generated)
export default defineSchema({
  // Add your custom tables here
  
  // Example:
  // posts: defineTable({
  //   title: v.string(),
  //   content: v.string(),
  //   authorId: v.id("users"),
  //   createdAt: v.number(),
  // })
    .index("by_author", ["authorId"]),
});
```

## 🎨 Styling Guide

### Tailwind CSS v4

The template uses Tailwind CSS v4 with custom design tokens:

```tsx
// Use semantic tokens for consistent theming
<div className="bg-background text-foreground border-border">
  <h1 className="text-2xl font-bold text-primary">
    Hello World
  </h1>
</div>
```

### Theme Implementation

- **CSS Variables:** Defined in [`src/theme.css`](src/theme.css)
- **State Management:** Theme state in [`src/stores/useAppStore.ts`](src/stores/useAppStore.ts)
- **Application:** Applied via `data-theme` attribute and `.dark` class

### Getting Help

- Check the [Convex Documentation](https://docs.convex.dev/)
- Review the [Vite Guide](https://vitejs.dev/guide/)
- Consult the [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 License

This template is provided as-is for educational and commercial use. Please refer to the licenses of individual packages for specific terms.

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Convex**