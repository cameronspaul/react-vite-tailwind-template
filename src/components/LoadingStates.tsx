import { Skeleton } from './ui/skeleton'

/**
 * Full-page loading spinner with animated logo
 */
export function PageLoader() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <div className="relative">
                {/* Spinning ring */}
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                </div>
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
        </div>
    )
}

/**
 * Inline spinner for buttons or small areas
 */
export function Spinner({ size = 'default', className = '' }: { size?: 'sm' | 'default' | 'lg', className?: string }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        default: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
    }

    return (
        <div
            className={`${sizeClasses[size]} border-current/20 border-t-current rounded-full animate-spin ${className}`}
            aria-label="Loading"
        />
    )
}

/**
 * Card skeleton for pricing cards, product cards, etc.
 */
export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-20" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

/**
 * Grid of card skeletons
 */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    )
}

/**
 * User profile/avatar skeleton
 */
export function AvatarSkeleton({ showName = true }: { showName?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            {showName && (
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            )}
        </div>
    )
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 py-3 border-b border-border">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </div>
    )
}

/**
 * Table skeleton with header and rows
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
    return (
        <div className="rounded-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-muted/50 flex items-center gap-4 px-4 py-3">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            <div className="px-4">
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={columns} />
                ))}
            </div>
        </div>
    )
}

/**
 * Content block skeleton (for articles, descriptions, etc.)
 */
export function ContentSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}

/**
 * Stats/metrics skeleton
 */
export function StatsSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                </div>
            ))}
        </div>
    )
}

/**
 * Navigation/header skeleton
 */
export function HeaderSkeleton() {
    return (
        <div className="flex items-center justify-between py-4 px-6 border-b border-border">
            <div className="flex items-center gap-6">
                <Skeleton className="h-6 w-32" />
                <div className="hidden sm:flex gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </div>
    )
}

/**
 * Settings form skeleton
 */
export function FormSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
        </div>
    )
}

/**
 * Suspense-compatible loading boundary
 * Wrap async components for consistent loading states
 */
export function LoadingBoundary({ children, fallback: _fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
    // Note: This is a placeholder for React Suspense integration
    // In a full implementation, you'd use React.Suspense with the fallback
    // For now, it passes through children. To use with Suspense:
    // return <React.Suspense fallback={fallback ?? <PageLoader />}>{children}</React.Suspense>
    return (
        <>{children}</>
    )
}

export default PageLoader
