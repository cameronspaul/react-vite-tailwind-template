import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import { Home } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

function Form() {
  return (
    <>
      <Helmet>
        <title>Form - React Vite Tailwind Template</title>
        <meta name="description" content="Contact form page with React Hook Form validation." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md">
        <ContactForm />
        <div className="flex justify-center mt-6">
          <Link
            to="/"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default Form