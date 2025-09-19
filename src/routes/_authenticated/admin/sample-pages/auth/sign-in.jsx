import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '../../../../admin/login'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/sign-in',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage disabled={true}/>
}
