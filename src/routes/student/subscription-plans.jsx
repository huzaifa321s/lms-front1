import { useState } from 'react'
import axios from 'axios'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Show } from '../../shared/utils/Show'
import { getCookie } from '../../shared/utils/helperFunction'
import CardForm from '../_authenticated/student/settings/-components/-card-form'
import Plans from './-components/Plans'

export const Route = createFileRoute('/student/subscription-plans')({
  beforeLoad: () => {
    const TOKEN = getCookie('studentToken')
    const credentials = JSON.parse(localStorage.getItem('studentCredentials'))

    if (TOKEN && credentials) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`

      axios.interceptors.request.use(
        function (config) {
          if (config.skipInterceptors) {
            return config
          }
          document.body.classList.add('loading-indicator')
          return config
        },
        function (error) {
          return Promise.reject(error)
        }
      )

      axios.interceptors.response.use(
        function (response) {
          if (response.config.skipInterceptors) {
            return response
          }
          document.body.classList.remove('loading-indicator')
          return response
        },
        function (error) {
          if (error.config.skipInterceptors) {
            return Promise.reject(error)
          }
          document.body.classList.remove('loading-indicator')
          return Promise.reject(error)
        }
      )

      // Scenario 1: Subscribed
      console.log('credentials ===>', credentials)
      if (credentials.subscription) {
        const { status } = credentials.subscription

        // // Scenario 2: Payment failed
        // if (status === 'past_due') {
        //     return <Navigate to="/student/welcome" replace />
        // }

        // // Scenario 3: Subscription activated
        // if (status === 'active') {
        //   return <Navigate to="/student/welcome" replace />
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
        <CardForm plan={selectedPlan} setCardDetailsFlag={setCardDetailsFlag} />
      </Show.When>

      <Show.Else>
        <Plans setThings={setThings} />
      </Show.Else>
    </Show>
  )
}
