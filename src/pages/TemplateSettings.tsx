import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Authenticated, Unauthenticated } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useBillingStatus } from '@/hooks/useBillingStatus';
import { SignIn } from '@/components/Auth';
import { PageSEO } from '@/components/SEO';
import { usePostHogAnalytics } from '@/hooks/usePostHogAnalytics';
import { FeedbackWidget } from '@/components/FeedbackWidget';

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-sm text-foreground font-medium break-all">
                {value || <span className="text-muted-foreground italic">Not provided</span>}
            </span>
        </div>
    );
}

function SettingsContent() {
    const navigate = useNavigate();
    const { signOut } = useAuthActions();
    const currentUser = useQuery(api.users.getCurrentUser);
    const deleteUserMutation = useMutation(api.users.deleteUser);
    const { isPremium, isLifetime, data: billingData } = useBillingStatus();
    const { capture } = usePostHogAnalytics();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        capture('account_delete_confirmed');
        setIsDeleting(true);
        try {
            await deleteUserMutation();
            await signOut();
            capture('account_deleted');
            toast.success('Your account has been deleted successfully.');
            navigate('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
            capture('account_delete_error', { error: String(error) });
            toast.error('Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    // Loading state
    if (currentUser === undefined) {
        return (
            <div className="container mx-auto max-w-3xl py-12 px-4">
                <div className="space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const creationDate = currentUser?.creationDate
        ? new Date(currentUser.creationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    const getInitials = (name: string | undefined) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Card */}
                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Profile Information</CardTitle>
                        <CardDescription>
                            Your account details from your authentication provider
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-border">
                                <AvatarImage src={currentUser?.image || undefined} alt={currentUser?.name || 'User'} />
                                <AvatarFallback className="text-lg bg-muted">
                                    {getInitials(currentUser?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{currentUser?.name || 'User'}</h3>
                                <div className="flex gap-2">
                                    {isPremium && (
                                        <Badge variant="secondary" className="text-xs">
                                            Premium
                                        </Badge>
                                    )}
                                    {isLifetime && (
                                        <Badge variant="outline" className="text-xs">
                                            Lifetime
                                        </Badge>
                                    )}
                                    {currentUser?.provider && (
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {currentUser.provider}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* User Info */}
                        <div className="divide-y divide-border">
                            <InfoItem label="Email" value={currentUser?.email} />
                            <InfoItem label="Name" value={currentUser?.name} />
                            <InfoItem label="Auth Provider" value={currentUser?.provider} />
                            <InfoItem label="Member Since" value={creationDate} />
                            {billingData?.subscription?.product?.name && (
                                <InfoItem label="Subscription" value={billingData.subscription.product.name} />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Feedback Widget */}
                <FeedbackWidget />

                {/* Danger Zone */}
                <Card className="border-destructive/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions that affect your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                            <div className="space-y-1">
                                <h4 className="font-medium text-foreground">Delete Account</h4>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    capture('account_delete_clicked');
                                    setShowDeleteConfirm(true);
                                }}
                                className="shrink-0"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <Card className="border-destructive shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-destructive">Confirm Account Deletion</CardTitle>
                            <CardDescription>
                                This action is permanent and cannot be reversed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                    Deleting your account will permanently remove all your data.
                                </AlertDescription>
                            </Alert>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>This will:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Remove all your personal information</li>
                                    <li>Delete your authentication credentials</li>
                                    <li>Cancel any active subscriptions</li>
                                    <li>Remove all data associated with your account</li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function Settings() {
    return (
        <>
            <PageSEO.Settings />
            <Authenticated>
                <SettingsContent />
            </Authenticated>
            <Unauthenticated>
                <div className="container mx-auto max-w-md py-12 px-4">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Sign In Required</CardTitle>
                            <CardDescription>
                                Please sign in to access your account settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignIn />
                        </CardContent>
                    </Card>
                </div>
            </Unauthenticated>
        </>
    );
}
