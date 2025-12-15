import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { AlertTriangle, Info, CheckCircle, HelpCircle, Trash2, LogOut } from 'lucide-react'
import { Spinner } from './LoadingStates'

// ============================================================================
// Types
// ============================================================================

type DialogVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

interface ConfirmDialogOptions {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: DialogVariant
    icon?: ReactNode
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
}

interface AlertDialogOptions {
    title: string
    description?: string
    buttonText?: string
    variant?: DialogVariant
    icon?: ReactNode
    onClose?: () => void
}

interface DialogContextValue {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>
    alert: (options: AlertDialogOptions) => Promise<void>
    close: () => void
}

// ============================================================================
// Context
// ============================================================================

const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialog() {
    const context = useContext(DialogContext)
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider')
    }
    return context
}

// ============================================================================
// Helper Components
// ============================================================================

const variantStyles: Record<DialogVariant, { iconClass: string; buttonVariant: 'default' | 'destructive' | 'outline' }> = {
    default: { iconClass: 'text-primary', buttonVariant: 'default' },
    destructive: { iconClass: 'text-destructive', buttonVariant: 'destructive' },
    success: { iconClass: 'text-green-500', buttonVariant: 'default' },
    warning: { iconClass: 'text-yellow-500', buttonVariant: 'default' },
    info: { iconClass: 'text-blue-500', buttonVariant: 'default' },
}

const defaultIcons: Record<DialogVariant, ReactNode> = {
    default: <HelpCircle className="w-6 h-6" />,
    destructive: <AlertTriangle className="w-6 h-6" />,
    success: <CheckCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
}

// ============================================================================
// Provider Component
// ============================================================================

interface DialogState {
    type: 'confirm' | 'alert' | null
    options: ConfirmDialogOptions | AlertDialogOptions | null
    resolve: ((value: boolean) => void) | ((value: void) => void) | null
}

