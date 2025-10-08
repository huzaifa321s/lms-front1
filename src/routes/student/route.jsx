import { Suspense } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SmallLoader } from '@/components/ui/loader'
import { NavbarRouteComponent } from '../-NavbarRouteComponent'
import { Footer } from './Footer'

export const Route = createFileRoute('/student')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<SmallLoader />}>
      <div className='flex min-h-screen flex-col'>
        <NavbarRouteComponent />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </Suspense>
  )
}
