import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/TemplateHome'
import { useAppStore } from './stores/useAppStore'
import { Header } from './components/Header'
import { ProductList } from './pages/Pricing'

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
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<ProductList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
