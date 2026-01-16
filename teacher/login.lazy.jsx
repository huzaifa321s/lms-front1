import { lazy, Suspense } from 'react'
import { redirect, createLazyFileRoute } from '@tanstack/react-router'
import { getCookie } from '../../shared/utils/helperFunction'
import { Skeleton } from '@/components/ui/skeleton'

const LoginForm = lazy(() =>
  import('./-components/teacher-login-form').then((m) => ({ default: m.LoginForm }))
)
export const Route = createLazyFileRoute('/teacher/login')({
  beforeLoad: () => {
    const token = getCookie('teacherToken')
    const credentials = getCookie('teacherCredentials')
    if (token && credentials) {
      throw redirect({ to: '/teacher', replace: true })
    }
  },
  component: LoginPage,
})





export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full">
        <Suspense fallback={<Skeleton className="h-full w-full mx-20 rounded-2xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
