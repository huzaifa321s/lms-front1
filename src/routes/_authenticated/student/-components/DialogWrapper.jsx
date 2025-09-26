import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { AlertCircle, AlertTriangle, CreditCard, DollarSign, Layers, LogOut, MessageSquare, Puzzle, Target, Wifi, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

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
import { getSidebarData } from '../../../../components/layout/data/sidebar-data'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { handleLogoutAdmin } from '../../../../shared/config/reducers/admin/adminAuthSlice'
import {
  handleLogout,
  updateSubscription,
} from '../../../../shared/config/reducers/student/studentAuthSlice'
import { closeModal } from '../../../../shared/config/reducers/student/studentDialogSlice'
import { handleLogoutTeacher } from '../../../../shared/config/reducers/teacher/teacherAuthSlice'
import { paymentMethodsQueryOptions } from '../payment-methods'

const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [dialogType, setDialogType] = useState(modalType)
  const { navigate, dispatch } = useAppUtils()
  const queryClient = useQueryClient()
  const [defaultCheck, setDefaultCheck] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  let stripe = null
  let elements = null
  if (modalData?.type === 'add-payment-method') {
    stripe = useStripe()
    elements = useElements()
  }
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscripiton)
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
        console.log('user ===>', user)
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
        console.log('subscription --_____', subscription)
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

    if (!credentials?.customerId) {
      console.log('credentials.customer ===>', credentials)

      return
    }

    // Case 2: Existing customer but subscription issue
    if (
      !subscription || // no subscription
      subscription?.status === 'pending' || // subscription pending
      !subscription?.subscriptionId // missing subscriptionId
    ) {
      navigate({
        to: '/student/resubscription-plans',
        replace: true,
        search: {
          redirect: modalData?.redirect,
          courseTeachers: modalData?.courseTeachers,
        },
      })
      dispatch(closeModal())
      return
    }

    // Case 3: Subscription exists but inactive
    if (subscription?.status !== 'active') {
      navigate({
        to: '/student/failed-subscription',
        replace: true,
        search: { redirect: modalData?.redirect },
      })
      dispatch(closeModal())
      return
    }
  }

  const handleLoginRedirect = () => {
    navigate({
      to: '/student/login',
      search: { redirect: modalData?.redirect },
    })
    dispatch(closeModal())
  }

  const handleLogoutUser = () => {
    if (modalData.userType === 'student') {
      dispatch(handleLogout())
      dispatch(closeModal())
      toast.success('You have been logged out successfully.')
      navigate({ to: '/' })
    } else if (modalData.userType === 'teacher') {
      dispatch(handleLogoutTeacher())
      dispatch(closeModal())
      toast.success('You have been logged out successfully.')
      navigate({ to: '/teacher/login' })
    } else {
      dispatch(handleLogoutAdmin())
      dispatch(closeModal())
      toast.success('You have been logged out successfully.')
      navigate({ to: '/admin/login' })
    }
  }
