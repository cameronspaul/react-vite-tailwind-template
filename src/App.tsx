import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/TemplateHome'
import { useAppStore } from './stores/useAppStore'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ProductList } from './pages/TemplatePricing'
import { CreditsPage } from './pages/TemplateCredits'
import { BillingProvider } from './hooks/useBillingStatus'
import Settings from './pages/TemplateSettings'
import AboutUs from './pages/contentpages/AboutUs'
import CancellationPolicy from './pages/contentpages/CancellationPolicy'
import CommunityGuidelines from './pages/contentpages/CommunityGuidelines'
import Contact from './pages/contentpages/Contact'
import CookiePolicy from './pages/contentpages/CookiePolicy'
import FAQ from './pages/contentpages/FAQ'
import HelpSupport from './pages/contentpages/HelpSupport'
import PrivacyPolicy from './pages/contentpages/PrivacyPolicy'
import RefundPolicy from './pages/contentpages/RefundPolicy'
import ReportBlockFunctionality from './pages/contentpages/ReportBlockFunctionality'
import SafetyAndSecurity from './pages/contentpages/SafetyAndSecurity'
import TermsOfService from './pages/contentpages/TermsOfService'
import NotFound from './pages/NotFound'
import { ErrorBoundary } from './components/ErrorBoundary'
import BlogIndex from './pages/blog/BlogIndex'
import BlogPost from './pages/blog/BlogPost'


function AppContent() {
  const theme = useAppStore((s) => s.theme)
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <BillingProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<ProductList />} />
            <Route path="/payment/success" element={<ProductList />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/credits/success" element={<CreditsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/report-block-functionality" element={<ReportBlockFunctionality />} />
            <Route path="/safety-and-security" element={<SafetyAndSecurity />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* 404 catch-all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BillingProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
