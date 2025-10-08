import { Suspense } from 'react'
import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { LoaderThree } from '@/components/ui/loader'
import { SidebarProvider } from '@/components/ui/sidebar'
import SkipToMain from '@/components/skip-to-main'
import DialogWrapper from '../-components/DialogWrapper'

import { AppSidebar } from './admin-app-sidebar'
import { SmallLoader } from '../../teacher/-layout/data/components/teacher-authenticated-layout'

export function AuthenticatedLayout({ children }) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const selector = useSelector((state) => state.dialogSlice)
 

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          {selector.isOpen && (
            <DialogWrapper
              modalType={selector.type}
              isOpen={selector.isOpen}
              modalData={selector.props}
              onClose={selector.onAction}
            />
          )}
          <Suspense
            fallback={<SmallLoader />}
          >
            {children ? children : <Outlet />}

          </Suspense>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
