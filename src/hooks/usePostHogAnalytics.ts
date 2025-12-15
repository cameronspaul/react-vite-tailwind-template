import { useEffect, useRef } from 'react'
import { usePostHog } from '@posthog/react'
import { useConvexAuth } from 'convex/react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

/**
 * Custom hook for PostHog analytics with automatic user identification.
 * 
 * This hook automatically identifies users when they log in and resets
 * the identity when they log out. It also provides helper methods for
 * common analytics actions.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { capture, identify, reset } = usePostHogAnalytics()
 *   
 *   const handleButtonClick = () => {
 *     capture('button_clicked', { button_name: 'submit' })
 *   }
 *   
 *   return <button onClick={handleButtonClick}>Submit</button>
 * }
 * ```
 */
export function usePostHogAnalytics() {
    const posthog = usePostHog()
    const { isAuthenticated, isLoading } = useConvexAuth()
    const user = useQuery(api.users.getCurrentUser)
    const identifiedUserIdRef = useRef<string | null>(null)

    // Auto-identify user when authenticated
    useEffect(() => {
        if (!posthog || isLoading) return

        if (isAuthenticated && user?._id) {
            // Only identify if we haven't already identified this user
            if (identifiedUserIdRef.current !== user._id) {
                posthog.identify(user._id, {
                    email: user.email,
                    name: user.name,
                    created_at: user._creationTime,
                })
                identifiedUserIdRef.current = user._id
            }
        } else if (!isAuthenticated && identifiedUserIdRef.current) {
            // Reset when user logs out
            posthog.reset()
            identifiedUserIdRef.current = null
        }
    }, [posthog, isAuthenticated, isLoading, user])

    /**
     * Capture a custom event
     * @param eventName - Name of the event
     * @param properties - Optional properties to include with the event
     */
    const capture = (eventName: string, properties?: Record<string, unknown>) => {
        posthog?.capture(eventName, properties)
    }

    /**
     * Manually identify a user (typically not needed as this is handled automatically)
     * @param userId - The unique user ID
     * @param properties - Optional properties to associate with the user
     */
    const identify = (userId: string, properties?: Record<string, unknown>) => {
        posthog?.identify(userId, properties)
    }

    /**
     * Reset the current user's identity (used on logout)
     */
    const reset = () => {
        posthog?.reset()
        identifiedUserIdRef.current = null
    }

    /**
     * Set properties on the current user that persist across sessions
     * @param properties - Properties to set
     */
    const setPersonProperties = (properties: Record<string, unknown>) => {
        posthog?.setPersonProperties(properties)
    }

    /**
     * Set properties on the current user that are sent with every event
     * @param properties - Properties to register
     */
    const register = (properties: Record<string, unknown>) => {
        posthog?.register(properties)
    }

    /**
     * Check if a feature flag is enabled
     * @param flagKey - The feature flag key
     * @returns boolean indicating if the flag is enabled
     */
    const isFeatureEnabled = (flagKey: string): boolean => {
        return posthog?.isFeatureEnabled(flagKey) ?? false
    }

    /**
     * Get the variant key for a multivariate feature flag
     * @param flagKey - The feature flag key
     * @returns The variant key or undefined
     */
    const getFeatureFlag = (flagKey: string): string | boolean | undefined => {
        return posthog?.getFeatureFlag(flagKey)
    }

    /**
     * Get the payload for a feature flag
     * @param flagKey - The feature flag key
     * @returns The payload or undefined
     */
    const getFeatureFlagPayload = (flagKey: string): unknown => {
        return posthog?.getFeatureFlagPayload(flagKey)
    }

    /**
     * Opt the user out of tracking
     */
    const optOut = () => {
        posthog?.opt_out_capturing()
    }

    /**
     * Opt the user back into tracking
     */
    const optIn = () => {
        posthog?.opt_in_capturing()
    }

    /**
     * Check if the user has opted out of tracking
     * @returns boolean indicating if the user has opted out
     */
    const hasOptedOut = (): boolean => {
        return posthog?.has_opted_out_capturing() ?? false
    }

    return {
        posthog,
        capture,
        identify,
        reset,
        setPersonProperties,
        register,
        isFeatureEnabled,
        getFeatureFlag,
        getFeatureFlagPayload,
        optOut,
        optIn,
        hasOptedOut,
    }
}

// Re-export PostHog hooks for convenience
export {
    useFeatureFlagEnabled,
    useFeatureFlagVariantKey,
    useFeatureFlagPayload,
    useActiveFeatureFlags
} from '@posthog/react'
