import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundError({disabled}) {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Oops! Page Not Found!</span>
        <p className='text-muted-foreground text-center'>
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button disabled={disabled} variant='outline' onClick={() => history.go(-1)} size="sm">
            Go Back
          </Button>
          <Button disabled={disabled} onClick={() => navigate({ to: '/' })} size="sm">Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
