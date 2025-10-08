import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
  disabled?: boolean
  onRetry?: () => void
}

export default function GeneralError({
  className,
  minimal = false,
  disabled = false,
  onRetry,
  ...props
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()

  // Retry handler: calls onRetry if provided, else reloads the page
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn('h-svh w-full', className)}
      {...props}
    >
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
        {!minimal && (
          <h1
            className="text-[7rem] leading-tight font-bold animate-pulse"
            aria-label="Error code 500"
          >
            500
          </h1>
        )}
        <span className="font-medium text-lg">Oops! Something went wrong {`:')`}</span>
        <p className="text-muted-foreground max-w-md">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              disabled={disabled}
              variant="outline"
              onClick={() => history.go(-1)}
              size="sm"
              aria-label="Go back to previous page"
            >
              Go Back
            </Button>
            <Button
              disabled={disabled}
              onClick={() => navigate({ to: '/' })}
              size="sm"
              aria-label="Go back to home page"
            >
              Back to Home <Home/>
            </Button>
            <Button
              disabled={disabled}
              onClick={handleRetry}
              size="sm"
              variant="secondary"
              aria-label="Retry loading the page"
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
