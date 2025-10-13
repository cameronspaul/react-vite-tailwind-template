import { useForm } from 'react-hook-form'
import { Send, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface FormData {
  name: string
  email: string
  message: string
}

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    // Here you could integrate with TanStack Query for API submission
    toast.success('Message sent successfully!')
    reset()
  }

return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card rounded-lg p-6 shadow-lg max-w-md mx-auto border border-border"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5" />
        Contact Us
      </h3>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          id="name"
className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Your name"
        />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          type="email"
          id="email"
className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          Message
        </label>
        <textarea
          {...register('message', { required: 'Message is required' })}
          id="message"
          rows={4}
className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Your message"
        />
        {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <Send className="h-4 w-4" />
        Send Message
      </button>
    </form>
  )
}

export default ContactForm