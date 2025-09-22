import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import GeneralError from '../../../student/features/errors/general-error'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/server-error'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header>Internal Server Error</Header>
      <GeneralError disabled={true} />
    </>
  )
}
