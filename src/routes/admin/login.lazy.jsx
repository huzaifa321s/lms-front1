import { lazy, Suspense } from 'react'
import { Outlet, redirect, createLazyFileRoute } from '@tanstack/react-router'
import { SmallLoader } from '@/components/ui/loader'
import { getCookie } from '../../shared/utils/helperFunction'
import { Skeleton } from "@/components/ui/skeleton"

const LoginForm = lazy(() => import('./-components/admin-login-form'))

export const Route = createLazyFileRoute('/admin/login')({
  beforeLoad: () => {
    const token = getCookie('adminToken')
    const credentials = getCookie('adminCredentials')
    if (token && credentials) {
      throw redirect({ to: '/admin' })
    } else {
      return <Outlet />
    }
  },
  component: LoginPage,
})

export default function LoginPage({ disabled }) {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full'>
        <Suspense fallback={<Skeleton className="h-full w-full mx-20 rounded-2xl" />}>
          <LoginForm disabled={disabled} />
        </Suspense>
      </div>
    </div>
  )
}
