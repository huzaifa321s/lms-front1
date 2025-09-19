import { createFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/student copy/sign-up',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SignUp disabled={true}/>
  )
}
