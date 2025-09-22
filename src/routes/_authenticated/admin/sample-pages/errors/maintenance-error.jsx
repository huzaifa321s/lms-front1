import { createFileRoute } from '@tanstack/react-router'
import MaintenanceError from '@/features/errors/maintenance-error'
import { Header } from '@/components/layout/header'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/maintenance-error',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <Header>
      Maintenenace Error 
    </Header>
    <MaintenanceError disabled={true}/>
    </>
  )
}
