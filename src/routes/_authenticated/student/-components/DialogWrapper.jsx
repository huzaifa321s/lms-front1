import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { redirect, useRouteContext } from '@tanstack/react-router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  handleLogin,
  updateSubscription,
} from '../../../../shared/config/reducers/student/studentAuthSlice'
import { closeModal } from '../../../../shared/config/reducers/student/studentDialogSlice'
import { getCookie } from '../../../../shared/utils/helperFunction'
import { paymentMethodsQueryOptions } from '../payment-methods'
import { getSidebarData } from '../../../../components/layout/data/sidebar-data'



const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [dialogType, setDialogType] = useState(modalType)
  const { navigate, dispatch } = useAppUtils()
  const queryClient = useQueryClient()
  const [defaultCheck, setDefaultCheck] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const credentials = useSelector((state) => state.studentAuth.credentials)
  // Reset modal inputs
  const resetModal = () => {
    const cardElement = elements.getElement(CardElement)
    if (cardElement) cardElement.clear()
    setCardComplete(false)
    setDefaultCheck(false)
  }

  const confirmDetach = useCallback(async () => {
    try {
      let response = await axios.delete(
        `/student/payment/detach-payment-method/${modalData?.paymentMethodId}`
      )
      response = response.data
      if (response.success) {
        await queryClient.invalidateQueries(paymentMethodsQueryOptions())
        toast.success('Payment method detached sucessfully')
        dispatch(closeModal())
      }
    } catch (error) {
      console.log('Registration Error --> ', error)
      toast.error('Something went wrong')
    }
  }, [
    axios,
    modalData?.paymentMethodId,
    toast,
    queryClient,
    paymentMethodsQueryOptions,
    dispatch,
    closeModal,
  ])
  // Save card details
  const saveCardDetails = useCallback(async () => {
    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    const { token } = await stripe.createToken(cardElement)
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: { token: token.id },
    })

    const reqBody = {
      paymentMethodId: paymentMethod.id,
      setDefaultPaymentMethodFlag: defaultCheck,
    }

    try {
      let response = await axios.post(
        '/student/payment/add-new-payment-method',
        reqBody
      )
      response = response.data
      if (response.success) {
        // cardElement.clear();
        toast.success(response.message)
        await queryClient.invalidateQueries(paymentMethodsQueryOptions())
        resetModal()
        dispatch(closeModal())
      }
    } catch (error) {
      console.log('Registration Error --> ', error)
      toast.error('Something went wrong')
    }
  }, [
    CardElement,
    stripe,
    elements,
    defaultCheck,
    axios,
    toast,
    queryClient,
    dispatch,
    closeModal,
    paymentMethodsQueryOptions,
  ])

  const saveCardDetailsMutation = useMutation({
    mutationFn: saveCardDetails,
  })

  const cardDetach = useMutation({
    mutationFn: confirmDetach,
  })
  
  const updatePlan = useCallback(async () => {
    try {
      let response = await axios.put(
        `/student/payment/update-subscription-plan`,
        { newPlan: modalData?.selectedPlan }
      )
      console.log('credentials ===>', credentials)
      response = response.data
      if (response.success) {
        toast.success(response.message)
        const { subscription, remainingEnrollmentCount, user } = response.data
        console.log('user ===>',user);
        dispatch(
          updateSubscription({
            subscription: {
              ...subscription,
              subscriptionId: user?.subscriptionId,
            },
            remainingEnrollmentCount,
          })
        )
        getSidebarData()
        dispatch(closeModal())
        await queryClient.invalidateQueries(paymentMethodsQueryOptions())
      }
    } catch (error) {
      console.log('Error: ', error)
      toast.error('Something went wrong')
    }
  }, [
    modalData?.currentPlan,
    modalData?.selectedPlan,
    axios,
    modalData?.setTabValue,
    dispatch,
    closeModal,
    toast,
    queryClient,
    paymentMethodsQueryOptions,
  ])

  const planUpdate = useMutation({
    mutationFn: updatePlan,
  })
  const cancelPlan = useCallback(async () => {
    try {
      let response = await axios.delete(
        `/student/payment/cancel-subscription/${modalData?.currentPlan.subscriptionId}`
      )
      response = response.data
      if (response.success) {
        toast.success(response.message)
        const { subscription, remainingEnrollmentCount } = response.data
        console.log('subscription --_____',subscription)
        dispatch(updateSubscription({ subscription, remainingEnrollmentCount }))
        dispatch(closeModal())
      }
    } catch (error) {
      console.log('error ===> ', error)
      toast.error('Something went wrong')
    }
  }, [axios, modalData?.currentPlan, toast, navigate, dispatch, closeModal])

  const planCancel = useMutation({
    mutationFn: cancelPlan,
  })
  useEffect(() => {
    setDialogType(modalType)
  }, [modalType])
  const handleChange = (event) => {
    setCardComplete(event.complete)
  }
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        marginTop: '5px',
        marginBottom: '5px',
        color: '#000',
        '::placeholder': {
          color: '#000',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
  const handleSubmitCard = (e) => {
    e.preventDefault()
    saveCardDetailsMutation.mutate()
  }
  const handleSubmitUpdation = (e) => {
    e.preventDefault()
    planUpdate.mutate()
  }

  const handleSubmitCancelation = (e) => {
    e.preventDefault()
    planCancel.mutate()
  }

  const handleGoToSubscription = (e) => {
    e.preventDefault()
    console.log('credentials ===>', credentials)
    console.log(`,sdf`, modalData)
    if (!credentials?.customerId) {
      console.log('customer id condition true')
      navigate({
        to: '/student/subscription-plans',
        replace: true,
        search: { redirect: modalData?.redirect },
      })
      dispatch(closeModal())
    } else if (credentials?.customerId && !credentials.subscription) {
      navigate({
        to: '/student/resubscription-plans',
        replace: true,
        search: {
          redirect: modalData?.redirect,
          courseTeachers: modalData?.courseTeachers,
        },
      })
      dispatch(closeModal())
    } else if (!credentials.subscription && credentials?.subscriptionId) {
      navigate({
        to: '/student/subscription-plans',
        replace: true,
        search: { redirect: modalData?.redirect },
      })
      dispatch(closeModal())
    } else if (credentials?.subscription?.status !== 'active') {
      navigate({
        to: '/student/failed-subscription',
        replace: true,
        search: { redirect: modalData?.redirect },
      })
      dispatch(closeModal())
      return
    }
  }


  const handleLoginRedirect = () =>{
   navigate({to:"/student/login",search:{redirect:modalData?.redirect}})
   dispatch(closeModal())
  }

return (
    <>
      <Dialog
        open={isOpen && dialogType === 'detach-payment-method'}
        onOpenChange={() => dispatch(closeModal())}
      >
        <form onSubmit={confirmDetach}>
          <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent'>
                Detach Payment Method
              </DialogTitle>
              <DialogDescription className='text-sm text-[#64748b]'>
                Are you sure you want to detach this payment method? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className='mt-6 flex-row items-center justify-end gap-3'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  disabled={cardDetach.status === 'pending'}
                  variant='outline'
                  className='rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]'
                  onClick={() => dispatch(closeModal())}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size='sm'
                type='submit'
                onClick={() => cardDetach.mutate()}
                loading={cardDetach.status === 'pending'}
                disabled={cardDetach.status === 'pending'}
                className='relative inline-flex h-10 items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition duration-300 ease-out hover:scale-105 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                {cardDetach.status === 'pending' ? 'Detaching...' : 'Detach'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog
        open={isOpen && dialogType === 'add-payment-method'}
        onOpenChange={() => dispatch(closeModal())}
      >
        <form onSubmit={handleSubmitCard}>
          <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent'>
                Add Payment Method
              </DialogTitle>
            </DialogHeader>
            <CardElement options={cardElementOptions} onChange={handleChange} />
            <div className='mt-4 flex items-center gap-3'>
              <Label className='font-medium text-[#64748b]'>
                Set as Default
              </Label>
              <Input
                type='checkbox'
                checked={defaultCheck}
                className='h-5 w-5 rounded-[8px] border border-[#e2e8f0] shadow-none'
                onChange={() => setDefaultCheck((prev) => !prev)}
              />
            </div>
            <DialogFooter className='mt-6 flex-row items-center justify-end gap-3'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  disabled={saveCardDetailsMutation.status === 'pending'}
                  variant='outline'
                  className='rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]'
                  onClick={() => dispatch(closeModal())}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                size='sm'
                loading={saveCardDetailsMutation.status === 'pending'}
                disabled={
                  saveCardDetailsMutation.status === 'pending' ||
                  !stripe ||
                  !cardComplete
                }
                onClick={handleSubmitCard}
                className='relative inline-flex h-10 items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-r from-[#f59e0b] to-[#d97706] font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition duration-300 ease-out hover:scale-105 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                {saveCardDetailsMutation.status === 'pending'
                  ? 'Adding...'
                  : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog
        open={isOpen && dialogType === 'update-subscription-modal'}
        onOpenChange={() => dispatch(closeModal())}
      >
        <form onSubmit={handleSubmitUpdation}>
          <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] transition-all duration-300 sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent'>
                <DollarSign className='h-6 w-6 text-[#2563eb]' />
                Update Your Plan
              </DialogTitle>
              <DialogDescription className='mt-2 text-sm text-[#64748b]'>
                Are you sure you want to change your plan to{' '}
                <span className='font-semibold text-[#1e293b]'>
                  {modalData?.selectedPlan}
                </span>
                ? We'll use your default card for the payment.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className='flex justify-end gap-3 pt-6'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={planUpdate.status === 'pending'}
                  onClick={() => dispatch(closeModal())}
                  className='rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]'
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size='sm'
                type='submit'
                loading={planUpdate.status === 'pending'}
                disabled={planUpdate.status === 'pending'}
                onClick={handleSubmitUpdation}
                className='rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-5 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                {planUpdate.status === 'pending' ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog
        open={isOpen && dialogType === 'cancel-subscription-modal'}
        onOpenChange={() => dispatch(closeModal())}
      >
        <form onSubmit={handleSubmitCancelation}>
          <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] transition-all duration-300 sm:max-w-[425px]'>
            <DialogHeader className='flex items-center text-center'>
              <div className='rounded-full bg-[#ef4444]/10 p-3'>
                <AlertCircle className='h-8 w-8 text-[#ef4444]' />
              </div>
              <DialogTitle className='mt-4 text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent'>
                Cancel Subscription
              </DialogTitle>
              <DialogDescription className='mt-2 text-sm text-[#64748b]'>
                Are you sure you want to cancel the subscription? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className='flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={planCancel.status === 'pending'}
                  onClick={() => dispatch(closeModal())}
                  className='rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]'
                >
                  Go Back
                </Button>
              </DialogClose>
              <Button
                size='sm'
                variant='destructive'
                type='submit'
                loading={planCancel.status === 'pending'}
                disabled={planCancel.status === 'pending'}
                onClick={handleSubmitCancelation}
                className='rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-5 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                {planCancel.status === 'pending'
                  ? 'Cancelling...'
                  : 'Cancel Your Plan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog
        open={isOpen && dialogType === 'subscription-modal'}
        onOpenChange={() => {
          dispatch(closeModal());
          navigate({ to: '/student/' });
        }}
      >
        <form onSubmit={handleGoToSubscription}>
          <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] transition-all duration-300 sm:max-w-[425px]'>
            <DialogHeader className='flex items-center text-center'>
              <div className='rounded-full bg-[#10b981]/10 p-3'>
                <CreditCard className='h-8 w-8 text-[#10b981]' />
              </div>
              <DialogTitle className='mt-4 text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent'>
                {modalData?.title || 'Subscribe to get access'}
              </DialogTitle>
              <DialogDescription className='mt-2 text-sm text-[#64748b]'>
                Upgrade your account to unlock premium features, including
                enrolled courses, quizzes, and more. <br />
                Choose a plan that fits you best — we’ll use your default
                payment method to process the subscription.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className='flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={planUpdate.status === 'pending'}
                  onClick={() => {
                    dispatch(closeModal());
                    navigate({ to: '/student/' });
                  }}
                  className='rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]'
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size='sm'
                type='submit'
                loading={planUpdate.status === 'pending'}
                disabled={planUpdate.status === 'pending'}
                onClick={(e) => handleGoToSubscription(e)}
                className='rounded-[8px] bg-gradient-to-r from-[#10b981] to-[#059669] px-5 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                {planUpdate.status === 'pending'
                  ? 'Subscribing...'
                  : 'Subscribe'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>




          <Dialog open={isOpen && dialogType === 'login-modal'} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="rounded-[8px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
            Login Required
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <p className="text-[#64748b] text-lg mb-6">
            You need to login first to access this page. Please login.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() =>dispatch(closeModal())}
              className="rounded-[8px] text-[#64748b] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoginRedirect}
              className="rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-medium transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
            >
              Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog
        open={isOpen && dialogType === 'activate-subscription-modal'}
        onOpenChange={() => {dispatch(closeModal())
}}
      >
        <DialogContent className='mx-auto max-w-md rounded-[8px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
          <DialogHeader>
            <DialogTitle className='bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent'>
              Activate Subscription
            </DialogTitle>
          </DialogHeader>

          <div className='p-6'>
            <p className='mb-6 text-lg text-[#64748b]'>
              Your subscription is not active. Please activate your plan to
              continue accessing premium features.
            </p>

            <div className='flex justify-end gap-4'>
              <Button
                variant='ghost'
                onClick={() => dispatch(closeModal())}
                className='rounded-[8px] text-[#64748b] transition-all duration-300 hover:bg-green-50 hover:text-green-600'
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.info('This feature will be available in a future update.')
                }}
                className='rounded-[8px] bg-gradient-to-r from-green-600 to-emerald-600 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                Activate Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DialogWrapper
