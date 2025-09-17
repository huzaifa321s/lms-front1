import { createFileRoute } from '@tanstack/react-router'
import ForbiddenError from '@/features/errors/forbidden'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/forbidden',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForbiddenError disabled={true}/>
}
