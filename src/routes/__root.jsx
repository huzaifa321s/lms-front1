import { lazy, Suspense } from 'react'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Toaster } from 'sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '../routes/_authenticated/student/features/errors/general-error'
import NotFoundError from '../routes/_authenticated/student/features/errors/not-found-error'

const DialogWrapper = lazy(
  () => import('./_authenticated/student/-components/DialogWrapper')
)

export const Route = createRootRouteWithContext()({
  component: () => {
    const selector = useSelector((state) => state.studentDialogSlice)
    console.log('selector.type', selector.type)
    let stripePromise = ''
    if (selector.type === 'add-payment-method') {
      stripePromise = loadStripe(
        'pk_test_51P5zAtEdtHnRsYCMJUdZJ5Q6m6KA1LQfPxXsnKweKFvWiSsYMpEG4yRmG5jmzaBo0VBUeQSS5DTSBDDfnzLsiWGu00U3zAzcBU'
      )
    }

    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Suspense fallback={<div>Loading...</div>}>
          {selector.isOpen &&
            (selector.type === 'add-payment-method' ? (
              <Elements stripe={stripePromise}>
                <DialogWrapper
                  modalType={selector.type}
                  isOpen={selector.isOpen}
                  modalData={selector.props}
                  onClose={selector.onAction}
                />
              </Elements>
            ) : (
              <DialogWrapper
                modalType={selector.type}
                isOpen={selector.isOpen}
                modalData={selector.props}
                onClose={selector.onAction}
              />
            ))}
        </Suspense>

        <Toaster
          duration={5000}
          position='top-center'
          richColors
          icons={{
            success: <CheckCircle className='h-5 w-5' />,
            error: <XCircle className='h-5 w-5' />,
            warning: <AlertCircle className='h-5 w-5' />,
            info: <Info className='h-5 w-5' />,
            loading: (
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ),
          }}
          toastOptions={{
            style: {
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '15px',
              fontWeight: '500',
              boxShadow:
                '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '420px',
              minHeight: '56px',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease-in-out',
            },
            classNames: {
              success:
                'bg-gradient-to-r from-emerald-500/90 to-green-600/90 border-emerald-400/30 text-white shadow-emerald-500/25',
              error:
                'bg-gradient-to-r from-red-500/90 to-rose-600/90 border-red-400/30 text-white shadow-red-500/25',
              warning:
                'bg-gradient-to-r from-amber-500/90 to-orange-600/90 border-amber-400/30 text-white shadow-amber-500/25',
              info: 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 border-blue-400/30 text-white shadow-blue-500/25',
              default:
                'bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-slate-600/30 text-white shadow-slate-500/25',
              loading:
                'bg-gradient-to-r from-purple-500/90 to-violet-600/90 border-purple-400/30 text-white shadow-purple-500/25',
            },
          }}
          theme='light'
          expand={true}
          visibleToasts={4}
          closeButton={true}
        />
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
