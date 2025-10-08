import { Suspense } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getCookie } from '../../../shared/utils/helperFunction'
import Dashboard from './features/dashboard/index'

const queryClient = new QueryClient()
const token = getCookie('studentToken')
export const dashboardQueryOption = () =>
  queryOptions({
    queryKey: ['enrolled-courses-get', 'get-invoices-paid', 'course-teachers'],
    queryFn: async () => {
      try {
        const [overviewRes] = await Promise.all([
          axios.get(`/student/dashboard/overview?token=${token}`),
        ])

        const overview = overviewRes.data
        console.log('overView ==>', overview)
        return {
          enrolledCourses: overview?.data?.courses ?? [],
          paymentMethods: overview?.data?.paymentMethods ?? [],
          totalCharges: overview?.data?.totalCharges ?? 0,
          spendingByYear: overview?.data?.spendingByYear ?? [],
          courseTeachers: overview?.data?.courseTeachers ?? 0,
        }
      } catch (error) {
        console.error('error', error)
        return {
          enrolledCourses: [],
          totalCharges: 0,
          paymentMethods: [],
          courseTeachers: 0,
        }
      }
    },
  })

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">
      {/* Header Skeleton */}
      <div className="px-8 py-4 flex items-center justify-between space-x-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Welcome Banner Skeleton */}
      <div className="relative bg-gray-200 rounded-3xl overflow-hidden p-8 mb-8 shadow-lg">
        <Skeleton className="h-8 w-64 mb-4 rounded-md" />
        <Skeleton className="h-6 w-48 mb-6 rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="px-8">
        <div className="flex gap-2 overflow-x-auto mb-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-gray-200 bg-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Cards Skeleton (Spending / Payments / Plan) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-gray-200 bg-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border border-gray-200 bg-gray-100">
              <CardHeader>
                <Skeleton className="h-6 w-40 rounded-md mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
export const Route = createFileRoute('/_authenticated/student/')({
  loader: ({}) => queryClient.ensureQueryData(dashboardQueryOption()),
  component: () => {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    )
  },
})
