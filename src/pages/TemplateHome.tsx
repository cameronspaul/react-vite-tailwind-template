import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import tailwindLogo from '/tailwind.svg'
import convexLogo from '/convex.svg'
import polarshLogo from '/polarsh.svg'
import { Helmet } from 'react-helmet-async'
import { PremiumGate } from '../components/PremiumGate'

function Home() {
  return (
    <>
      <Helmet>
        <title>Home - React Vite Tailwind Template</title>
        <meta name="description" content="Welcome to the home page of our React application with Vite and Tailwind CSS." />
      </Helmet>
      <div className="bg-background text-foreground flex flex-col items-center py-8">

      <div className="flex space-x-4 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer noopener">
          <img src={viteLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer noopener">
          <img src={reactLogo} className="h-16 w-16 animate-spin hover:animate-none" alt="React logo" />
        </a>
        <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer noopener">
          <img src={tailwindLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Tailwind logo" />
        </a>
        <a href="https://www.convex.dev/" target="_blank" rel="noreferrer noopener">
          <img src={convexLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Convex logo" />
        </a>
        <a href="https://polar.sh/" target="_blank" rel="noreferrer noopener">
          <img src={polarshLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Polarsh logo" />
        </a>
      </div>
      <div className="grid grid-cols-3 items-center gap-5 -mb-12">
        <div></div>
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold mb-8">Vite + React + Tailwind <span className="opacity-80">+</span></h1>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-lg font-medium opacity-80 space-y-1">
            <a href="https://www.npmjs.com/package/react-router-dom" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">React Router DOM</a>
            <a href="https://www.npmjs.com/package/zustand" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">Zustand</a>
            <a href="https://www.npmjs.com/package/@tanstack/react-query" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">TanStack Query</a>
            <a href="https://www.npmjs.com/package/react-helmet-async" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">React Helmet</a>
            <a href="https://www.npmjs.com/package/react-hook-form" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">React Hook Form</a>
            <a href="https://www.npmjs.com/package/lucide-react" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">Lucide React</a>
            <a href="https://www.npmjs.com/package/react-hot-toast" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block">React Hot Toast</a>
            <div className="text-foreground">Convex Auth</div>
            <div className="text-foreground">Convex Database</div>
            <div className="text-foreground">Convex Polar Payment Integration</div>
            <div className="text-foreground">Theme Toggle</div>
            <div className="text-foreground">Comprehensive .gitignore</div>

          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-muted-foreground">
        Click on the logos to learn more
      </p>
      <p className="mt-1 font-mono text-sm text-center text-muted-foreground">
        Updated on 06/11/2025
      </p>
      <div className="mt-10 w-full max-w-2xl">
        <PremiumGate
          fallback={
            <div className="rounded-lg border border-border bg-card p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Premium-only section - sign in and upgrade to unlock.
              </p>
            </div>
          }
        >
          <div className="rounded-lg border border-border bg-card p-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              You have premium access. This gate uses the Polar-backed check everywhere.
            </p>
          </div>
        </PremiumGate>
      </div>
    </div>
    </>
  )
}

export default Home
