import { Suspense, useCallback, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, Trash } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { openModal } from '../../../../shared/config/reducers/student/studentDialogSlice'

const queryClient = new QueryClient()

export function PaymentMethodsSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6'>
      <Card className='mx-auto max-w-4xl space-y-8 rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-sm'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <Skeleton className='h-10 w-56' />
          <Skeleton className='h-12 w-40 rounded-md' />
        </div>

        {/* Payment method cards */}
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className='relative rounded-[12px] border border-[#e2e8f0] p-4 shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-4 w-32' />
                </div>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-7 w-20 rounded-md' />
                  <Skeleton className='h-8 w-8 rounded-md' />
                </div>
              </div>
              <div className='mt-2 flex justify-between'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-4 w-32' />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
export const paymentMethodsQueryOptions = () =>
  queryOptions({
    queryKey: ['get-payment-methods-student'],
    queryFn: async () => {
      try {
        const paymentMethodsResponse = await axios.get(
          '/student/payment/get-payment-methods?details=true'
        )
        if (paymentMethodsResponse.data.success) {
          return {
            paymentMethods: paymentMethodsResponse.data.data,
          }
        }
        return { paymentMethods: [] }
      } catch (error) {
        console.error('Error fetching payment methods:', error)
        return { paymentMethods: [] }
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/student/payment-methods/'
)({
  component: () => (
    <Suspense fallback={<PaymentMethodsSkeleton />}>
      <RouteComponent />
    </Suspense>
  ),
  loader: () => queryClient.ensureQueryData(paymentMethodsQueryOptions()),
})

function RouteComponent() {
  const { data, fetchStatus } = useSuspenseQuery(paymentMethodsQueryOptions())
  const { paymentMethods } = data
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null)
  const { router } = useAppUtils()

  const setCardAsDefault = useCallback(
    async (paymentMethodId) => {
      try {
        const response = await axios.put(
          `/student/payment/set-card-as-default/${paymentMethodId}`
        )
        if (response.data.success) {
          await queryClient.invalidateQueries(paymentMethodsQueryOptions())
          toast.success('Payment Method is set to default successfully')
        }
      } catch (error) {
        console.error('Error setting default card:', error)
        toast.error('Something went wrong')
      }
    },
    [queryClient, toast, router]
  )

  const cardDefaultMutation = useMutation({
    mutationFn: setCardAsDefault,
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6'>
      <Card className='mx-auto max-w-4xl space-y-8 rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-[#cbd5e1] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-extrabold text-transparent'>
            My Payment Methods
          </h1>
          <Button
            size='sm'
            onClick={() => dispatch(openModal({ type: 'add-payment-method' }))}
          >
            <span className='relative flex items-center gap-2'>
              Add New Method <PlusCircle size={20} />
            </span>
          </Button>
        </div>

        <div className='space-y-4'>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((pm) => (
              <Card
                key={pm.paymentMethodId}
                className={`relative rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-4 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-[#cbd5e1] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] ${fetchStatus === 'fetching' ? 'animate-pulse bg-[#f59e0b]/10' : ''}`}
                onMouseEnter={() =>
                  setSelectedPaymentMethodId(pm.paymentMethodId)
                }
                onMouseLeave={() => setSelectedPaymentMethodId(null)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <p className='font-semibold text-[#1e293b] capitalize'>
                      {pm.brand}
                    </p>
                    <p className='text-sm text-[#64748b]'>
                      **** **** **** {pm.last4}
                    </p>
                  </div>

                  <div className='flex items-center gap-2'>
                    {pm.isDefault ? (
                      <Badge className='bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
                        Default
                      </Badge>
                    ) : (
                      selectedPaymentMethodId === pm.paymentMethodId && (
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            cardDefaultMutation.mutate(pm.paymentMethodId)
                          }
                          disabled={
                            cardDefaultMutation.isPending &&
                            cardDefaultMutation.variables === pm.paymentMethodId
                          }
                        >
                          {cardDefaultMutation.isPending &&
                          cardDefaultMutation.variables === pm.paymentMethodId
                            ? 'Setting...'
                            : 'Set Default'}
                        </Button>
                      )
                    )}

                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: 'detach-payment-method',
                            props: { paymentMethodId: pm.paymentMethodId },
                          })
                        )
                      }
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>

                <div className='mt-2 flex justify-between text-xs text-[#64748b]'>
                  <p>
                    Expires: {pm.exp_month}/{pm.exp_year}
                  </p>
                  <p>Added: {format(pm.created * 1000, 'PPP')}</p>
                </div>
              </Card>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center p-12 text-center text-[#64748b]'>
              <p className='mb-2 text-lg font-medium text-[#1e293b]'>
                No payment methods found.
              </p>
              <p className='text-sm'>
                Add a new payment method to get started.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
