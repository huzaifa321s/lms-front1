import { createFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/student/sign-up',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
       <Header>
        Register
       </Header>
    <SignUp disabled={true}/>
    </>
  )
}
