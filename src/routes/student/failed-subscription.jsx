import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/failed-subscription')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/failed-subscription"!</div>
}
