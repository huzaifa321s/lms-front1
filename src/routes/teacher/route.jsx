import { Suspense } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SmallLoader } from '@/components/ui/loader'

export const Route = createFileRoute('/teacher')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Suspense fallback={<SmallLoader />}>
        <Outlet />
      </Suspense>
    </>
  )
}
