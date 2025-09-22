import { createFileRoute } from '@tanstack/react-router'
import UnauthorisedError from '@/features/errors/unauthorized-error'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/unauthorized',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <Header>
      Unauthorized 
    </Header>
   <UnauthorisedError disabled={true}/>
    </>
  )
}
