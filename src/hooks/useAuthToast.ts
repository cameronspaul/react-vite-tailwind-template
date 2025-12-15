import { useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

/**
 * Hook that handles authentication-related toast notifications.
 * Shows a welcome toast when user signs in.
 */
export function useAuthToast() {
    const currentUser = useQuery(api.users.getCurrentUser);
    const prevUserRef = useRef<typeof currentUser>(undefined);
    const hasShownWelcome = useRef(false);

    useEffect(() => {
        // Skip if still loading
        if (currentUser === undefined) return;

        const prevUser = prevUserRef.current;
        prevUserRef.current = currentUser;

        // Check if user just signed in (was null/undefined, now has user)
        if (prevUser === null && currentUser !== null && !hasShownWelcome.current) {
            hasShownWelcome.current = true;
            const displayName = currentUser.name || currentUser.email || 'there';
            toast.success(`Welcome back, ${displayName}!`, {
                description: 'You have successfully signed in.',
            });
        }

        // Reset the welcome flag when user signs out
        if (currentUser === null) {
            hasShownWelcome.current = false;
        }
    }, [currentUser]);
}
