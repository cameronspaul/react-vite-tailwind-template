# PostHog Analytics Integration

This template includes [PostHog](https://posthog.com) for product analytics, feature flags, session recordings, and A/B testing.

## Setup

### 1. Create a PostHog Account

1. Go to [PostHog](https://posthog.com) and create a free account
2. Create a new project
3. Copy your **Project API Key** from Project Settings

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# PostHog Analytics
VITE_POSTHOG_KEY=phc_your_project_api_key_here
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

> **Note:** Use `https://eu.i.posthog.com` if your PostHog project is hosted in the EU.

### 3. That's It!

PostHog is automatically initialized in `main.tsx` when the environment variables are configured. If the variables are not set or are set to placeholder values, PostHog will gracefully skip initialization.

---

## Features Enabled by Default

- **Autocapture**: Automatically captures clicks, form submissions, and page views
- **Pageview tracking**: Automatic page view events on navigation
- **Page leave tracking**: Captures time spent on pages
- **Session recording**: Records user sessions (can be disabled via PostHog dashboard)
- **Do Not Track**: Respects browser DNT settings

---

## Usage

### Using the Custom Analytics Hook

The template provides a `usePostHogAnalytics` hook that automatically identifies users and provides helper methods:

```tsx
import { usePostHogAnalytics } from '@/hooks/usePostHogAnalytics'

function MyComponent() {
  const { capture, setPersonProperties } = usePostHogAnalytics()

  const handlePurchase = () => {
    capture('purchase_completed', {
      product_id: 'prod_123',
      amount: 99.99,
      currency: 'USD'
    })
  }

  return <button onClick={handlePurchase}>Buy Now</button>
}
```

### Available Methods

| Method | Description |
|--------|-------------|
| `capture(event, properties?)` | Track a custom event |
| `identify(userId, properties?)` | Manually identify a user (auto-done on login) |
| `reset()` | Reset user identity (auto-done on logout) |
| `setPersonProperties(properties)` | Set persistent user properties |
| `register(properties)` | Set properties sent with every event |
| `isFeatureEnabled(flagKey)` | Check if a feature flag is enabled |
| `getFeatureFlag(flagKey)` | Get feature flag variant key |
| `getFeatureFlagPayload(flagKey)` | Get feature flag payload |
| `optOut()` | Opt user out of tracking |
| `optIn()` | Opt user back into tracking |
| `hasOptedOut()` | Check if user has opted out |

### Auto User Identification

The hook automatically:
- **Identifies users** when they log in (using their Convex user ID, email, and name)
- **Resets identity** when users log out

No manual identification is needed for authenticated users.

---

## Feature Flags

### Using Hooks

```tsx
import { useFeatureFlagEnabled, useFeatureFlagVariantKey } from '@/hooks/usePostHogAnalytics'

function MyComponent() {
  // Boolean flag
  const showNewFeature = useFeatureFlagEnabled('new-feature')

  // Multivariate flag
  const variant = useFeatureFlagVariantKey('pricing-experiment')

  if (showNewFeature) {
    return <NewFeature />
  }

  return <OldFeature />
}
```

### Using the Hook Methods

```tsx
import { usePostHogAnalytics } from '@/hooks/usePostHogAnalytics'

function MyComponent() {
  const { isFeatureEnabled, getFeatureFlag } = usePostHogAnalytics()

  if (isFeatureEnabled('beta-feature')) {
    // Show beta feature
  }

  const pricingVariant = getFeatureFlag('pricing-test')
  // 'control', 'variant-a', or 'variant-b'
}
```

---

## Custom Events

Track important user actions:

```tsx
import { usePostHogAnalytics } from '@/hooks/usePostHogAnalytics'

function PricingPage() {
  const { capture } = usePostHogAnalytics()

  const handlePlanSelect = (planName: string) => {
    capture('plan_selected', {
      plan: planName,
      source: 'pricing_page'
    })
  }

  const handleCheckoutStart = () => {
    capture('checkout_started', {
      timestamp: new Date().toISOString()
    })
  }
}
```

### Events Tracked in This Template

The following events are automatically tracked throughout the application:

| Event | Location | Properties |
|-------|----------|------------|
| `sign_in_clicked` | Header, Auth component | `provider`, `location` |
| `sign_out_clicked` | Header, Auth component | `location` |
| `theme_toggled` | Header | `from`, `to` |
| `settings_clicked` | Header dropdown | `location` |
| `customer_portal_clicked` | Header dropdown | `location` |
| `cta_clicked` | Home page | `button`, `location` |
| `credits_used` | Home page demo | `amount`, `current_balance` |
| `checkout_started` | Pricing page | `product_id`, `product_name`, `price`, `location` |
| `checkout_error` | Pricing page | `product_id`, `error` |
| `credits_checkout_started` | Credits page | `bundle_id`, `bundle_name`, `credits`, `price`, `current_balance` |
| `credits_checkout_error` | Credits page | `bundle_id`, `error` |
| `account_delete_clicked` | Settings page | - |
| `account_delete_confirmed` | Settings page | - |
| `account_deleted` | Settings page | - |
| `account_delete_error` | Settings page | `error` |

---

## Privacy & Consent

### Opt-Out Functionality

Allow users to opt out of tracking:

```tsx
import { usePostHogAnalytics } from '@/hooks/usePostHogAnalytics'

function PrivacySettings() {
  const { optOut, optIn, hasOptedOut } = usePostHogAnalytics()
  const isOptedOut = hasOptedOut()

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={!isOptedOut}
          onChange={(e) => e.target.checked ? optIn() : optOut()}
        />
        Allow analytics tracking
      </label>
    </div>
  )
}
```

### Excluding Elements from Autocapture

Add `ph-no-capture` class to exclude elements:

```tsx
<button className="ph-no-capture">
  This click won't be tracked
</button>
```

---

## Debug Mode

In development (`npm run dev`), PostHog automatically enables debug mode, which logs all events to the browser console. This helps you verify tracking is working correctly.

---

## Configuration Options

The PostHog initialization in `main.tsx` includes these options:

```typescript
posthog.init(posthogKey, {
  api_host: posthogHost,
  capture_pageview: true,        // Auto-track page views
  capture_pageleave: true,       // Track time on page
  disable_session_recording: false, // Enable session replay
  respect_dnt: true,             // Respect Do Not Track
  persistence: 'localStorage+cookie', // How to persist user ID
})
```

You can modify these in `src/main.tsx` based on your needs.

---

## Useful Links

- [PostHog Documentation](https://posthog.com/docs)
- [React SDK Reference](https://posthog.com/docs/libraries/react)
- [Feature Flags Guide](https://posthog.com/docs/feature-flags)
- [Session Recording](https://posthog.com/docs/session-replay)
- [A/B Testing](https://posthog.com/docs/experiments)
