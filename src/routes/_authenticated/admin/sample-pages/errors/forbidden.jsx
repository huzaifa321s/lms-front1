import { createFileRoute } from '@tanstack/react-router'
import ForbiddenError from '@/features/errors/forbidden'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/forbidden',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header>
      Forbidden
      </Header>
     <ForbiddenError disabled={true}/>
    </>
    )
}
