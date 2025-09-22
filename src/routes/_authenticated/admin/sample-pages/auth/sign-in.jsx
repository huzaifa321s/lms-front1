import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '../../../../admin/login'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/sign-in',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
       <Header>
        Login
       </Header>
     <LoginPage disabled={true}/>
    </>
    )
}
