import { createFileRoute, redirect } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import store from '../../../../shared/config/store/store'

export const Route = createFileRoute('/_authenticated/student/_subscribed')({
  beforeLoad: async () => {
    const state = store.getState()
    const subscription = state.studentAuth.subscription

    // ❌ Missing subscription → redirect to resubscription plan
    if (!subscription || !subscription.subscriptionId) {
      throw redirect({
        to: '/student/resubscription-plans',
      })
    }

    // ⏳ Pending subscription → go to activation page
    if (subscription.status === 'pending') {
      throw redirect({
        to: '/student/activate-subscription',
      })
    }

    // 💀 Failed payments → failed-subscription page
    if (
      ['incomplete', 'incomplete_expired', 'past_due', 'unpaid'].includes(
        subscription.status
      )
    ) {
      throw redirect({
        to: '/student/failed-subscription',
      })
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet /> // safe to render now
}
