import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import Dashboard from './features/dashboard'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Suspense } from 'react'

const queryClient = new QueryClient()

export const cardQueryOptions = () =>
  queryOptions({
    queryKey: ['cards', 'courses-by-students', 'monthly-enrolled-students'],
queryFn: async () => {
  try {
    const [cardsRes, coursesRes, monthlyRes] = await Promise.all([
      axios.get('/teacher/dashboard/cards'),
      axios.get('/teacher/dashboard/courses-by-students'),
      axios.get('/teacher/dashboard/monthly-enrolled-students')
    ])

    return {
      card: cardsRes.data.success ? cardsRes.data.data : null,
      dounutData: coursesRes.data.success
        ? coursesRes.data.data
        : { coursesLabels: [], studentsCount: [], borderColor: [], backgroundColor: [] },
      monthlyEnrollments: monthlyRes.data?.data || []
    }
  } catch {
    return {
      card: null,
      dounutData: { coursesLabels: [], studentsCount: [], borderColor: [], backgroundColor: [] },
      monthlyEnrollments: []
    }
  }
}

  })


  
  
 export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] relative">
      <div className="p-6 space-y-8">
        {/* Page Heading */}
        <Skeleton className="h-8 w-40" />

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2">
          {["Overview", "Analytics", "Reports", "Notifications"].map((tab, i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
        </div>

        {/* ---- Overview ---- */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-24" />
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </CardFooter>
          </Card>
        </div>

        {/* ---- Analytics ---- */}
        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-md" />
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-20" />
              </Card>
            ))}
          </div>
        </div>

        {/* ---- Reports ---- */}
        <Card className="p-6">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ---- Notifications ---- */}
        <Card className="p-6">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teacher/')({
  loader:() => queryClient.ensureQueryData(cardQueryOptions()),
  component: () => {
    return (
         <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
    )
  },
})
