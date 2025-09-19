import { Outlet, redirect } from '@tanstack/react-router'
import { getCookie } from '../../../../../shared/utils/helperFunction'

const credentials = JSON.parse(localStorage.getItem('studentCredentials'))
const checkSubscription = () => {
  if (credentials.customerId && !credentials.subscription) {
    throw redirect({ to: '/student/resubscription-plans', replace: true })
  }

  if (!credentials.subscription) {
    throw redirect({ to: '/student/subscription-plans', replace: true })
  }
  if (credentials.subscription && credentials.subscription !== 'cancelled') {
    return <Outlet />
  }
  return
}
export default checkSubscription
