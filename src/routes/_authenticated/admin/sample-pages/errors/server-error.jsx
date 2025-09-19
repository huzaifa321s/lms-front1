import { createFileRoute } from '@tanstack/react-router'
import GeneralError from '../../../student/features/errors/general-error'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/server-error',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GeneralError disabled={true}/>
  )
}
