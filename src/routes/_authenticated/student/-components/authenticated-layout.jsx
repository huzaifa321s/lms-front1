import { Suspense } from 'react'
import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { LoaderThree } from '@/components/ui/loader'
import { BackgroundCircles } from '@/components/ui/shadcn-io/background-circles'
import { SidebarProvider } from '@/components/ui/sidebar'
import SkipToMain from '@/components/skip-to-main'
import { AppSidebar } from './app-sidebar'
import { SmallLoader } from '../../teacher/-layout/data/components/teacher-authenticated-layout'

export function AuthenticatedLayout({ children, role }) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const bgTitle = useSelector((state) => state.bgSlice.title);

  return (
    <>
    
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
         

              {children ? children : <Outlet />}
         
          </div>
        </SidebarProvider>
      </SearchProvider>
    </>
  )
}
