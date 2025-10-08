import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundError({disabled}) {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
   <main
      className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6"
      role="main"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <section className="max-w-md text-center">
        <h1
          id="error-title"
          className="text-[7rem] font-extrabold leading-none text-red-600 animate-pulse select-none"
          aria-live="assertive"
        >
          404
        </h1>
        <p className="text-xl font-semibold mb-2 text-gray-800">Oops! Page Not Found!</p>
        <p
          id="error-description"
          className="text-gray-600 mb-6"
        >
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p> <div className="flex justify-center gap-4">
          <Button
            disabled={disabled}
            variant="outline"
            onClick={() => window.history.back()}
            size="sm"
            aria-label="Go back to previous page"
          >
            Go Back
          </Button>
          <Button
            disabled={disabled}
            onClick={() => navigate('/')}
            size="sm"
            aria-label="Go back to home page"
          >
            Back to Home
          </Button>
        </div>
      </section>
    </main>
  )
}
