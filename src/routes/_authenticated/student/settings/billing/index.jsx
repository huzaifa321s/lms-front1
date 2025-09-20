import { useState } from 'react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContentSection from '../-components/content-section'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { openModal } from '../../../../../shared/config/reducers/student/studentDialogSlice'
import { Show } from '../../../../../shared/utils/Show'
import {
  getSubscriptionStatus,
  unixToLocaleStr,
} from '../../../../../shared/utils/helperFunction'
import { setCardAsDefault } from '../../../../../utils/globalFunctions'
import { queryClient } from '../../../../../utils/globalVars'
import PaymentMethods from '../../../../student/-components/paymentMethods'
import { invoicesQueryOption } from '../../../../student/setting/invoices'
import { invoicesSchema } from '../../features/tasks/-components/columns'
import { DataTable } from '../../features/tasks/-components/data-table'
import { paymentMethodsQueryOptions } from '../../payment-methods'

export const Route = createFileRoute(
  '/_authenticated/student/settings/billing/'
)({
  component: () => (
    <>
      <ContentSection
        title='Billing'
        desc='Manage your subscription plans, payment methods, and view invoices in one place.'
      >
        <Billing />
      </ContentSection>
    </>
  ),
  loader: () => {
  return Promise.all([
    queryClient.ensureQueryData(paymentMethodsQueryOptions()),
    queryClient.ensureQueryData(invoicesQueryOption(5)),
  ])
}

})

const plans = ['daily', 'bronze', 'silver', 'gold']

