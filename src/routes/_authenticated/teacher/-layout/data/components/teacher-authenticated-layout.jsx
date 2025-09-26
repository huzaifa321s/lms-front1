import { Suspense } from 'react'
import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'

import SkipToMain from '@/components/skip-to-main'
import DialogWrapper from '../../../-components/DialogWrapper'
import { useSelector } from 'react-redux'
import { AppSidebar } from './teacher-app-sidebar'
import { Loader2 } from 'lucide-react'
export function SmallLoader() {
  return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
       <Loader2 className="h-12 w-12 animate-spin text-white" />
    </div>
  )
}
export function AuthenticatedLayout({ children }) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const selector = useSelector((state) => state.teacherDialogSlice);
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
          {selector.isOpen && 
          <DialogWrapper
            modalType={selector.type}
            isOpen={selector.isOpen}
            modalData={selector.props}
            onClose={selector.onAction}
          />}
          <Suspense fallback={ <SmallLoader/> }>{children ? children : <Outlet />}</Suspense>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
