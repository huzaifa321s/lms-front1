import { createFileRoute } from '@tanstack/react-router'
import UnauthorisedError from '@/features/errors/unauthorized-error'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/unauthorized',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
   <UnauthorisedError disabled={true}/>
  )
}
