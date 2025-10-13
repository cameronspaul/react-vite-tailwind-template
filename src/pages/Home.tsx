import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import tailwindLogo from '/tailwind.svg'
import { Link } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'
import { Sun, Moon, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'

function Home() {
  const { count, increment, decrement, theme, toggleTheme } = useAppStore()

  return (
    <>
      <Helmet>
        <title>Home - React Vite Tailwind Template</title>
        <meta name="description" content="Welcome to the home page of our React application with Vite and Tailwind CSS." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            const newTheme = theme === 'light' ? 'dark' : 'light'
            toggleTheme()
            toast.success(`Switched to ${newTheme} mode`)
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted px-3 py-2 text-sm transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-16 w-16 animate-spin hover:animate-none" alt="React logo" />
        </a>
        <a href="https://tailwindcss.com/" target="_blank">
          <img src={tailwindLogo} className="h-16 w-16 hover:scale-110 transition-transform" alt="Tailwind logo" />
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
            <div className="text-foreground">Theme Toggle</div>
            <div className="text-foreground">Comprehensive .gitignore</div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg p-8 shadow-lg flex flex-col items-center border border-border">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold">Count is {count}</span>
          <button
            onClick={decrement}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors w-11"
          >
            -
          </button>
          <button
            onClick={increment}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors w-11"
          >
            +
          </button>
        </div>
        <p className="mt-4 text-center text-muted-foreground">
          Edit <code className="bg-muted px-2 py-1 rounded text-sm font-mono border border-border">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Link
        to="/form"
        className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Go to Form
      </Link>
      <p className="mt-8 text-center text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>
      <p className="mt-1 font-mono text-sm text-center text-muted-foreground">
        Updated on 10/10/2025
      </p>
    </div>
    </>
  )
}

export default Home