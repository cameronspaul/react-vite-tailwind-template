import { Component, type ReactNode } from 'react'
import { Button } from './ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({ errorInfo })

        // You could log to an error reporting service here
        // e.g., Sentry, LogRocket, etc.
    }

    handleReload = () => {
        window.location.reload()
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        {/* Error Icon */}
                        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-destructive" />
                        </div>

                        {/* Error Message */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
                            <p className="text-muted-foreground">
                                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
                            </p>
                        </div>

                        {/* Error Details (only in development) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-muted/50 rounded-lg p-4 text-left">
                                <p className="text-sm font-mono text-destructive break-all">
                                    {this.state.error.message}
                                </p>
                                {this.state.errorInfo?.componentStack && (
                                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={this.handleReload} variant="default" className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Refresh Page
                            </Button>
                            <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                                <Home className="w-4 h-4" />
                                Go to Home
                            </Button>
                        </div>

                        {/* Try Again Button */}
                        <Button onClick={this.handleReset} variant="ghost" size="sm" className="text-muted-foreground">
                            Try again without refreshing
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// Hook-based wrapper for functional components to throw errors
export function useErrorHandler() {
    return (error: Error) => {
        throw error
    }
}

export default ErrorBoundary