function Billing() {
  const { dispatch, router, navigate } = useAppUtils()
  const { data, fetchStatus } = useSuspenseQuery(paymentMethodsQueryOptions())
  const [fetchInvoices, setFetchInvoices] = useState(false)
const { data: invoicesData } = useSuspenseQuery(invoicesQueryOption(5))

  console.log('invoicesData ==>', invoicesData)
  const invoices = invoicesData?.invoices
  const { paymentMethods, defaultPM } = data
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)
  console.log('subscription ==>', subscription)
  const filteredPlans = plans.filter(
    (p) => p !== subscription?.name?.toLowerCase()
  )
  const remainingCourses = useSelector(
    (state) => state.studentAuth.credentials?.remainingEnrollmentCount
  )
  const [tabValue, setTabValue] = useState(filteredPlans[0])

  // Select Plan & Payment Method
  const selectPaymentMethod = (e) => {
    setSelectedPaymentMethod(e.target.value)
  }

  const cardDefault = useMutation({
    mutationFn: setCardAsDefault,
  })

  const handleTabsValueChange = (e) => {
    setTabValue(e)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 sm:p-6 lg:p-8'>
      <Tabs orientation='horizontal' defaultValue='billing' className='w-full'>
        <div className='mb-6 rounded-xl border border-slate-200/50 bg-white/90 shadow-lg backdrop-blur-sm'>
          <TabsList className='grid w-full grid-cols-2 rounded-xl border border-slate-200/30 bg-gradient-to-r from-slate-50/80 to-blue-50/50 p-1 lg:grid-cols-4'>
            <TabsTrigger
              value='billing'
              className='flex items-center gap-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:border data-[state=active]:border-blue-200/50 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md'
            >
              💳 Billing
            </TabsTrigger>
            <TabsTrigger
              value='invoices'
              onClick={() => setFetchInvoices(true)}
              className='flex items-center gap-2 rounded-lg font-medium transition-all duration-200 data-[state=active]:border data-[state=active]:border-blue-200/50 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md'
            >
              📄 Invoices
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='billing' className='space-y-6'>
          <div className='group relative rounded-xl border border-slate-200/50 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
            <div className='pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100' />

            <div className='relative'>
              <div className='mb-6 flex items-center gap-3'>
                <div className='rounded-full bg-gradient-to-br from-blue-100 to-slate-100 p-2 shadow-sm'>
                  <span className='text-xl'>💳</span>
                </div>
                <h1 className='bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl'>
                  Current Subscription
                </h1>
              </div>

              <div className='mb-6 rounded-xl border border-blue-200/30 bg-gradient-to-r from-blue-50/50 to-slate-50/50 p-4'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <h2 className='text-xl font-bold text-slate-800 sm:text-2xl'>
                        {subscription?.name} Plan
                      </h2>
                      <Badge
                        className={`border border-blue-200/50 shadow-sm ${subscription?.status !== 'active' ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-blue-100 to-slate-100 text-blue-700'}`}
                      >
                        {getSubscriptionStatus(subscription?.status)}
                      </Badge>
                    </div>
                    <p className='bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-lg font-semibold text-transparent sm:text-xl'>
                      {subscription?.price} per month
                    </p>
                    <p className='text-sm text-slate-600 sm:text-base'>
                      <span
                        className={`font-semibold ${getSubscriptionStatus(subscription?.status) === 'Expired' ? 'text-red-500 line-through' : ''}`}
                      >
                        Remaining Courses: {remainingCourses}/
                        {subscription?.courseLimit}
                      </span>
                    </p>
                    {getSubscriptionStatus(subscription?.status) !==
                      'Expired' && (
                      <p className='text-sm text-slate-600 sm:text-base'>
                        <span className='font-bold text-slate-700'>
                          Next Payment:
                        </span>{' '}
                        {unixToLocaleStr(
                          subscription?.currentPeriodEnd,
                          'en-US'
                        )}
                      </p>
                    )}
                    {getSubscriptionStatus(subscription?.status) ===
                      'Expired' && (
                      <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
                        <p className='text-sm font-semibold text-red-700 sm:text-base'>
                          Pay the debts to renew the subscription.
                        </p>
                      </div>
                    )}
                  </div>
        {subscription?.status === 'active' ? (
  // ✅ Case 1: Active subscription
  <div className='rounded-2xl border border-green-200/50 bg-green-50/80 p-8 text-center shadow-xl backdrop-blur-sm md:p-12'>
    <h1 className='text-3xl font-bold text-green-600 md:text-4xl'>
      Subscription Active
    </h1>
    <p className='mt-4 text-base leading-relaxed text-green-700 md:text-lg'>
      Your subscription is active. Enjoy all premium features!
    </p>
    <Button
      onClick={() => dispatch( openModal({ type: "cancel-subscription-modal", props: { currentPlan: subscription }, }))}
      className='mt-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-xl'
    >
      Cancel Subscription
    </Button>
  </div>
) : subscription?.status === 'canceled' ? (
  // ❌ Case 2: Canceled subscription
  <div className='rounded-2xl border border-red-200/50 bg-red-50/80 p-8 text-center shadow-xl backdrop-blur-sm md:p-12'>
    <h1 className='text-3xl font-bold text-red-600 md:text-4xl'>
      Subscription Canceled
    </h1>
    <p className='mt-4 text-base leading-relaxed text-red-700 md:text-lg'>
      Your subscription has been canceled. Please resubscribe to continue.
    </p>
    <Button
      onClick={() => navigate({ to: '/student/resubscription-plans' ,search:{redirect:"/student/settings/billing"}})}
      className='mt-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-xl'
    >
      Resubscribe
    </Button>
  </div>
) : subscription?.status === 'pending' ? (
  // ⏳ Case 3: Pending subscription
  <div className='rounded-2xl border border-yellow-200/50 bg-yellow-50/80 p-8 text-center shadow-xl backdrop-blur-sm md:p-12'>
    <h1 className='text-3xl font-bold text-yellow-600 md:text-4xl'>
      Subscription Pending
    </h1>
    <p className='mt-4 text-base leading-relaxed text-yellow-700 md:text-lg'>
      Your subscription is pending. Please complete the payment process to activate your plan.
    </p>
    <Button
      onClick={async () => {
        try {
          toast.info('This function will be available in a future update.')
        } catch (err) {
          console.error('Payment completion error:', err)
          alert('Something went wrong while completing payment.')
        }
      }}
      className='mt-6 w-full rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl md:w-auto'
    >
      Complete Payment
    </Button>
  </div>
) : subscription?.status === 'past_due' ? (
  // ⚠️ Case 4: Past due subscription
  <div className='rounded-2xl border border-orange-200/50 bg-orange-50/80 p-8 text-center shadow-xl backdrop-blur-sm md:p-12'>
    <h1 className='text-3xl font-bold text-orange-600 md:text-4xl'>
      Payment Past Due
    </h1>
    <p className='mt-4 text-base leading-relaxed text-orange-700 md:text-lg'>
      Your payment is overdue. Please update your payment method to continue.
    </p>
    <Button
      onClick={() => navigate({ to: '/student/settings/payment-methods' })}
      className='mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
    >
      Update Payment Method
    </Button>
  </div>
) : (
  // 🚫 Case 5: Inactive / No subscription
  <div className='rounded-2xl border border-slate-200/50 bg-slate-50/80 p-8 text-center shadow-xl backdrop-blur-sm md:p-12'>
    <h1 className='text-3xl font-bold text-slate-600 md:text-4xl'>
      No Active Subscription
    </h1>
    <p className='mt-4 text-base leading-relaxed text-slate-700 md:text-lg'>
      You don’t have an active subscription. Choose a plan to get started.
    </p>
    <Button
      onClick={() => navigate({ to: '/student/subscription-plans' })}
      className='mt-6 rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-slate-600 hover:to-slate-700 hover:shadow-xl'
    >
      Subscribe Now
    </Button>
  </div>
)}
                </div>
              </div>
            </div>
          </div>

          {subscription?.subscriptionId && (
            <>
              {/* Available Plans */}
              <div className='group relative rounded-xl border border-slate-200/50 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
                <div className='pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100' />

                <div className='relative'>
                  <h2 className='mb-4 text-xl font-bold text-slate-700 sm:text-2xl'>
                    Available Plans
                  </h2>

                  {subscription?.status === 'pending' ? (
                    <div className='py-8 text-center text-slate-500'>
                      <p className='font-medium'>
                        Your subscription is pending.
                      </p>
                      <p className='text-sm'>
                        Please complete payment or add a payment method to
                        continue.
                      </p>
                    </div>
                  ) : (
                    <Tabs
                      value={tabValue}
                      onValueChange={handleTabsValueChange}
                      className='w-full'
                    >
                      <TabsList className='mb-6 grid grid-cols-2 rounded-xl border border-slate-200/30 bg-gradient-to-r from-slate-50/80 to-blue-50/50 p-1 md:grid-cols-4'>
                        {plans.map((p, i) => {
                          return (
                            p !== subscription?.name?.toLowerCase() && (
                              <TabsTrigger
                                value={p}
                                key={i}
                                className='rounded-lg font-medium capitalize transition-all duration-200 data-[state=active]:border data-[state=active]:border-blue-200/50 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md'
                              >
                                {p}
                              </TabsTrigger>
                            )
                          )
                        })}
                      </TabsList>

                     {/* Daily Plan */}
<TabsContent value='daily'>
  {subscription?.name !== 'Daily' && (
    <div className='rounded-xl border border-blue-200/30 bg-gradient-to-br from-blue-50/30 to-slate-50/30 p-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-blue-600 sm:text-xl'>
            $10 per day
          </h3>
          <ul className='space-y-2 text-slate-600'>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Access to 1 course
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Basic support
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Limited features
            </li>
          </ul>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            dispatch(
              openModal({
                type: 'update-subscription-modal',
                props: {
                  selectedPlan: 'Daily',
                  currentPlan: subscription,
                },
              })
            );
          }}
          className='w-full border border-blue-200/50 bg-gradient-to-r from-white to-blue-50/80 font-medium text-blue-700 shadow-lg transition-all duration-200 hover:border-blue-300 hover:from-blue-50 hover:to-slate-50 hover:shadow-xl sm:w-auto'
        >
          Update to Daily Plan
        </Button>
      </div>
    </div>
  )}
</TabsContent>

{/* Bronze Plan */}
<TabsContent value='bronze'>
  {subscription?.name !== 'Bronze' && (
    <div className='rounded-xl border border-blue-200/30 bg-gradient-to-br from-blue-50/30 to-slate-50/30 p-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-blue-600 sm:text-xl'>
            $170 per month
          </h3>
          <ul className='space-y-2 text-slate-600'>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Can buy 4 courses
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Limited support
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Basic features
            </li>
          </ul>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            dispatch(
              openModal({
                type: 'update-subscription-modal',
                props: {
                  selectedPlan: 'Bronze',
                  currentPlan: subscription,
                },
              })
            );
          }}
          className='w-full border border-blue-200/50 bg-gradient-to-r from-white to-blue-50/80 font-medium text-blue-700 shadow-lg transition-all duration-200 hover:border-blue-300 hover:from-blue-50 hover:to-slate-50 hover:shadow-xl sm:w-auto'
        >
          Update to Bronze Plan
        </Button>
      </div>
    </div>
  )}
</TabsContent>

{/* Silver Plan */}
<TabsContent value='silver'>
  {subscription?.name !== 'Silver' && (
    <div className='rounded-xl border border-blue-200/30 bg-gradient-to-br from-blue-50/30 to-slate-50/30 p-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-blue-600 sm:text-xl'>
            $300 per month
          </h3>
          <ul className='space-y-2 text-slate-600'>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Can buy 8 courses
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Priority support
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Advanced features
            </li>
          </ul>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            dispatch(
              openModal({
                type: 'update-subscription-modal',
                props: {
                  selectedPlan: 'Silver',
                  currentPlan: subscription,
                },
              })
            );
          }}
          className='w-full border border-blue-200/50 bg-gradient-to-r from-white to-blue-50/80 font-medium text-blue-700 shadow-lg transition-all duration-200 hover:border-blue-300 hover:from-blue-50 hover:to-slate-50 hover:shadow-xl sm:w-auto'
        >
          Update to Silver Plan
        </Button>
      </div>
    </div>
  )}
