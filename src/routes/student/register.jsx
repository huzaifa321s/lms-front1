import { createFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'

export const Route = createFileRoute('/student/register')({
  component: RouteComponent,
})

 function RouteComponent() {
  return (
    <>
    <SignUp/>
    </>
  )
}