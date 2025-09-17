
import { useSuspenseQuery } from "@tanstack/react-query"
import { IconLock } from "@tabler/icons-react"
import {
  BookOpen,
  CheckSquare,
  CreditCard,
  DollarSign,
  ShieldCheck,
  UserCog,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { TopNav } from "@/components/layout/top-nav"
import { Search } from "@/components/search"
import { dashboardQueryOption } from "../.."
import { useAppUtils } from "../../../../../hooks/useAppUtils"
import { openModal } from "../../../../../shared/config/reducers/student/studentDialogSlice"
import { Show } from "../../../../../shared/utils/Show"
import { ProfileDropdown } from "../tasks/-components/student-profile-dropdown"
import { ChartBarLabelCustom } from "./-components/spendingByYear"

const MiniBarChart = ({ data, color = "#2563eb" }: { data: number[]; color?: string }) => (
  <div className="flex items-end gap-1 h-8">
    {data.map((value, index) => (
      <div
        key={index}
        className="w-2 rounded-t-sm transition-all duration-300 hover:opacity-80"
        style={{
          height: `${(value / Math.max(...data)) * 100}%`,
          backgroundColor: color,
          minHeight: "4px",
        }}
      />
    ))}
  </div>
)

const MiniLineChart = ({ data, color = "#10b981" }: { data: number[]; color?: string }) => (
  <div className="relative h-8 w-full">
    <svg className="w-full h-full" viewBox="0 0 100 30">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={data
          .map((value, index) => `${(index / (data.length - 1)) * 100},${30 - (value / Math.max(...data)) * 25}`)
          .join(" ")}
      />
      {data.map((value, index) => (
        <circle
          key={index}
          cx={(index / (data.length - 1)) * 100}
          cy={30 - (value / Math.max(...data)) * 25}
          r="2"
          fill={color}
        />
      ))}
    </svg>
  </div>
)

const MiniDonutChart = ({ percentage, color = "#f59e0b" }: { percentage: number; color?: string }) => {
  const circumference = 2 * Math.PI * 16
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle cx="24" cy="24" r="16" stroke="#e5e7eb" strokeWidth="3" fill="transparent" />
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold">{percentage}%</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { dispatch, navigate } = useAppUtils()
  // include dispatch as dependency
  const { data, fetchStatus } = useSuspenseQuery(dashboardQueryOption())
  const { enrolledCourses, totalCharges, paymentMethods, courseTeachers, spendingByYear } = data
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)
 console.log('subscription ===>',subscription)
  const courseProgressData = [65, 78, 82, 90, 85, 92, 88]
  const spendingTrendData = [120, 150, 180, 160, 200, 250, 220]
  const quizScoreData = [85, 90, 78, 95, 88, 92, 96]

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        {/* ===== Main ===== */}

        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="bg-white border border-gray-200 shadow-sm">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Activity Log (Dummy)
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications (Dummy)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
  Student Dashboard
</h1>
              <p className="text-gray-600 font-medium">Track your learning progress and achievements</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Enrolled Courses Card */}
              <Card className="group relative overflow-hidden border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                        <p className="text-2xl font-bold text-blue-600">{enrolledCourses || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <MiniBarChart data={courseProgressData} color="#2563eb" />
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="text-sm font-semibold text-green-600">+12%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Teachers Card */}
              <Card className="group relative overflow-hidden border border-green-100 bg-gradient-to-br from-white to-green-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <UserCog className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Teachers</p>
                        <p className="text-2xl font-bold text-green-600">{courseTeachers?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <MiniLineChart data={[3, 5, 4, 6, 5, 7, 6]} color="#10b981" />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-6 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      onClick={() => {
                        if (!subscription?.subscriptionId || subscription?.status !== 'active') {
                          dispatch(
                            openModal({
                              type: "subscription-modal",
                              props: {
                                title: "Subscribe to view teachers",
                                redirect: "/student/course-teachers",
                                courseTeachers: courseTeachers,
                              },
                            }),
                          )
                        } else {
                          navigate({
                            to: "/student/course-teachers/",
                            search: {
                              courseTeachers: JSON.stringify(courseTeachers),
                            },
                          })
                        }
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Attempts Card */}
              <Card className="group relative overflow-hidden border border-yellow-100 bg-gradient-to-br from-white to-yellow-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <CheckSquare className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Quiz Score <span className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
  Demo Feature
</span>
</p>
                        <p className="text-2xl font-bold text-yellow-600">87%</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <MiniBarChart data={quizScoreData} color="#f59e0b" />
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs text-gray-500">Avg Score</p>
                      <p className="text-sm font-semibold text-yellow-600">87%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Card */}
              <Card className="group relative overflow-hidden border border-purple-100 bg-gradient-to-br from-white to-purple-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Overall Progress<span className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
  Demo Feature
</span>
</p>
                        <p className="text-2xl font-bold text-purple-600">73%</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: "73%" }}
                        ></div>
                      </div>
                    </div>
                    <MiniDonutChart percentage={73} color="#9333ea" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="opacity-20" />

            <div className="text-center py-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 shadow-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
                  Premium Features
                </p>
                <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Spendings Card */}
              <Card className="group relative overflow-hidden border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Spending</p>
                        <Show>
                          <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}>
                            <p className="text-2xl font-bold text-blue-600">${totalCharges || 0}</p>
                          </Show.When>
                          <Show.Else>
                            <div className="flex items-center gap-1">
                              <IconLock className="h-4 w-4 text-gray-400" />
                              <p className="text-sm text-gray-500">Locked</p>
                            </div>
                          </Show.Else>
                        </Show>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Show>
                    <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <MiniLineChart data={spendingTrendData} color="#2563eb" />
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-xs text-gray-500">This Month</p>
                          <p className="text-sm font-semibold text-green-600">+8%</p>
                        </div>
                      </div>
                    </Show.When>
                    <Show.Else>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                        onClick={() => {
                          dispatch(
                            openModal({
                              type: "subscription-modal",
                              props: {
                                title: "Subscribe to view spendings",
                                redirect: "/student",
                              },
                            }),
                          )
                        }}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Subscribe
                      </Button>
                    </Show.Else>
                  </Show>
                </CardContent>
              </Card>

              {/* Payment Methods Card */}
              <Card className="group relative overflow-hidden border border-green-100 bg-gradient-to-br from-white to-green-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Payment Methods</p>
                        <Show>
                          <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}>
                            <p className="text-2xl font-bold text-green-600">{paymentMethods?.length || 0}</p>
                          </Show.When>
                          <Show.Else>
                            <div className="flex items-center gap-1">
                              <IconLock className="h-4 w-4 text-gray-400" />
                              <p className="text-sm text-gray-500">Locked</p>
                            </div>
                          </Show.Else>
                        </Show>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Show>
                    <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}

