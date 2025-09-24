import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getCookie } from '../../../shared/utils/helperFunction'
import Dashboard from './features/dashboard/index'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Suspense } from 'react'

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
        console.log('overView ==>',overview)
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
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="flex items-center space-x-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </header>

      <main className="flex-grow px-6 py-6">
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          {/* Tabs Skeleton */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex space-x-2 border border-gray-200 bg-white p-1 shadow-sm">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-24 rounded bg-gray-200" />
              ))}
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Title & subtitle */}
            <div className="space-y-2 text-center">
              <div className="mx-auto h-8 w-48 rounded bg-gray-200" />
              <div className="mx-auto h-4 w-80 rounded bg-gray-200" />
            </div>

            {/* Top 4 Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="border border-gray-100 bg-white shadow-sm"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gray-200" />
                      <div>
                        <div className="mb-1 h-3 w-20 rounded bg-gray-200" />
                        <div className="h-5 w-12 rounded bg-gray-200" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 w-full rounded bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="opacity-20" />

            {/* Premium Features Tag */}
            <div className="py-2 text-center">
              <div className="mx-auto h-6 w-40 rounded-full bg-gray-200" />
            </div>

            {/* Bottom 3 Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="border border-gray-100 bg-white shadow-sm"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gray-200" />
                      <div>
                        <div className="mb-1 h-3 w-20 rounded bg-gray-200" />
                        <div className="h-5 w-16 rounded bg-gray-200" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 w-full rounded bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
              {/* Wide Active Plan card */}
              <Card className="border border-gray-100 bg-white shadow-sm lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-gray-200" />
                    <div>
                      <div className="mb-1 h-3 w-20 rounded bg-gray-200" />
                      <div className="h-5 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 w-full rounded bg-gray-200" />
                  <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Title */}
            <div className="space-y-2 text-center">
              <div className="mx-auto h-8 w-56 rounded bg-gray-200" />
              <div className="mx-auto h-4 w-72 rounded bg-gray-200" />
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border border-gray-100 bg-white shadow-sm">
                  <CardHeader>
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 w-full rounded bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Spending Analysis Skeleton */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="h-4 w-40 rounded bg-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full rounded bg-gray-200" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
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
