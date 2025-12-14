import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFound() {
    return (
        <>
            <SEO
                title="Page Not Found"
                description="The page you're looking for doesn't exist or has been moved."
                noIndex={true}
            />

            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/60 to-primary/30 leading-none select-none animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-[150px] sm:text-[200px] font-black text-primary/5 blur-3xl leading-none select-none">
                        404
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3 mb-8 max-w-md">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Oops! The page you're looking for doesn't exist or has been moved to a different location.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-12">
                    <Button asChild size="lg" className="gap-2">
                        <Link to="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
                        <button type="button" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="border-t border-border pt-8 w-full max-w-lg">
                    <p className="text-sm text-muted-foreground mb-4">Here are some helpful links:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/pricing"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            <Search className="w-3 h-3" />
                            Pricing
                        </Link>
                        <Link
                            to="/faq"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            <HelpCircle className="w-3 h-3" />
                            FAQ
                        </Link>
                        <Link
                            to="/contact"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            Contact Us
                        </Link>
                        <Link
                            to="/help-support"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            Help & Support
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
