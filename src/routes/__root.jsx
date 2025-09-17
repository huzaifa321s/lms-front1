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
        <Toaster duration={5000} position='top-center' />
        {import.meta.env.MODE === 'development' && (
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
