import { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { updateSubscription } from '../../../shared/config/reducers/student/studentAuthSlice'
import { openModal } from '../../../shared/config/reducers/student/studentDialogSlice'
import { Show } from '../../../shared/utils/Show'
import PaymentMethods from './paymentMethods'
import { useAppUtils } from '../../../hooks/useAppUtils'
import { setCardAsDefault } from '../../../utils/globalFunctions'
import { getSidebarData, getSubscription } from '../../../components/layout/data/sidebar-data'

function PaymentMethodsList({
  plan,
  paymentMethodsListFlag,
  paymentMethods,
  fetchStatus,
  redirect,
  data
}) {
  const { dispatch, navigate, router } = useAppUtils()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  // Select Payment Method
  const selectPaymentMethod = (e) => {
    setSelectedPaymentMethod(e.target.value)
  }

  // API methods:
  const resubscribe = async () => {
    const reqBody = { plan: plan?.name }
    try {
      let response = await axios.post('/student/payment/resubscribe', reqBody)
      response = response.data
      if (response.success) {
        toast.success(response.message)
        const { subscription, remainingEnrollmentCount } = response.data
        dispatch(updateSubscription({ subscription, remainingEnrollmentCount }))
        getSidebarData();
      
        if(redirect){
console.log('data ===>',data)
          navigate({to:redirect,search:{courseTeachers:data?.length > 0 && JSON.stringify(data)}})
        }else{
          navigate({ to: '/' })
        }
      }
    } catch (error) {
      toast.error(`Subscription failed`)
      console.log('Registration Error --> ', error)
    }
  }

  const resubscribeMutation = useMutation({
    mutationFn: resubscribe,
  })

  const cardDefault = useMutation({
    mutationFn: setCardAsDefault,
  })

  return (
      <div className="flex min-h-[80vh] items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Card className="w-full max-w-5xl shadow-2xl border-0 bg-white/90 rounded-2xl backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800 ">
            {plan?.name} Plan
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paymentMethodsListFlag(false)}
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          >
            ✕
          </Button>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Left Side: Plan Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {plan?.price}
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600 ">
              {plan?.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Payment Methods */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 ">
              Payment Methods
            </h2>
            <p className="mb-4 text-sm text-slate-500 ">
              We'll use your <span className="font-medium">Default card</span> for the payment.
            </p>

            <Show>
              <Show.When isTrue={paymentMethods.length > 0}>
                <div className="space-y-3">
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
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500 ">
                  No payment methods available.
                </div>
              </Show.Else>
            </Show>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(openModal({ type: 'add-payment-method' }))}
                className="border-slate-200 text-slate-800 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 "
              >
                + Add Payment Method
              </Button>
            </div>
          </div>
        </CardContent>

        <div className="border-t border-slate-100 mt-6 pt-4 flex justify-end px-6">
          <Button
            className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 "
            disabled={
              paymentMethods.length < 1 || resubscribeMutation.status === 'pending'
            }
            onClick={() => resubscribeMutation.mutate()}
          >
            {resubscribeMutation.status === 'pending' ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PaymentMethodsList
