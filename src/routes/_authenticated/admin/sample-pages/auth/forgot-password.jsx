import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '../../../../student/forgot-password'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/forgot-password',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <Header>
      Forgot Password
    </Header>
    
    <ForgotPassword disabled={true}/>
    </>
  )
}