>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                        onClick={() => navigate({ to: "/student/payment-methods" })}
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        View Methods
                      </Button>
                    </Show.When>
                    <Show.Else>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                        onClick={() => {
                          dispatch(
                            openModal({
                              type: "subscription-modal",
                              props: {
                                title: "Subscribe to view methods",
                                redirect: "/student/payment-methods",
                              },
                            }),
                          )
                        }}
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Subscribe
                      </Button>
                    </Show.Else>
                  </Show>
                </CardContent>
              </Card>

              {/* Active Plan Card */}
              <Card className="group relative overflow-hidden border border-yellow-100 bg-gradient-to-br from-white to-yellow-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <ShieldCheck className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Plan</p>
                        <Show>
                          <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}>
                            <p className="text-lg font-bold text-yellow-600">
                              {subscription?.name || "N/A"}
                            </p>
                          </Show.When>
                          <Show.Else>
                            <div className="flex items-center gap-1">
                              <IconLock className="h-4 w-4 text-gray-400" />
                              <p className="text-sm text-gray-500">No Active Plan</p>
                            </div>
                          </Show.Else>
                        </Show>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Show>
                    <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Renews on</p>
                          <p className="text-sm font-semibold">
                            {subscription?.currentPeriodEnd
                              ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString("en-US")
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            {subscription?.status?.toUpperCase() || "N/A"}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs border-yellow-200 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                        onClick={() => navigate({ to: "/student/settings/billing" })}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Manage Plan
                      </Button>
                    </Show.When>
                    <Show.Else>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs border-yellow-200 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                        onClick={() => {
                          dispatch(
                            openModal({
                              type: "subscription-modal",
                              props: {
                                title: "Subscribe to update plan",
                                redirect: "/student/settings/billing",
                              },
                            }),
                          )
                        }}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Subscribe Now
                      </Button>
                    </Show.Else>
                  </Show>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 bg-clip-text text-3xl font-bold text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 font-medium">Detailed insights into your learning journey</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Performance Trends */}
              <Card className="border border-green-100 bg-gradient-to-br from-white to-green-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trends <span className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
  Demo Feature
</span>

                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-24">
                      <MiniLineChart data={[75, 82, 78, 85, 90, 88, 92]} color="#10b981" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last 7 days</span>
                      <span className="font-semibold text-green-600">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Time */}
              <Card className="border border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Calendar className="h-5 w-5" />
                    Study Time <span className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
  Demo Feature
</span>

                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">24.5h</p>
                      <p className="text-sm text-gray-600">This week</p>
                    </div>
                    <div className="h-16">
                      <MiniBarChart data={[3, 4, 2, 5, 6, 3, 4]} color="#2563eb" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Rate */}
              <Card className="border border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Award className="h-5 w-5" />
                    Achievement Rate <span className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
  Demo Feature
</span>

                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-4">
                    <MiniDonutChart percentage={85} color="#9333ea" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">85%</p>
                      <p className="text-sm text-gray-600">Completion rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full">
              <Show>
                <Show.When isTrue={subscription?.subscriptionId && subscription?.status === 'active'}>
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800">Spending Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartBarLabelCustom spendingByYear={spendingByYear} />
                    </CardContent>
                  </Card>
                </Show.When>
                <Show.Else>
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800">Spending Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <IconLock className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-700">Feature Locked</p>
                          <p className="text-gray-600">Subscribe to unlock detailed spending analytics</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            dispatch(
                              openModal({
                                type: "subscription-modal",
                                props: {
                                  title: "Subscribe to view analytics",
                                  redirect: "/student",
                                },
                              }),
                            )
                          }}
                        >
                          Subscribe Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Show.Else>
              </Show>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: "Overview",
    href: "/student",
    isActive: true,
    disabled: false,
  },
  {
    title: "Courses",
    href: "/student/enrolledcourses",
    isActive: false,
    disabled: false,
  },
  {
    title: "Quizzes (Dummy)",
    href: "dashboard/products",
    isActive: false,
    disabled: true,
  },
  {
    title: "Settings",
    href: "/student/settings",
    isActive: false,
    disabled: false,
  },
]
