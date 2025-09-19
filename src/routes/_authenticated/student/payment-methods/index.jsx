import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PlusCircle, Trash } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { addTitle } from '../../../../shared/config/reducers/animateBgSlice';
import { openModal } from '../../../../shared/config/reducers/student/studentDialogSlice';
import { useAppUtils } from '../../../../hooks/useAppUtils';

const queryClient = new QueryClient();

export const paymentMethodsQueryOptions = () =>
  queryOptions({
    queryKey: ['get-payment-methods-student'],
    queryFn: async () => {
      try {
        const paymentMethodsResponse = await axios.get(
          '/student/payment/get-payment-methods?details=true'
        );
        console.log('paymentMethodsResposne ==>',paymentMethodsResponse)
        if (paymentMethodsResponse.data.success) {
          return {
            paymentMethods: paymentMethodsResponse.data.data,
          };
        }
        return { paymentMethods: [] };
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        return { paymentMethods: [] };
      }
    },
  });

export const Route = createFileRoute('/_authenticated/student/payment-methods/')({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(paymentMethodsQueryOptions()),
});

function RouteComponent() {
  const { data, fetchStatus } = useSuspenseQuery(paymentMethodsQueryOptions());
  const { paymentMethods } = data;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const { router } = useAppUtils();

  const setCardAsDefault = useCallback(
    async (paymentMethodId) => {
      try {
        const response = await axios.put(
          `/student/payment/set-card-as-default/${paymentMethodId}`
        );
        if (response.data.success) {
          await queryClient.invalidateQueries(paymentMethodsQueryOptions());
          toast.success('Payment Method is set to default successfully');
        }
      } catch (error) {
        console.error('Error setting default card:', error);
        toast.error('Something went wrong');
      }
    },
    [queryClient, toast, router]
  );

  const cardDefaultMutation = useMutation({
    mutationFn: setCardAsDefault,
  });

  const removeCardMutation = useMutation({
    mutationFn: async (paymentMethodId) => {
      // Logic for detaching payment method
    },
  });

  useEffect(() => {
    dispatch(addTitle({ title: 'My Payment Methods' }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6">
      <Card className="max-w-4xl mx-auto p-6 space-y-8 bg-[#ffffff] rounded-[12px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:border-[#cbd5e1] transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
            My Payment Methods
          </h1>
          <Button
            size="lg"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-6 py-3 font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition duration-300 ease-out hover:scale-105 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
            onClick={() => dispatch(openModal({ type: 'add-payment-method' }))}
          >
            <span className="relative flex items-center gap-2">
              Add New Method <PlusCircle size={20} />
            </span>
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((pm,i) => (
              <Card
                key={pm.paymentMethodId}
                className={`relative p-4 rounded-[12px] bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:border-[#cbd5e1]
                  ${fetchStatus === 'fetching' ? 'bg-[#f59e0b]/10 animate-pulse' : ''}`}
                onMouseEnter={() => setSelectedPaymentMethodId(pm.paymentMethodId)}
                onMouseLeave={() => setSelectedPaymentMethodId(null)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="font-semibold capitalize text-[#1e293b]">{pm.brand}</p>
                    <p className="text-sm text-[#64748b]">**** **** **** {pm.last4}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {pm.isDefault ? (
                      <Badge className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]">Default</Badge>
                    ) : (
                      selectedPaymentMethodId === pm.paymentMethodId && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#2563eb] border border-[#2563eb]/20 bg-[#2563eb]/10 hover:bg-[#2563eb]/20 hover:text-[#1d4ed8] transition-colors rounded-[8px]"
                          onClick={() => cardDefaultMutation.mutate(pm.paymentMethodId)}
                          disabled={cardDefaultMutation.status === 'pending'}
                        >
                          {cardDefaultMutation.status === 'pending' ? 'Setting...' : 'Set Default'}
                        </Button>
                      )
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      className="p-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-[8px] transition-transform hover:scale-105 hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: 'detach-payment-method',
                            props: {
                              paymentMethodId: pm.paymentMethodId,
                            },
                          })
                        )
                      }
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-[#64748b] flex justify-between">
                  <p>Expires: {pm.exp_month}/{pm.exp_year}</p>
                  <p>Added: {format(pm.created * 1000, 'PPP')}</p>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-[#64748b]">
              <p className="text-lg font-medium text-[#1e293b] mb-2">No payment methods found.</p>
              <p className="text-sm">Add a new payment method to get started.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}