const {
    data: gameData,
    isFetching: gameIsFetching,
    fetchStatus: gameFetchStatus,
    isError: gameIsError,
    error: gameFetchingError,
  } = useQuery({
    queryKey: ['game', modalData?.gameID],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/${modalData.userType}/game/training-wheel-game/get-game/${modalData?.gameID}`
        )
        response = response.data

        if (response.success) {
          const game = response.data
          return game
        }
      } catch (error) {
        console.log('error', error)
        const errorMessage = error.response.data.message
        console.error(errorMessage)
      }
    },
    enabled: isOpen && dialogType === 'game-view',
  })

  return (
    <>
      {dialogType === 'detach-payment-method' && (
        <Dialog open onOpenChange={() => dispatch(closeModal())}>
          <form onSubmit={confirmDetach}>
            <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                  Detach Payment Method
                </DialogTitle>
                <DialogDescription className='text-sm text-[#64748b]'>
                  Are you sure you want to detach this payment method? This
                  action cannot be undone.
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
      )}

      {dialogType === 'add-payment-method' && (
        <Dialog open onOpenChange={() => dispatch(closeModal())}>
          <form onSubmit={handleSubmitCard}>
            <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                  Add Payment Method
                </DialogTitle>
              </DialogHeader>
              <CardElement
                options={cardElementOptions}
                onChange={handleChange}
              />
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
      )}

      {dialogType === 'update-subscription-modal' && (
        <Dialog open onOpenChange={() => dispatch(closeModal())}>
          <form onSubmit={handleSubmitUpdation}>
            <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
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
      )}

      {dialogType === 'cancel-subscription-modal' && (
        <Dialog open onOpenChange={() => dispatch(closeModal())}>
          <form onSubmit={handleSubmitCancelation}>
            <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
              <DialogHeader className='flex items-center text-center'>
                <div className='rounded-full bg-[#ef4444]/10 p-3'>
                  <AlertCircle className='h-8 w-8 text-[#ef4444]' />
                </div>
                <DialogTitle className='mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
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
      )}

      {dialogType === 'subscription-modal' && (
        <Dialog
          open
          onOpenChange={() => {
            dispatch(closeModal())
            navigate({ to: '/student/' })
          }}
        >
          <form onSubmit={handleGoToSubscription}>
            <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
              <DialogHeader className='flex items-center text-center'>
                <div className='rounded-full bg-[#10b981]/10 p-3'>
                  <CreditCard className='h-8 w-8 text-[#10b981]' />
                </div>
                <DialogTitle className='mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
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
                      dispatch(closeModal())
                      navigate({ to: '/student/' })
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
      )}

      <Dialog
        open={dialogType === 'login-modal'}
        onOpenChange={() => dispatch(closeModal())}
      >
        <DialogContent className='mx-auto max-w-md rounded-[8px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
          <DialogHeader>
            <DialogTitle className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
              Login Required
            </DialogTitle>
          </DialogHeader>
          <div className='p-6'>
            <p className='mb-6 text-lg text-[#64748b]'>
              You need to login first to access this page. Please login.
            </p>
            <div className='flex justify-end gap-4'>
              <Button
                variant='ghost'
                onClick={() => dispatch(closeModal())}
                className='rounded-[8px] text-[#64748b] transition-all duration-300 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]'
              >
                Cancel
              </Button>
              <Button
                onClick={handleLoginRedirect}
                className='rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {dialogType === 'activate-subscription-modal' && (
        <Dialog
          open
          onOpenChange={() => {
            dispatch(closeModal())
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
                    toast.info(
                      'This feature will be available in a future update.'
                    )
                  }}
                  className='rounded-[8px] bg-gradient-to-r from-green-600 to-emerald-600 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
                >
                  Activate Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {dialogType === 'game-view' && (
        <Dialog
          open
          onOpenChange={() => {
            dispatch(closeModal())
          }}
        >
          <DialogContent className='w-[90vw] max-w-[90vw] overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white p-0 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-lg md:max-w-xl'>
            {/* Header */}
            <DialogHeader className='m-3 sm:m-4 md:m-5'>
              <div className='flex items-start gap-2 sm:gap-3'>
                <div className='rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-1.5 sm:p-2'>
                  <MessageSquare className='h-5 w-5 text-white sm:h-6 sm:w-6' />
                </div>
                <div className='min-w-0 flex-1'>
                  <DialogTitle className='line-clamp-2 text-base leading-tight font-bold text-[#1e293b] sm:text-lg md:text-xl'>
                    {gameData?.question || (
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-[#e2e8f0] border-t-[#64748b] sm:h-5 sm:w-5'></div>
                        Loading Question...
                      </div>
                    )}
                  </DialogTitle>
                  <p className='mt-1 text-xs text-[#64748b] sm:mt-2 sm:text-sm'>
                    Training Wheel Game Question
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Content area */}
            <div className='relative space-y-4 p-4 sm:space-y-5 sm:p-5 md:space-y-6 md:p-6'>
              {/* Background decoration */}
              <div className='absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 blur-2xl sm:h-28 sm:w-28 sm:translate-x-14 sm:-translate-y-14 md:h-32 md:w-32 md:translate-x-16 md:-translate-y-16'></div>
              <div className='absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-white to-[#2563eb]/10 blur-2xl sm:h-22 sm:w-22 sm:-translate-x-11 sm:translate-y-11 md:h-24 md:w-24 md:-translate-x-12 md:translate-y-12'></div>

              <form className='relative space-y-4 sm:space-y-5 md:space-y-6'>
                {/* Error states */}
                {gameIsError && (
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#ef4444] bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 p-3 sm:gap-3 sm:p-4'>
                    <AlertTriangle className='h-4 w-4 flex-shrink-0 text-[#ef4444] sm:h-5 sm:w-5' />
                    <p className='text-xs font-medium text-[#ef4444] sm:text-sm'>
                      {gameFetchingError?.message || 'An error occurred'}
                    </p>
                  </div>
                )}

                {gameFetchStatus === 'paused' && (
                  <div className='flex items-center gap-2 rounded-[8px] border border-[#f59e0b] bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 p-3 sm:gap-3 sm:p-4'>
                    <Wifi className='h-4 w-4 flex-shrink-0 text-[#f59e0b] sm:h-5 sm:w-5' />
                    <p className='text-xs font-medium text-[#f59e0b] sm:text-sm'>
                      No Internet connection
                    </p>
                  </div>
                )}

                {/* Loading skeletons */}
                {(gameFetchStatus === 'fetching' ||
                  gameIsFetching ||
                  (!gameData && gameFetchStatus !== 'paused')) &&
                !gameIsError ? (
                  <div className='space-y-4 sm:space-y-5 md:space-y-6'>
                    {/* Skeleton for difficulties badges */}
                    <div className='space-y-2 sm:space-y-3'>
                      <Skeleton className='h-4 w-20 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-5 sm:w-24' />
                      <div className='flex flex-wrap gap-1 sm:gap-2'>
                        <Skeleton className='h-6 w-16 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-7 sm:w-20' />
                        <Skeleton className='h-6 w-20 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-7 sm:w-24' />
                        <Skeleton className='h-6 w-14 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-7 sm:w-18' />
                      </div>
                    </div>
                    {/* Skeleton for answer box */}
                    <Skeleton className='h-24 w-full rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-28 md:h-32' />
                    {/* Skeleton for answer chunks */}
                    <div className='space-y-2 sm:space-y-3'>
                      <Skeleton className='h-4 w-24 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-5 sm:w-32' />
                      <div className='space-y-1 sm:space-y-2'>
                        {[...Array(6)].map((_, i) => (
                          <Skeleton
                            key={i}
                            className='h-3 rounded-[8px] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] sm:h-4'
                            style={{ width: `${75 + (i % 3) * 10}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Actual content */
                  gameData && (
                    <div className='space-y-4 sm:space-y-5 md:space-y-6'>
                      {/* Difficulties section */}
                      {gameData?.difficulties?.length > 0 && (
                        <div className='space-y-2 sm:space-y-3'>
                          <div className='flex items-center gap-2'>
                            <Layers className='h-4 w-4 text-[#2563eb] sm:h-5 sm:w-5' />
                            <span className='text-sm font-semibold text-[#1e293b] sm:text-base'>
                              Difficulty Levels
                            </span>
                          </div>
                          <div className='flex flex-wrap gap-1 sm:gap-2'>
                            {gameData.difficulties.map((item, i) => {
                              const difficultyStyles = {
                                beginner:
                                  'bg-[#10b981]/10 text-[#10b981] border-[#10b981]',
                                intermediate:
                                  'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]',
                                expert:
                                  'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]',
                              }
                              return (
                                <Badge
                                  key={i}
                                  className={`${difficultyStyles[item] || difficultyStyles.intermediate} rounded-[8px] border px-2 py-0.5 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md sm:px-3 sm:py-1 sm:text-sm`}
                                >
                                  {item.charAt(0).toUpperCase() + item.slice(1)}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Answer section */}
                      <div className='space-y-2 sm:space-y-3'>
                        <div className='flex items-center gap-2'>
                          <Target className='h-4 w-4 text-[#f59e0b] sm:h-5 sm:w-5' />
                          <span className='text-sm font-semibold text-[#1e293b] sm:text-base'>
                            Complete Answer
                          </span>
                        </div>
                        <div className='relative rounded-[8px] border border-[#e2e8f0] bg-white p-4 shadow-sm sm:p-5 md:p-6'>
                          <div className='absolute top-0 left-0 h-0.5 w-full rounded-t-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]'></div>
                          <p className='line-clamp-3 text-sm leading-relaxed font-medium text-[#1e293b] sm:text-base md:text-lg'>
                            "{gameData.answer}"
                          </p>
                        </div>
                      </div>

                      {/* Answer chunks section */}
                      {gameData?.answer_in_chunks?.length > 0 && (
                        <div className='space-y-3 sm:space-y-4'>
                          <div className='flex items-center gap-2'>
                            <Puzzle className='h-4 w-4 text-[#2563eb] sm:h-5 sm:w-5' />
                            <span className='text-sm font-semibold text-[#1e293b] sm:text-base'>
                              Answer Breakdown
                            </span>
                            <span className='text-xs text-[#64748b] sm:text-sm'>
                              ({gameData.answer_in_chunks.length} parts)
                            </span>
                          </div>
                          <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3'>
                            {gameData.answer_in_chunks.map((chunk, i) => (
                              <div
                                key={i}
                                className='group flex items-center gap-2 rounded-[8px] border border-[#e2e8f0] bg-white p-3 transition-all duration-200 hover:shadow-sm sm:gap-3'
                              >
                                <div className='flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-xs font-semibold text-white transition-transform duration-200 group-hover:scale-105 sm:h-8 sm:w-8 sm:text-sm'>
                                  {i + 1}
                                </div>
                                <span className='line-clamp-2 text-xs font-medium text-[#1e293b] sm:text-sm'>
                                  {chunk}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* Footer */}
                <DialogFooter className='relative border-t border-[#e2e8f0] px-4 pt-4 sm:px-5 sm:pt-5 md:px-6 md:pt-6'>
                  <DialogClose asChild>
                    <Button
                      size='sm'
                      variant='outline'
                      className='group w-full rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] shadow-sm transition-all duration-300 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 sm:w-auto'
                      onClick={() => {
                        console.log('Close button clicked')
                        if (typeof dispatch === 'function') {
                          dispatch(closeModal())
                        } else {
                          console.error('dispatch is undefined')
                        }
                      }}
                    >
                      <X className='mr-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-90 sm:mr-2 sm:h-4 sm:w-4' />
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={dialogType === 'logout-modal'}
        onOpenChange={() => dispatch(closeModal())}
      >
        <DialogContent className='rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl backdrop-blur-lg transition-all duration-300 sm:max-w-sm'>
          <DialogHeader className='text-left'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='flex items-center gap-2 text-2xl font-bold text-gray-800'>
                <LogOut className='h-6 w-6 text-red-500' />
                Logout
              </DialogTitle>
              <DialogClose asChild></DialogClose>
            </div>
            <DialogDescription className='mt-2 text-sm text-gray-500'>
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-4 flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full px-5 text-sm font-medium transition-colors duration-200 hover:bg-gray-100'
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              size='sm'
              variant='destructive'
              className='rounded-full bg-red-500 px-5 text-sm font-medium transition-colors duration-200 hover:bg-red-600'
              onClick={handleLogoutUser}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogWrapper
