# React Vite Tailwind Boilerplate

A modern, full-stack boilerplate for building React applications with Vite, Tailwind CSS, Shadcn UI, Convex backend, and Polar billing integration.

## Features

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React with modern hooks and features
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🧩 **Shadcn UI** - Beautiful, accessible component library
- 🔐 **Authentication** - OAuth integration with Google and GitHub
- 💾 **Backend** - Convex for real-time database and serverless functions
- 💳 **Billing** - Polar integration for subscription management
- 📱 **Responsive** - Mobile-first design with Tailwind
- 🔧 **TypeScript** - Full type safety throughout the application
- 🛠️ **Developer Experience** - Hot reload, ESLint, and optimized build

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Shadcn UI (Radix UI components)
- React Router DOM
- React Hook Form with Zod validation
- Zustand for state management
- TanStack Query for data fetching
- Lucide React for icons

### Backend
- Convex - Real-time database and serverless functions
- Convex Auth - Authentication system

### Billing
- Polar.sh - Subscription and payment processing

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd react-vite-tailwind-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev --once
```

4. Copy the environment file and configure it:
```bash
cp .env.example .env
```

## Environment Setup

Configure the following environment variables in your `.env` file:

### Required
- `SITE_URL` - Your application's URL (e.g., `http://localhost:5173` for development)
- `CONVEX_DEPLOYMENT` - Your Convex deployment name
- `VITE_CONVEX_URL` - Your Convex deployment URL

### Authentication (OAuth)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `JWT_PRIVATE_KEY` - Private key for JWT signing
- `JWKS` - JSON Web Key Set for JWT verification

### Billing (Polar)
- `POLAR_ORGANIZATION_TOKEN` - Your Polar organization token
- `POLAR_WEBHOOK_SECRET` - Polar webhook secret
- `POLAR_SERVER` - Environment (`sandbox` or `production`)
- `POLAR_SUCCESS_URL` - Success URL after payment
- `VITE_CHECKOUT_LINK_*` - Checkout links for different subscription tiers

### Email (Resend)
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Verified sender email (e.g., `Your App <noreply@yourdomain.com>`)

#### Setting Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from [resend.com/api-keys](https://resend.com/api-keys)
3. **Important**: Add and verify your domain at [resend.com/domains](https://resend.com/domains) to avoid emails going to spam
4. Set the environment variables in Convex:
   ```bash
   npx convex env set RESEND_API_KEY re_your_api_key_here
   npx convex env set RESEND_FROM_EMAIL "Your App <noreply@yourdomain.com>"
   ```

> ⚠️ **Note**: Without a verified domain, emails will be sent from `onboarding@resend.dev` and may go to spam folders.

## Running the Application

### Development
```bash
npm run dev
```

This will start the Vite development server at `http://localhost:5173`.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
├── convex/                 # Convex backend functions and configuration
│   ├── _generated/         # Auto-generated Convex types
│   ├── auth.config.ts      # Authentication configuration
│   ├── auth.ts             # Authentication logic
│   ├── http.ts             # HTTP endpoints
│   ├── polar.ts            # Polar billing integration
│   ├── schema.ts           # Database schema
│   ├── users.ts            # User-related functions
│   └── convex.config.ts    # Convex configuration
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Auth.tsx        # Authentication component
│   │   ├── Header.tsx      # Header component
│   │   ├── PremiumGate.tsx # Premium feature gate
│   │   └── PriceCard.tsx   # Pricing card component
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── stores/             # Zustand stores
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── .env.example            # Environment variables template
├── components.json         # Shadcn UI configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Convex Commands

- `npx convex dev` - Start Convex development server
- `npx convex deploy` - Deploy Convex functions
- `npx convex dashboard` - Open Convex dashboard

## 🔐 Authentication

The template includes a complete authentication system with Convex Auth:

### Supported Providers

- **GitHub OAuth** - One-click authentication with GitHub accounts
- **Google OAuth** - Sign in with Google accounts

### Setting Up OAuth Providers

Follow these steps to configure OAuth providers for your application:

#### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Click "Create Credentials" and select "OAuth 2.0 Client IDs"
4. Configure the following settings:
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `https://<your-convex-deployment>.convex.site/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your environment variables

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Click "New OAuth App"
3. Configure the following settings:
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `https://<your-convex-deployment>.convex.site/api/auth/callback/github`
4. After creating the app, click "Generate a new client secret"
5. Copy the Client ID and Client Secret to your environment variables

### Premium Feature Gating

After authentication, the template provides premium feature gating through the Polar integration:

- **Billing Status Tracking**: Monitor active subscriptions and lifetime purchases
- **Premium Access Control**: Restrict features based on subscription status
- **Customer Portal**: Allow users to manage subscriptions and payment methods

The billing system is implemented in [`convex/polar.ts`](convex/polar.ts) and provides:
- User authentication and customer mapping
- Subscription management with automatic cancellation for lifetime purchases
- Billing status tracking through [`useBillingStatus`](src/hooks/useBillingStatus.tsx) hook
- Customer portal access for subscription management

Products are configured in [`src/components/staticProducts.ts`](src/components/staticProducts.ts) with multiple pricing tiers:
- Weekly ($9.99/week), Monthly ($29.99/month), Quarterly ($79.99/quarter)
- Semiannual ($149.99/6 months), Lifetime ($59.00 one-time)

### Data Storage Philosophy

This template follows a **minimal local storage approach** for payment and customer data:

- **Polar as Single Source of Truth**: All subscription, payment, and customer data is retrieved directly from Polar's API when needed
- **No Local Duplication**: Purchase history, subscription details, and customer information are not stored in the Convex database
- **Real-time Validation**: Billing status is always fetched fresh from Polar via the [`getBillingStatus`](convex/polar.ts:104) function
- **Webhook Integration**: Polar webhooks in [`convex/http.ts`](convex/http.ts:9) handle real-time events without storing data locally

Note: The client uses browser localStorage to cache billing status briefly for smooth UI rendering. This is purely a UX optimization - the source of truth is always Polar, validated in the background on every page load.

#### Benefits of This Approach

1. **Simplified Architecture**: No data synchronization complexity between Convex and Polar
2. **Data Consistency**: Eliminates potential conflicts between local and remote data
3. **Security Compliance**: Sensitive payment data remains with Polar, reducing compliance burden
4. **Maintenance Simplicity**: Fewer database schemas and migration requirements
5. **Real-time Accuracy**: Always serves the most current subscription status