</TabsContent>

{/* Gold Plan */}
<TabsContent value='gold'>
  {subscription?.name !== 'Gold' && (
    <div className='rounded-xl border border-blue-200/30 bg-gradient-to-br from-blue-50/30 to-slate-50/30 p-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-blue-600 sm:text-xl'>
            $500 per month
          </h3>
          <ul className='space-y-2 text-slate-600'>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              Unlimited courses
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              24/7 premium support
            </li>
            <li className='flex items-center gap-2 text-sm sm:text-base'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              All features unlocked
            </li>
          </ul>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            dispatch(
              openModal({
                type: 'update-subscription-modal',
                props: {
                  selectedPlan: 'Gold',
                  currentPlan: subscription,
                },
              })
            );
          }}
          className='w-full border border-blue-200/50 bg-gradient-to-r from-white to-blue-50/80 font-medium text-blue-700 shadow-lg transition-all duration-200 hover:border-blue-300 hover:from-blue-50 hover:to-slate-50 hover:shadow-xl sm:w-auto'
        >
          Update to Gold Plan
        </Button>
      </div>
    </div>
  )}
</TabsContent>
                      {/* Same logic repeat for Silver, Gold, Daily */}
                    </Tabs>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className='group relative rounded-xl border border-slate-200/50 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
                <div className='pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100' />

                <div className='relative'>
                  <h2 className='mb-6 text-xl font-bold text-slate-700 sm:text-2xl'>
                    Payment Methods
                  </h2>

                  <Show>
                    <Show.When
                      isTrue={
                        fetchStatus === 'fetching' || paymentMethods.length > 0
                      }
                    >
                      <div className='mb-4 rounded-xl border border-blue-200/30 bg-gradient-to-r from-blue-50/30 to-slate-50/30 p-4'>
                        <PaymentMethods
                          paymentMethods={paymentMethods}
                          fetchStatus={fetchStatus}
                          selectPaymentMethod={selectPaymentMethod}
                          selectedPaymentMethod={selectedPaymentMethod}
                          cardDefault={cardDefault}
                          dispatch={dispatch}
                          openModal={openModal}
                          router={router}
                        />
                      </div>
                    </Show.When>
                    <Show.Else>
                      <div className='py-12 text-center'>
                        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-slate-100'>
                          <span className='text-2xl'>💳</span>
                        </div>
                        <p className='text-slate-600'>
                          No payment methods available.
                        </p>
                      </div>
                    </Show.Else>
                  </Show>

                  <Button
                    onClick={() =>
                      dispatch(openModal({ type: 'add-payment-method' }))
                    }
                    size='sm'
                    className='mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:mt-0 sm:w-auto'
                  >
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value='invoices' className='space-y-6'>
          <div className='group relative rounded-xl border border-slate-200/50 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
            <div className='pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100' />

            <div className='relative'>
              <div className='mb-6 flex items-center gap-3'>
                <div className='rounded-full bg-gradient-to-br from-blue-100 to-slate-100 p-2 shadow-sm'>
                  <span className='text-xl'>📄</span>
                </div>
                <h1 className='bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl'>
                  Invoices
                </h1>
              </div>

              <Show>
                <Show.When isTrue={invoices && invoices.length > 0}>
                  <div className='space-y-4'>
                    <div className='rounded-xl border border-blue-200/30 bg-gradient-to-r from-blue-50/50 to-slate-50/50 p-4'>
                      <p className='text-lg font-semibold text-slate-700'>
                        Recent 5 invoices
                      </p>
                    </div>
                    <div className='overflow-hidden rounded-xl border border-blue-200/30 bg-white/70 backdrop-blur-sm'>
                      {console.log('invoices ==>', invoices)}
                      <DataTable
                        data={invoices}
                        columns={invoicesSchema}
                        pagination={false}
                      />
                    </div>
                    {invoicesData?.has_more && (
                      <Button
                        onClick={() =>
                          navigate({
                            to: '/student/invoices',
                            reloadDocument: true,
                          })
                        }
                        className='w-auto bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                      >
                        View All Invoices
                      </Button>
                    )}
                  </div>
                </Show.When>
                <Show.Else>
                  <div className='py-12 text-center'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-slate-100'>
                      <span className='text-2xl'>📄</span>
                    </div>
                    <p className='text-slate-600'>No invoices available.</p>
                  </div>
                </Show.Else>
              </Show>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
