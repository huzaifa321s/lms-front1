import { useState } from 'react'
import axios from 'axios'
import { Outlet, redirect, createLazyFileRoute } from '@tanstack/react-router'
import { Show } from '../../shared/utils/Show'
import { getCookie } from '../../shared/utils/helperFunction'
import CardForm from '../_authenticated/student/settings/-components/-card-form'
import Plans from './-components/Plans'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  'pk_test_51P5zAtEdtHnRsYCMJUdZJ5Q6m6KA1LQfPxXsnKweKFvWiSsYMpEG4yRmG5jmzaBo0VBUeQSS5DTSBDDfnzLsiWGu00U3zAzcBU'
)
export const Route = createLazyFileRoute('/student/subscription-plans')({
  beforeLoad: () => {
    const TOKEN = getCookie('studentToken')
    const credentials = getCookie('studentCredentials')
    const subscription = getCookie('studentSubscription')

    if (TOKEN && credentials) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ${TOKEN}'

      if (subscription) {
        const { status } = subscription

        // // Scenario 2: Payment failed
        // if (status === 'past_due') {
        //     return <Navigate to="/student" replace />
        // }

        // // Scenario 3: Subscription activated
        // if (status === 'active') {
        //   return <Navigate to="/student" replace />
        // }

        throw redirect({ to: '/student', replace: true })
      }

      // Scenario 4: Not subscribed + Resubscribing
      if (credentials.customerId) {
        throw redirect({ to: '/student/resubscription-plans', replace: true })
      }

      // Scenario 5: Not subscribed + Subscribe (for the first time)
      return <Outlet />
    } else {
      throw redirect({ to: '/student/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [cardDetailsFlag, setCardDetailsFlag] = useState(false)

  const setThings = (flag, subscriptionPlan) => {
    setCardDetailsFlag(flag)
    setSelectedPlan(subscriptionPlan)
  }
  return (
    <Show>
      <Show.When isTrue={cardDetailsFlag}>
        <Elements stripe={stripePromise}>
        <CardForm plan={selectedPlan} setCardDetailsFlag={setCardDetailsFlag} />
        </Elements>
      </Show.When>

      <Show.Else>
        <Plans setThings={setThings} />
      </Show.Else>
    </Show>
  )
}
