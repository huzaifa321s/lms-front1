import { createFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/teacher-sign-up'

export const Route = createFileRoute('/teacher/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <SignUp/>
    </>
  )
}