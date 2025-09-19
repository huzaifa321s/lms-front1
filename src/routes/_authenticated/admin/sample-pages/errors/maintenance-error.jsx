import { createFileRoute } from '@tanstack/react-router'
import MaintenanceError from '@/features/errors/maintenance-error'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/maintenance-error',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MaintenanceError disabled={true}/>
  )
}
