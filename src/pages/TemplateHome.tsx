import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import tailwindLogo from '/tailwind.svg'
import convexLogo from '/convex.svg'
import polarshLogo from '/polarsh.svg'
import shadcnLogo from '/shadcn-ui.svg'
import { PremiumGate } from '../components/PremiumGate'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  ArrowRight,
  Code2,
  Database,
  Layout,
  Lock,
  Zap,
  CreditCard,
  Coins,
  Minus,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import { PageSEO } from '../components/SEO'
import { usePostHogAnalytics } from '../hooks/usePostHogAnalytics'
import { useDialog, ConfirmDialogs, AlertDialogs } from '../components/Modal'
import { MessageSquare } from 'lucide-react'

function Home() {
  const { capture } = usePostHogAnalytics()

  return (
    <div className="flex flex-col min-h-screen">
      <PageSEO.Home />
      {/* Hero Section */}
      <section className="relative py-10 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full">
            Hopefully this is the one
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Build faster with the <br className="hidden md:block" />
            ultimate React stack
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A production-ready template featuring Vite, React, Tailwind, Shadcn UI, Convex, and Polar integration.
            Stop setting up, start building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all"
              asChild
              onClick={() => capture('cta_clicked', { button: 'get_started', location: 'hero' })}
            >
              <a href="https://github.com/cameronspaul/react-vite-tailwind-template" target="_blank" rel="noopener noreferrer">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
              onClick={() => capture('cta_clicked', { button: 'view_pricing', location: 'hero' })}
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tech Stack Strip */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="container px-4 mx-auto">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Powered by modern technologies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <a href="https://vite.dev" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={viteLogo} className="h-8 md:h-10 w-auto" alt="Vite" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={reactLogo} className="h-8 md:h-10 w-auto animate-spin-slow" alt="React" />
            </a>
            <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={tailwindLogo} className="h-8 md:h-10 w-auto" alt="Tailwind" />
            </a>
            <a href="https://www.convex.dev/" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={convexLogo} className="h-8 md:h-10 w-auto" alt="Convex" />
            </a>
            <a href="https://polar.sh/" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={polarshLogo} className="h-8 md:h-10 w-auto" alt="Polar" />
            </a>
            <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={shadcnLogo} className="h-8 md:h-10 w-auto" alt="Shadcn UI" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've pre-configured the best tools so you can focus on building your product's unique value.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 hover:bg-card transition-colors border-muted">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built on Vite for instant server starts and lightning-fast HMR.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 hover:bg-card transition-colors border-muted">
            <CardHeader>
              <Layout className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Beautiful UI</CardTitle>
              <CardDescription>
                Shadcn UI components styled with Tailwind CSS for premium aesthetics.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 hover:bg-card transition-colors border-muted">
            <CardHeader>
              <Database className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Real-time Backend</CardTitle>
              <CardDescription>
                Convex provides a type-safe, reactive backend as a service.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 hover:bg-card transition-colors border-muted">
            <CardHeader>
              <CreditCard className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Monetization Ready</CardTitle>
              <CardDescription>
                Seamless integration with Polar.sh for subscriptions and one-time sales.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 hover:bg-card transition-colors border-muted">
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Secure authentication handled by Convex Auth with easy provider setup.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 hover:bg-card transition-colors border-muted">
            <CardHeader>
              <Code2 className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Type Safe</CardTitle>
              <CardDescription>
                Full TypeScript support end-to-end for a robust development experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Premium Gate Demo */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Premium Features</h2>
            <p className="text-muted-foreground">
              This template includes a built-in premium gating component. Try it out below.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />
            <PremiumGate
              fallback={
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <Lock className="h-12 w-12 text-muted-foreground/50" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-xl">Premium Content Locked</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        This content is only visible to active subscribers or lifetime members.
                      </p>
                    </div>
                    <Button variant="default" asChild>
                      <Link to="/pricing">Unlock Access</Link>
                    </Button>
                  </CardContent>
                </Card>
              }
            >
              <Card className="border-primary/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Premium Content Unlocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Congratulations! You have verified premium access to this application.
                    This component automatically checks your Polar entitlement status.
                  </p>
                  <div className="p-4 bg-primary/10 rounded-lg text-sm text-primary font-medium">
                    This is where your exclusive premium features would go.
                  </div>
                </CardContent>
              </Card>
            </PremiumGate>
          </div>
        </div>
      </section>

      {/* Credits Demo Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Credits System Demo</h2>
            <p className="text-muted-foreground">
              This template includes a built-in credits system. Try using credits below.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-3xl -z-10" />
            <CreditsDemo />
          </div>
        </div>
      </section>

      {/* Dialog System Demo */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Dialog System Demo</h2>
            <p className="text-muted-foreground">
              This template includes a robust dialog system managed by context. Try the examples below.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl -z-10" />
            <DialogDemo />
          </div>
        </div>
      </section>


    </div>
  )
}

function CreditsDemo() {
  const balance = useQuery(api.credits.getBalance);
  const useCredits = useMutation(api.credits.useCredits);
  const { capture } = usePostHogAnalytics();
  const [isUsing, setIsUsing] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleUseCredits = async () => {
    capture('credits_used', { amount: 10, current_balance: balance });
    setIsUsing(true);
    setLastResult(null);
    try {
      const result = await useCredits({ amount: 10 });
      setLastResult({
        success: true,
        message: `Successfully used 10 credits! Remaining: ${result.remainingBalance}`
      });
    } catch (error) {
      setLastResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to use credits'
      });
    } finally {
      setIsUsing(false);
    }
  };

  // Not logged in
  if (balance === null) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <Coins className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">Sign In Required</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Sign in to view your credit balance and use credits.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (balance === undefined) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-500" />
          Your Credit Balance
        </CardTitle>
        <CardDescription>
          Use credits to access special features throughout the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="flex items-center justify-center">
          <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl">
            <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
            <p className="text-5xl font-bold text-amber-500">{balance}</p>
          </div>
        </div>

        {/* Use Credits Button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleUseCredits}
            disabled={isUsing || balance < 10}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            size="lg"
          >
            {isUsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Using Credits...
              </>
            ) : (
              <>
                <Minus className="mr-2 h-4 w-4" />
                Use 10 Credits
              </>
            )}
          </Button>

          {balance < 10 && balance > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              You need at least 10 credits to use this feature.
            </p>
          )}

          {balance === 0 && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You don't have any credits yet.
              </p>
              <Button
                variant="outline"
                asChild
                onClick={() => capture('cta_clicked', { button: 'buy_credits', location: 'credits_demo' })}
              >
                <Link to="/credits">Buy Credits</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Result Message */}
        {lastResult && (
          <div className={`p-4 rounded-lg text-center text-sm font-medium ${lastResult.success
            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
            : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
            {lastResult.message}
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          This is a demo. In a real app, using credits would unlock features or actions.
        </p>
      </CardContent>
    </Card>
  );
}

function DialogDemo() {
  const dialog = useDialog()

  const handleConfirm = async () => {
    await dialog.confirm({
      title: 'Custom Confirmation',
      description: 'This is a custom confirmation dialog. Do you want to proceed?',
      confirmText: 'Yes, Proceed',
      cancelText: 'No, Cancel',
      variant: 'default',
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
    })
  }

  const handleDelete = async () => {
    await dialog.confirm(ConfirmDialogs.delete({
      itemName: 'Example Project',
      onConfirm: async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }))
  }

  const handleSuccessAlert = async () => {
    await dialog.alert(AlertDialogs.success({
      title: 'Operation Successful',
      description: 'Your changes have been saved successfully.'
    }))
  }

  const handleErrorAlert = async () => {
    await dialog.alert(AlertDialogs.error({
      description: 'An unexpected error occurred. Please try again later.'
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Interactive Dialogs
        </CardTitle>
        <CardDescription>
          Click the buttons below to trigger different types of dialogs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={handleConfirm} variant="outline" className="w-full">
            Custom Confirm
          </Button>
          <Button onClick={handleDelete} variant="destructive" className="w-full">
            Delete Item (Async)
          </Button>
          <Button onClick={handleSuccessAlert} className="w-full bg-green-600 hover:bg-green-700">
            Success Alert
          </Button>
          <Button onClick={handleErrorAlert} variant="secondary" className="w-full">
            Error Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Home
