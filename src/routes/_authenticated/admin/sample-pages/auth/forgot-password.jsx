import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '../../../../student/forgot-password'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/forgot-password',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ForgotPassword disabled={true}/>
  )
}
