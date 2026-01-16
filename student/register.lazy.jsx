import { createLazyFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const SignUp = lazy(() => import('@/features/auth/sign-up'))
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createLazyFileRoute('/student/register')({
  component: RouteComponent,
})

 function RouteComponent() {
  return (
    <>
    <Suspense
          fallback={
           <Skeleton className="h-full w-full mx-20 rounded-2xl" />
          }
        >
    <SignUp/>
    </Suspense>
    </>
  )
}