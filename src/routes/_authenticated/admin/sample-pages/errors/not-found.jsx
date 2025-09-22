import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import NotFoundError from '../../../student/features/errors/not-found-error'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/errors/not-found'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header>Not Found</Header>
      <NotFoundError disabled={true} />
    </>
  )
}
