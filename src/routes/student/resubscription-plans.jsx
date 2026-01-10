import { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import { QueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Outlet,
  redirect,
  useSearch,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { Show } from '../../shared/utils/Show'
import { getCookie } from '../../shared/utils/helperFunction'
import { paymentMethodsQueryOptions } from '../_authenticated/student/payment-methods'
import { SmallLoader } from '../_authenticated/teacher/-layout/data/components/teacher-authenticated-layout'
import PaymentMethodsList from './-components/PaymentMethodList'
import Plans from './-components/Plans'

export const Route = createFileRoute('/student/resubscription-plans')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const credentials = getCookie('studentCredentials')
    const subscription = getCookie('studentSubscription')

    if (subscription?.status === 'active') {
      navigate({ to: '/student', replace: true })
      return
    }

    if (['past_due', 'unpaid', 'incomplete'].includes(subscription?.status)) {
      navigate({ to: '/student/failed-subscription', replace: true })
      return
    }

    if (!subscription && !credentials?.customerId) {
      navigate({ to: '/student/subscription-plans', replace: true })
      return
    }

    // Passed all checks
    setChecking(false)
  }, [navigate])

  if (checking) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <SmallLoader />
      </div>
    )
  }

  return (
    <Suspense fallback={<SmallLoader />}>
      <PlanComponent />
    </Suspense>
  )
}

function PlanComponent() {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [paymentMethodListFlag, paymentMethodsListFlag] = useState(false)
  const { data, fetchStatus } = useSuspenseQuery(paymentMethodsQueryOptions())
  const { paymentMethods, defaultPM } = data
  const searchParams = useSearch({ from: '/student/resubscription-plans' })
  const setThings = (flag, subscriptionPlan) => {
    paymentMethodsListFlag(flag)
    setSelectedPlan(subscriptionPlan)
  }

  return (
    <div className='bg-base-200 h-[100vh]'>
      <Show>
        <Show.When isTrue={paymentMethodListFlag}>
          <PaymentMethodsList
            plan={selectedPlan}
            paymentMethodsListFlag={paymentMethodsListFlag}
            defaultPM={defaultPM}
            paymentMethods={paymentMethods}
            queryOptions={paymentMethodsQueryOptions}
            fetchStatus={fetchStatus}
            redirect={searchParams?.redirect}
            data={searchParams?.courseTeachers}
          />
        </Show.When>

        <Show.Else>
          <Plans mode={'resubscribe'} setThings={setThings} />
        </Show.Else>
      </Show>
    </div>
  )
}
