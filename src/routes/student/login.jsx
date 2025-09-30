import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from './-components/student-login-form'


export const Route = createFileRoute('/student/login')({
 component: () => (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  ),
})


