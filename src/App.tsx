import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/TemplateHome'
import { useAppStore } from './stores/useAppStore'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ProductList } from './pages/TemplatePricing'
import { BillingProvider } from './hooks/useBillingStatus'
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

function App() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <BrowserRouter>
      <BillingProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<ProductList />} />
              <Route path="/payment/success" element={<ProductList />} />
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
            </Routes>
          </main>
          <Footer />
        </div>
      </BillingProvider>
    </BrowserRouter>
  )
}

export default App
