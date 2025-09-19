import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useSelector } from 'react-redux'
import { Toaster } from 'sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '../routes/_authenticated/student/features/errors/general-error'
import NotFoundError from '../routes/_authenticated/student/features/errors/not-found-error'
import DialogWrapper from './_authenticated/student/-components/DialogWrapper'

export const Route = createRootRouteWithContext()({
  component: () => {
    const selector = useSelector((state) => state.studentDialogSlice)

    return (
      <>
        <NavigationProgress />
        <Outlet />
        {selector.isOpen && (
          <DialogWrapper
            modalType={selector.type}
            isOpen={selector.isOpen}
            modalData={selector.props}
            onClose={selector.onAction}
          />
        )}
<Toaster
  duration={5000}
  position="top-center"
  richColors
  toastOptions={{
    style: {
      borderRadius: 'var(--border-radius-card)', // 12px
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: 'var(--shadow-card)', // 0 4px 6px rgba(0, 0, 0, 0.05)
      backdropFilter: 'blur(8px)',
      border: 'var(--border-card)', // 1px solid #e2e8f0
      maxWidth: '400px',
      color: 'var(--text-primary)', // #1e293b for consistent dark text
      fontFamily: 'var(--font-family)', // Segoe UI, Tahoma, Geneva, Verdana, sans-serif
    },
    classNames: {
      success: 'bg-gradient-to-r from-[var(--color-success-green)] to-[#059669] border-[var(--color-success-green)] text-[var(--text-primary)]', // Green gradient, dark text
      error: 'bg-gradient-to-r from-[var(--color-danger-red)] to-[#dc2626] border-[var(--color-danger-red)] text-[var(--text-primary)]', // Red gradient, dark text
      info: 'bg-gradient-to-r from-[var(--color-warning-yellow)] to-[#d97706] border-[var(--color-warning-yellow)] text-[var(--text-primary)]', // Yellow gradient, dark text
      warning: 'bg-gradient-to-r from-[var(--color-warning-yellow)] to-[#d97706] border-[var(--color-warning-yellow)] text-[var(--text-primary)]', // Yellow gradient, dark text
      default: 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[#1d4ed8] border-[var(--color-primary-blue)] text-[var(--text-primary)]', // Blue gradient, dark text
    },
  }}
/>        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
