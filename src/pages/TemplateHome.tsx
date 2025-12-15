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
  Layout,
  Lock,
  Zap,
  CreditCard,
  Coins,
  Minus,
  Loader2,
  FileText,
  BarChart3,
  Mail,
  Shield,
  Palette,
  MessageSquare,
  Bell,
  Search,
  Globe,
  MonitorSmartphone,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import { PageSEO } from '../components/SEO'
import { usePostHogAnalytics } from '../hooks/usePostHogAnalytics'
import { useDialog, ConfirmDialogs, AlertDialogs } from '../components/Modal'
import { toast } from 'sonner'

function Home() {
  const { capture } = usePostHogAnalytics()

  const techStack = [
    { name: 'React 19', logo: reactLogo, url: 'https://react.dev', animate: true },
    { name: 'Vite 7', logo: viteLogo, url: 'https://vite.dev' },
    { name: 'Tailwind v4', logo: tailwindLogo, url: 'https://tailwindcss.com/' },
    { name: 'Shadcn UI', logo: shadcnLogo, url: 'https://ui.shadcn.com/' },
    { name: 'Convex', logo: convexLogo, url: 'https://www.convex.dev/' },
    { name: 'Polar.sh', logo: polarshLogo, url: 'https://polar.sh/' },
  ]

  const coreFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Vite 7 with instant HMR for rapid development cycles.',
      color: 'text-yellow-500',
    },
    {
      icon: Lock,
      title: 'OAuth Authentication',
      description: 'Google & GitHub OAuth via Convex Auth, ready to use.',
      color: 'text-green-500',
    },
    {
      icon: CreditCard,
      title: 'Subscription Payments',
      description: 'Polar.sh integration for subscriptions & one-time purchases.',
      color: 'text-blue-500',
    },
    {
      icon: Coins,
      title: 'Credits System',
      description: 'Built-in usage-based credits for metered features.',
      color: 'text-amber-500',
    },
    {
      icon: Mail,
      title: 'Transactional Emails',
      description: 'Beautiful HTML email templates via Resend.',
      color: 'text-pink-500',
    },
    {
      icon: Palette,
      title: 'Dark/Light Theme',
      description: 'System preference detection with manual toggle.',
      color: 'text-purple-500',
    },
  ]

  const uiFeatures = [
    {
      icon: Layout,
      title: 'Shadcn UI Components',
      description: 'Beautiful, accessible components built on Radix primitives.',
    },
    {
      icon: MonitorSmartphone,
      title: 'Fully Responsive',
      description: 'Mobile-first design that looks great on all devices.',
    },
    {
      icon: RefreshCw,
      title: 'Loading States',
      description: 'Skeleton loaders and spinners for smooth UX.',
    },
    {
      icon: Shield,
      title: 'Error Boundaries',
      description: 'Graceful error handling with fallback UI.',
    },
    {
      icon: MessageSquare,
      title: 'Feedback Widget',
      description: 'Collect user feedback directly in your app.',
    },
    {
      icon: Bell,
      title: 'Toast Notifications',
      description: 'Sonner-powered notifications for user actions.',
    },
  ]

  const analyticsFeatures = [
    {
      icon: BarChart3,
      title: 'PostHog Analytics',
      description: 'Product analytics, feature flags, session recordings, and A/B testing.',
    },
    {
      icon: Globe,
      title: 'Google Analytics 4',
      description: 'Track page views and user behavior with GA4.',
    },
    {
      icon: Search,
      title: 'SEO Optimized',
      description: 'Meta tags, Open Graph, JSON-LD structured data.',
    },
    {
      icon: FileText,
      title: 'Sitemap & Robots.txt',
      description: 'Auto-generated for search engine crawling.',
    },
  ]

  const securityFeatures = [
    { icon: Shield, title: 'Rate Limiting', description: 'Protect APIs from abuse.' },
    { icon: Lock, title: 'Premium Gating', description: 'Lock features behind subscriptions.' },
    { icon: CheckCircle2, title: 'Form Validation', description: 'Zod + React Hook Form integration.' },
  ]

  const contentPages = [
    'About Us', 'Contact', 'FAQ', 'Help & Support',
    'Privacy Policy', 'Terms of Service', 'Refund Policy',
    'Cancellation Policy', 'Cookie Policy', 'Community Guidelines',
    'Safety & Security', 'Report & Block'
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <PageSEO.Home />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full">
            <Sparkles className="w-3 h-3 mr-1" />
            SaaS Boilerplate Template
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Feature Showcase
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            Explore all the features included in this production-ready SaaS boilerplate.
            Everything below is <strong>live and functional</strong> — try the interactive demos!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all"
              asChild
              onClick={() => capture('cta_clicked', { button: 'view_github', location: 'hero' })}
            >
              <a href="https://github.com/cameronspaul/react-vite-tailwind-template" target="_blank" rel="noopener noreferrer">
                View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
              onClick={() => capture('cta_clicked', { button: 'view_docs', location: 'hero' })}
            >
              <a href="#features">Explore Features <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="container px-4 mx-auto">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Built with Modern Technologies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity group"
              >
                <img
                  src={tech.logo}
                  className={`h-10 md:h-12 w-auto ${tech.animate ? 'animate-spin-slow' : ''}`}
                  alt={tech.name}
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {tech.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 container px-4 mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Core Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need to Launch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pre-configured essentials so you can focus on building your product's unique value.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feature) => (
            <Card key={feature.title} className="bg-card/50 border-muted">
              <CardHeader>
                <feature.icon className={`h-8 w-8 ${feature.color} mb-4`} />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* UI/UX Features */}
      <section className="py-24 bg-muted/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">UI/UX</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Beautiful User Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Polished components and thoughtful interactions out of the box.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uiFeatures.map((feature) => (
              <Card key={feature.title} className="bg-card/50 hover:bg-card transition-colors border-muted">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & SEO */}
      <section className="py-24 container px-4 mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Analytics & SEO</Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Track & Optimize</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built-in analytics and SEO optimization to grow your product.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsFeatures.map((feature) => (
            <Card key={feature.title} className="bg-card/50 hover:bg-card transition-colors border-muted text-center">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-4 mx-auto" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-muted/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Security</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built-in Protection</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {securityFeatures.map((feature) => (
              <Card key={feature.title} className="bg-card/50 w-full sm:w-72">
                <CardHeader className="flex flex-row items-center gap-4">
                  <feature.icon className="h-6 w-6 text-green-500" />
                  <div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-xs">{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Pages */}
      <section className="py-24 container px-4 mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Content Pages</Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready-to-Use Pages</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pre-built legal and informational pages to get you compliant quickly.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {contentPages.map((page) => (
            <Badge key={page} variant="secondary" className="px-4 py-2 text-sm">
              {page}
            </Badge>
          ))}
        </div>
      </section>

      {/* Interactive Demos Header */}
      <section className="py-8 bg-muted/30 border-y border-border/50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Interactive Demos Below
          </h2>
          <p className="text-muted-foreground mt-2">
            Try out the live features — these are fully functional!
          </p>
        </div>
      </section>

      {/* Premium Gate Demo */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Live Demo</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Premium Gating</h2>
            <p className="text-muted-foreground">
              The PremiumGate component checks your subscription status in real-time.
            </p>
          </div>

          <div className="relative">
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
            <Badge variant="outline" className="mb-4">Live Demo</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Credits System</h2>
            <p className="text-muted-foreground">
              Built-in usage-based credits for metered features. Try using credits below.
            </p>
          </div>

          <div className="relative">
            <CreditsDemo />
          </div>
        </div>
      </section>

      {/* Dialog System Demo */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Live Demo</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Dialog System</h2>
            <p className="text-muted-foreground">
              Context-managed dialogs for confirmations, alerts, and custom modals.
            </p>
          </div>

          <div className="relative">
            <DialogDemo />
          </div>
        </div>
      </section>

      {/* Toast Demo */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Live Demo</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Toast Notifications</h2>
            <p className="text-muted-foreground">
              Sonner-powered toast notifications for user feedback.
            </p>
          </div>
          <ToastDemo />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Build?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Clone this template and start building your SaaS product today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="https://github.com/cameronspaul/react-vite-tailwind-template" target="_blank" rel="noopener noreferrer">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">View Pricing Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/credits">View Credits Demo</Link>
            </Button>
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

  const handleUseCredits = async () => {
    capture('credits_used', { amount: 10, current_balance: balance });
    setIsUsing(true);
    try {
      const result = await useCredits({ amount: 10 });
      toast.success("Credits Used Successfully!", {
        description: `Used 10 credits. Remaining: ${result.remainingBalance}`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      // Check for rate limit error
      if (errorMsg.includes('Slow down') || errorMsg.includes('Too many requests')) {
        toast.warning('Slow down!', {
          description: 'Please wait a moment before using more credits.',
          duration: 5000,
        });
      } else {
        toast.error("Failed to Use Credits", {
          description: errorMsg,
        });
      }
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
              >
                <Link to="/credits">Buy Credits</Link>
              </Button>
            </div>
          )}
        </div>

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

function ToastDemo() {
  const handleSuccess = () => {
    toast.success('Success!', {
      description: 'Your action completed successfully.',
    })
  }

  const handleError = () => {
    toast.error('Error!', {
      description: 'Something went wrong. Please try again.',
    })
  }

  const handleWarning = () => {
    toast.warning('Warning!', {
      description: 'Please review before proceeding.',
    })
  }

  const handleInfo = () => {
    toast.info('Information', {
      description: 'Here is some helpful information.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Toast Notifications
        </CardTitle>
        <CardDescription>
          Click the buttons to trigger different toast styles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button onClick={handleSuccess} className="bg-green-600 hover:bg-green-700">
            Success
          </Button>
          <Button onClick={handleError} variant="destructive">
            Error
          </Button>
          <Button onClick={handleWarning} className="bg-yellow-600 hover:bg-yellow-700">
            Warning
          </Button>
          <Button onClick={handleInfo} variant="secondary">
            Info
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Home
