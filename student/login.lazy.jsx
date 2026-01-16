import { lazy, Suspense } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { SmallLoader } from '@/components/ui/loader'
import { Skeleton } from '@/components/ui/skeleton'

const LoginForm = lazy(() => import('./-components/student-login-form'))

export const Route = createLazyFileRoute('/student/login')({
  component: () => (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full'>
        <Suspense fallback={<SmallLoader />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  ),
})
