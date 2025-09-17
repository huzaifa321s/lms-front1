import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router' 
import { useSelector } from 'react-redux' 
import { openModal } from '../../../../shared/config/reducers/student/studentDialogSlice' 
import store from '../../../../shared/config/store/store' 

export const Route = createFileRoute('/_authenticated/student/_subscribed')({ component: RouteComponent, })

function RouteComponent() {
  const subscription = useSelector((state) => state.studentAuth.subscription)
  const location = useLocation()
  console.log('location', location.pathname)

  // 🚨 Allowed subscription routes → skip checks
  const subscriptionRoutes = [
    '/student/subscription-plans',
    '/student/resubscription-plans',
    '/student/failed-subscription',
    '/student',
  ]
  if (subscriptionRoutes.includes(location.pathname)) {
    return
  }

  // 🚨 If subscription object missing
  if (!subscription ) {
    store.dispatch(
      openModal({
        type: 'subscription-modal',
        props: { redirect: location.pathname },
      })
    )
    return
  }


  if (!subscription?.subscriptionId) {
  store.dispatch(
    openModal({
      type: "subscription-modal",
      props: { redirect: location.pathname },
    })
  )
  return
}

 // 🚨 If subscription status is in a failed state
if (
  ["incomplete", "incomplete_expired", "past_due", "unpaid"].includes(
    subscription?.status
  )
) {
  throw redirect({
    to: "/student/failed-subscription",
    replace: true,
    search: { redirect:location.pathname },
  })
}

  // 🚨 If subscriptionId is missing (even though status might be active)
  // if (!subscription?.subscriptionId) {
  //   throw redirect({
  //     to: '/student/resubscription-plans',
  //     replace: true,
  //     search: { redirect: location.pathname },
  //   })
  // }

  return <Outlet />
}
