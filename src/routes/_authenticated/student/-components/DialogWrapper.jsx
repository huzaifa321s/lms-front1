import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { LogOut, LogOutIcon } from 'lucide-react'
import { shallowEqual, useSelector } from 'react-redux'
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
import { getSidebarData } from '../../../../components/layout/data/sidebar-data'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { handleLogoutAdmin } from '../../../../shared/config/reducers/admin/adminAuthSlice'
import {
  handleLogout,
  updateSubscription,
} from '../../../../shared/config/reducers/student/studentAuthSlice'
import { closeModal } from '../../../../shared/config/reducers/student/studentDialogSlice'
import { handleLogoutTeacher } from '../../../../shared/config/reducers/teacher/teacherAuthSlice'
import { getCookie } from '../../../../shared/utils/helperFunction'
import { paymentMethodsQueryOptions } from '../payment-methods'
import { DialogSkeleton } from './modals/DialogSkeleton'

const UpdateSubscriptionDialog = lazy(
  () => import('./modals/UpdateSubscriptionPlan')
)
const DetachPaymentMethodDialog = lazy(
  () => import('./modals/DetachPaymentMethod')
)
const AddPaymentMethodDialog = lazy(() => import('./modals/AddPaymentMethod'))
const CancelSubscriptionDialog = lazy(() => import('./modals/CancelPlan'))
const SubscriptionDialog = lazy(() => import('./modals/SubscriptionModal'))
const ActivateSubscriptionDialog = lazy(
  () => import('./modals/ActivateSubscriptionModal')
)
const GameViewDialog = lazy(() => import('./modals/GameView'))

const DialogWrapper = ({ isOpen, modalType, modalData }) => {
  const [dialogType, setDialogType] = useState(modalType)
  const { navigate, dispatch } = useAppUtils()
  const queryClient = useQueryClient()
  const [defaultCheck, setDefaultCheck] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  let stripe = null
  let elements = null
  if (dialogType === 'add-payment-method') {
    stripe = useStripe()
    elements = useElements()
  }
  const credentials = useSelector(
    (state) => state.studentAuth.credentials,
    shallowEqual
  )
  const subscription = useSelector(
    (state) => state.studentAuth.subscripiton,
    shallowEqual
  )
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
      return
    }

    if (!subscription) {
      const currentSubscritpion = getCookie('studentSubscription')
      if (currentSubscritpion?.status === 'canceled') {
        navigate({
          to: '/student/resubscription-plans',
          replace: true,
          search: { redirect: modalData?.redirect },
        })
        dispatch(closeModal())
        return
      }
    }

    // Case 2: Existing customer but subscription issue
    if (subscription?.subscriptionId && subscription.status === 'canceled') {
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
    if (
      subscription?.status === 'past_due' ||
      subscription?.status === 'unpaid' ||
      subscription?.status === 'incomplete'
    ) {
      console.log('condtion')
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
      navigate({ to: '/' })
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
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='xs'
            h='xs'
          />
        }
      >
        {dialogType === 'detach-payment-method' && (
          <DetachPaymentMethodDialog
            confirmDetach={confirmDetach}
            cardDetach={cardDetach}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='xs'
            h='xs'
          />
        }
      >
        {dialogType === 'add-payment-method' && (
          <AddPaymentMethodDialog
            handleSubmitCard={handleSubmitCard}
            cardElementOptions={cardElementOptions}
            handleChange={handleChange}
            defaultCheck={defaultCheck}
            setDefaultCheck={setDefaultCheck}
            stripe={stripe}
            cardComplete={cardComplete}
            saveCardDetailsMutation={saveCardDetailsMutation}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='sm'
          />
        }
      >
        {dialogType === 'update-subscription-modal' && (
          <UpdateSubscriptionDialog
            handleSubmitUpdation={handleSubmitUpdation}
            planUpdate={planUpdate}
            modalData={modalData}
          />
        )}
      </Suspense>

      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='sm'
          />
        }
      >
        {dialogType === 'cancel-subscription-modal' && (
          <CancelSubscriptionDialog
            handleSubmitCancelation={handleSubmitCancelation}
            planCancel={planCancel}
            closeModal={() => dispatch(closeModal())}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='md'
          />
        }
      >
        {dialogType === 'subscription-modal' && (
          <SubscriptionDialog
            handleGoToSubscription={handleGoToSubscription}
            planUpdate={planUpdate}
            closeModal={() => dispatch(closeModal())}
            navigate={navigate}
            modalData={modalData}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='md'
          />
        }
      >
        {dialogType === 'activate-subscription-modal' && (
          <ActivateSubscriptionDialog
            closeModal={() => dispatch(closeModal())}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='md'
          />
        }
      >
        {dialogType === 'game-view' && (
          <GameViewDialog
            closeModal={() => dispatch(closeModal())}
            gameData={gameData}
            gameIsError={gameIsError}
            gameIsFetching={gameIsFetching}
            gameFetchStatus={gameFetchStatus}
            gameFetchingError={gameFetchingError}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='md'
          />
        }
      >
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
      </Suspense>
      <Suspense
        fallback={
          <DialogSkeleton
            onClose={() => dispatch(closeModal())}
            maxWidth='sm'
            h='sm'
          />
        }
      >
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
                <LogOutIcon /> Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Suspense>
    </>
  )
}

export default DialogWrapper
