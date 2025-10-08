import { createLazyFileRoute } from '@tanstack/react-router'

import { LoginForm } from './-components/teacher-login-form'
export const Route = createLazyFileRoute('/teacher/login')({
  component: LoginPage,
})





export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  )
}
