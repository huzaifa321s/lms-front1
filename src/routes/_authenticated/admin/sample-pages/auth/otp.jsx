import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import Otp from '@/features/auth/otp'

export const Route = createFileRoute(
  '/_authenticated/admin/sample-pages/auth/otp'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header>OTP</Header>
      <Otp disabled={true} />
    </>
  )
}
