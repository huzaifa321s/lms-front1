import { createFileRoute } from '@tanstack/react-router'
import Otp from '@/features/auth/otp'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/otp',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <Otp disabled={true}/>
}
