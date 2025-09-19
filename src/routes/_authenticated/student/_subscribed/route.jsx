import {
  createFileRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { openModal } from '../../../../shared/config/reducers/student/studentDialogSlice'
import store from '../../../../shared/config/store/store'

export const Route = createFileRoute('/_authenticated/student/_subscribed')({
  beforeLoad: ({ location }) => {
    const state = store.getState()
    const subscription = state.studentAuth.subscription

    const subscriptionRoutes = [
      '/student/subscription-plans',
      '/student/resubscription-plans',
      '/student/failed-subscription',
      '/student',
    ]

    if (subscriptionRoutes.includes(location.pathname)) {
      return
    }

    // Missing subscription
    if (!subscription || !subscription?.subscriptionId) {
      store.dispatch(
        openModal({
          type: 'subscription-modal',
          props: { redirect: location.pathname },
        })
      )
      throw redirect({ to: '/student' }) // 👈 prevent route render
    }

    // Pending subscription
    if (subscription?.subscriptionId && subscription.status === 'pending') {
      store.dispatch(
        openModal({
          type: 'activate-subscription-modal',
          props: { redirect: '/student' },
        })
      )
      throw redirect({ to: '/student' }) // 👈 prevent route render
    }

    // Failed states
    if (
      ['incomplete', 'incomplete_expired', 'past_due', 'unpaid'].includes(
        subscription?.status
      )
    ) {
      throw redirect({
        to: '/student/failed-subscription',
        replace: true,
        search: { redirect: location.pathname },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