export function DialogProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DialogState>({ type: null, options: null, resolve: null })
    const [isLoading, setIsLoading] = useState(false)

    const close = useCallback(() => {
        setState({ type: null, options: null, resolve: null })
        setIsLoading(false)
    }, [])

    const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({ type: 'confirm', options, resolve: resolve as (value: boolean) => void })
        })
    }, [])

    const alert = useCallback((options: AlertDialogOptions): Promise<void> => {
        return new Promise((resolve) => {
            setState({ type: 'alert', options, resolve: resolve as (value: void) => void })
        })
    }, [])

    const handleConfirm = async () => {
        const options = state.options as ConfirmDialogOptions
        const resolve = state.resolve as (value: boolean) => void

        if (options?.onConfirm) {
            setIsLoading(true)
            try {
                await options.onConfirm()
            } catch (error) {
                console.error('Dialog confirm error:', error)
                setIsLoading(false)
                return
            }
        }

        resolve?.(true)
        close()
    }

    const handleCancel = () => {
        const options = state.options as ConfirmDialogOptions
        const resolve = state.resolve as (value: boolean) => void

        options?.onCancel?.()
        resolve?.(false)
        close()
    }

    const handleAlertClose = () => {
        const options = state.options as AlertDialogOptions
        const resolve = state.resolve as (value: void) => void

        options?.onClose?.()
        resolve?.()
        close()
    }

    const variant = state.options?.variant ?? 'default'
    const styles = variantStyles[variant]
    const icon = state.options?.icon ?? defaultIcons[variant]

    return (
        <DialogContext.Provider value={{ confirm, alert, close }}>
            {children}

            {/* Confirm Dialog */}
            <Dialog open={state.type === 'confirm'} onOpenChange={(open) => !open && handleCancel()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-start gap-4">
                            {icon && (
                                <div className={`flex-shrink-0 ${styles.iconClass}`}>
                                    {icon}
                                </div>
                            )}
                            <div className="flex-1">
                                <DialogTitle>{(state.options as ConfirmDialogOptions)?.title}</DialogTitle>
                                {state.options?.description && (
                                    <DialogDescription className="mt-2">
                                        {state.options.description}
                                    </DialogDescription>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {(state.options as ConfirmDialogOptions)?.cancelText ?? 'Cancel'}
                        </Button>
                        <Button
                            variant={styles.buttonVariant}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading && <Spinner size="sm" className="mr-2" />}
                            {(state.options as ConfirmDialogOptions)?.confirmText ?? 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog */}
            <Dialog open={state.type === 'alert'} onOpenChange={(open) => !open && handleAlertClose()}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <div className="flex items-start gap-4">
                            {icon && (
                                <div className={`flex-shrink-0 ${styles.iconClass}`}>
                                    {icon}
                                </div>
                            )}
                            <div className="flex-1">
                                <DialogTitle>{(state.options as AlertDialogOptions)?.title}</DialogTitle>
                                {state.options?.description && (
                                    <DialogDescription className="mt-2">
                                        {state.options.description}
                                    </DialogDescription>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleAlertClose}>
                            {(state.options as AlertDialogOptions)?.buttonText ?? 'OK'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DialogContext.Provider>
    )
}

// ============================================================================
// Pre-built Dialog Helpers
// ============================================================================

/**
 * Common confirmation dialog presets
 */
export const ConfirmDialogs = {
    /**
     * Delete confirmation dialog
     */
    delete: (options: { itemName?: string; onConfirm?: () => void | Promise<void> }): ConfirmDialogOptions => ({
        title: 'Delete Item',
        description: options.itemName
            ? `Are you sure you want to delete "${options.itemName}"? This action cannot be undone.`
            : 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
        icon: <Trash2 className="w-6 h-6" />,
        onConfirm: options.onConfirm,
    }),

    /**
     * Sign out confirmation dialog
     */
    signOut: (options: { onConfirm?: () => void | Promise<void> }): ConfirmDialogOptions => ({
        title: 'Sign Out',
        description: 'Are you sure you want to sign out of your account?',
        confirmText: 'Sign Out',
        cancelText: 'Cancel',
        variant: 'default',
        icon: <LogOut className="w-6 h-6" />,
        onConfirm: options.onConfirm,
    }),

    /**
     * Unsaved changes confirmation dialog
     */
    unsavedChanges: (options: { onConfirm?: () => void | Promise<void> }): ConfirmDialogOptions => ({
        title: 'Unsaved Changes',
        description: 'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
        confirmText: 'Leave',
        cancelText: 'Stay',
        variant: 'warning',
        onConfirm: options.onConfirm,
    }),

    /**
     * Cancel subscription confirmation dialog
     */
    cancelSubscription: (options: { onConfirm?: () => void | Promise<void> }): ConfirmDialogOptions => ({
        title: 'Cancel Subscription',
        description: 'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
        confirmText: 'Cancel Subscription',
        cancelText: 'Keep Subscription',
        variant: 'destructive',
        onConfirm: options.onConfirm,
    }),
}

/**
 * Common alert dialog presets
 */
export const AlertDialogs = {
    /**
     * Success alert
     */
    success: (options: { title?: string; description: string; onClose?: () => void }): AlertDialogOptions => ({
        title: options.title ?? 'Success',
        description: options.description,
        buttonText: 'OK',
        variant: 'success',
    }),

    /**
     * Error alert
     */
    error: (options: { title?: string; description: string; onClose?: () => void }): AlertDialogOptions => ({
        title: options.title ?? 'Error',
        description: options.description,
        buttonText: 'OK',
        variant: 'destructive',
    }),

    /**
     * Info alert
     */
    info: (options: { title?: string; description: string; onClose?: () => void }): AlertDialogOptions => ({
        title: options.title ?? 'Information',
        description: options.description,
        buttonText: 'OK',
        variant: 'info',
    }),
}

// ============================================================================
// Standalone Dialog Component (for custom modals)
// ============================================================================

interface ModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: ReactNode
    footer?: ReactNode
    className?: string
}

/**
 * Standalone Modal component for custom dialog content
 */
export function Modal({ open, onOpenChange, title, description, children, footer, className }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="py-4">{children}</div>
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}

export default DialogProvider
