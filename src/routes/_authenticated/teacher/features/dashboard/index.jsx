import { lazy, Suspense, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart3,
  BookOpen,
  Gamepad,
  LayoutDashboard,
  Plus,
  Settings,
  User,
   GraduationCap, 
   AlignJustify,
   Accessibility,
   Newspaper,
   CircleDollarSign,
   Wallet,
   Info
} from 'lucide-react'
import { shallowEqual, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { cardQueryOptions } from '../..'
import { useAppUtils } from '../../../../../hooks/useAppUtils.jsx'
import './index.css'

const ProfileDropdown = lazy(
  () => import('../../../../teacher/-components/teacher-profile-dropdown.jsx')
)
const ChartPieLabel = lazy(
  () => import('./-components/ChartCourseByStudents.jsx')
)
const TopCourseChart = lazy(() => import('./-components/TopCourseChart.jsx'))
const ChartBarDefault = lazy(() => import('./-components/overview'))
const CountUp = lazy(() => import('react-countup'))

function WelcomeBanner({ userName, creds }) {
  return (
     <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
      {/* Floating Decorative Circles */}
      <div className="absolute -top-16 -left-16 h-56 w-56 animate-[spin_25s_linear_infinite] rounded-full bg-blue-400/20 blur-3xl filter"></div>
      <div className="absolute -right-16 -bottom-16 h-72 w-72 animate-[spin_30s_linear_infinite] rounded-full bg-blue-500/20 blur-3xl filter"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h1 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold md:justify-start md:text-4xl">
            <GraduationCap className="h-7 w-7 text-yellow-300 drop-shadow-sm" />
            Welcome {creds?.customerId ? "back" : ""},{" "}
            <span className="text-blue-200">{userName}</span> 👩‍🏫
          </h1>

          <p className="max-w-lg text-lg text-blue-100 flex items-center justify-center gap-2 md:justify-start">
            <BookOpen className="h-5 w-5 text-blue-200" />
            Manage your courses, track student progress, and share your knowledge with learners worldwide.
          </p>
        </div>

        {/* Right Section – Buttons */}
        <div className="flex flex-wrap justify-center gap-4 md:justify-end">
          {/* Manage Courses */}
          <Button
            size="sm"
          >
            <BookOpen className="h-5 w-5" />
            Manage Courses
          </Button>

          {/* Profile */}
          <Button
            size="sm"
            variant="outline"
            className="text-black"
          >
            <User className="h-5 w-5" />
            My Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const isFirstRender = useRef(true)
  const { data } = useQuery({
    ...cardQueryOptions(),
    suspense: isFirstRender.current,
  })
  const { navigate } = useAppUtils()
  const { card, dounutData, monthlyEnrollments } = data
  const credentials = useSelector(
    (state) => state.teacherAuth.credentials,
    shallowEqual
  )
  console.log('credentials teacher', credentials)
  console.log('card', card)
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" /> */}
          <Suspense
            fallback={
              <div className='h-6 w-20 animate-pulse rounded bg-gray-200'></div>
            }
          >
            <ProfileDropdown className='text-[#64748b] transition-all duration-300 hover:text-[#2563eb]' />
          </Suspense>
        </div>
      </Header>
      <div className='relative min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]'>
        {/* ===== Main ===== */}
        <Main className='p-6'>
          <WelcomeBanner
            userName={credentials?.firstName + ' ' + credentials?.lastName}
            creds={credentials}
          />
          <Tabs
            orientation='vertical'
            defaultValue='overview'
            className='space-y-2'
          >
            <div className='w-full overflow-x-auto pb-2'>
              <TabsList className='flex gap-2 bg-transparent'>
                <TabsTrigger
                  value='overview'
                  className='rounded-[8px] px-4 py-2 font-medium text-[#64748b] transition-all duration-300 hover:bg-[#2563eb]/10 hover:text-[#2563eb] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_6px_rgba(0,0,0,0.05)]'
                >
                  <LayoutDashboard /> Overview
                </TabsTrigger>
                <TabsTrigger
                  value='analytics'
                  className='rounded-[8px] px-4 py-2 font-medium text-[#64748b] transition-all duration-300 hover:bg-[#2563eb]/10 hover:text-[#2563eb] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_6px_rgba(0,0,0,0.05)]'
                >
                  <BarChart3 /> Analytics
                </TabsTrigger>
                <TabsTrigger
                  value='reports'
                  disabled
                  className='cursor-not-allowed rounded-[8px] px-4 py-2 font-medium text-[#64748b]/50'
                >
                  Reports
                </TabsTrigger>
                <TabsTrigger
                  value='notifications'
                  disabled
                  className='cursor-not-allowed rounded-[8px] px-4 py-2 font-medium text-[#64748b]/50'
                >
                  Notifications
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent
              value='overview'
              className='space-y-2'
              forceMount={false}
            >
              <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-3xl'>
                Dashboard
              </h1>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {/* Points Overview Card */}
                <Card className='relative rounded-[8px] bg-white/95 p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
                  <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='relative z-10'>
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-bold text-[#1e293b]'>
                        Points Overview
                      </h3>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white'>
                        ⭐
                      </div>
                    </div>
                    <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent'>
                      <Suspense
                        fallback={<span className='text-gray-400'>...</span>}
                      >
                        <CountUp
                          end={card.points}
                          className='counter-value inline-block'
                        />
                      </Suspense>
                    </div>
                    <div className='mt-2 text-sm text-[#64748b]'>
                      Total Points
                    </div>
                    <div className='mt-4 text-sm text-[#64748b]'>
                      Points per Enrollment:{' '}
                      <strong className='text-[#1e293b]'>10</strong>
                    </div>
                  </div>
                </Card>

                {/* Created Courses Card */}
                <Card className='relative rounded-[8px] bg-white/95 p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
                  <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='relative z-10'>
                    <div className='mb-4 flex items-center justify-between'>
                      <div>
                        <h3 className='text-lg font-bold text-[#1e293b]'>
                          Created Courses
                        </h3>
                        <div className='h-1 w-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]'></div>
                      </div>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12'>
                       <AlignJustify className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent'>
                      <Suspense
                        fallback={<span className='text-gray-400'>...</span>}
                      >
                        <CountUp
                          end={card.myCoursesCount}
                          className='counter-value inline-block'
                        />{' '}
                      </Suspense>
                    </div>
                    <p className='mt-2 text-sm text-[#64748b]'>
                      Courses I've Created
                    </p>
                  </div>
                </Card>

                {/* Student Enrollment Card */}
                <Card className='relative rounded-[8px] bg-white/95 p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
                  <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='relative z-10 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='text-lg font-bold text-[#1e293b]'>
                          Student Enrollment
                        </h3>
                        <div className='h-1 w-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]'></div>
                      </div>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12'>
                       <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4'>
                        <div>
                          <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent'>
                            <Suspense
                              fallback={
                                <span className='text-gray-400'>...</span>
                              }
                            >
                              <CountUp
                                end={card.enrolledStudentsCount.toLocaleString()}
                                className='counter-value inline-block'
                              />{' '}
                            </Suspense>
                          </div>
                          <p className='text-sm text-[#64748b]'>
                            Total Students Enrolled
                          </p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10'>
                          <Accessibility className="w-5 h-5 text-[#2563eb]" />
                        </div>
                      </div>
                      <div className='flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4'>
                        <div>
                          <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent'>
                            <Suspense
                              fallback={
                                <span className='text-gray-400'>...</span>
                              }
                            >
                              <CountUp
                                end={card.studentsEnrolledThisWeek}
                                className='counter-value inline-block'
                              />{' '}
                            </Suspense>
                          </div>
                          <p className='text-sm text-[#64748b]'>
                            New Students This Week
                          </p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10'>
                         <Newspaper className="w-5 h-5 text-[#2563eb]" />
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-[#64748b]'>
                          Weekly Growth Rate
                        </span>
                        <div className='flex items-center gap-1'>
                          <Newspaper className="w-5 h-5 text-[#2563eb]" />
                          <span className='font-semibold text-[#10b981]'>
                            {(
                              (card.studentsEnrolledThisWeek /
                                card.enrolledStudentsCount) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Earnings Overview Card */}
                <Card className='relative rounded-[8px] bg-white/95 p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
                  <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                  <div className='relative z-10 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='text-lg font-bold text-[#1e293b]'>
                          Earnings Overview{' '}
                          <span className='text-sm text-[#64748b]'>
                            (Demo Feature)
                          </span>
                        </h3>
                        <div className='h-1 w-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]'></div>
                      </div>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12'>
                      <CircleDollarSign className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4'>
                        <div>
                          <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent'>
                            ${' '}
                            <Suspense
                              fallback={
                                <span className='text-gray-400'>...</span>
                              }
                            >
                              <CountUp
                                end={324}
                                duration={4}
                                className='counter-value inline-block'
                              />{' '}
                            </Suspense>
                          </div>
                          <p className='text-sm text-[#64748b]'>
                            Total Earnings (All Time)
                          </p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10'>
                         <CircleDollarSign className="text-[#2563eb]" />
                        </div>
                      </div>
                      <div className='flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4'>
                        <div>
                          <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent'>
                            ${' '}
                            <Suspense
                              fallback={
                                <span className='text-gray-400'>...</span>
                              }
                            >
                              <CountUp
                                end={234}
                                duration={4}
                                className='counter-value inline-block'
                              />
                            </Suspense>
                          </div>
                          <p className='text-sm text-[#64748b]'>
                            Earnings This Month
                          </p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10'>
                        <Wallet className="w-5 h-5 text-[#2563eb]" />
                        </div>
                      </div>
                      <div className='flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4'>
                        <div>
                          <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent'>
                            ${' '}
                            <Suspense
                              fallback={
                                <span className='text-gray-400'>...</span>
                              }
                            >
                              <CountUp
                                end={234}
                                duration={4}
                                className='counter-value inline-block'
                              />
                            </Suspense>
                          </div>
                          <p className='text-sm text-[#64748b]'>
                            Pending Payouts
                          </p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10'>
                      <Info className="w-5 h-5 text-[#2563eb]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Separator className='my-4 bg-[#e2e8f0] shadow-md' />

              {/* Course Management Card */}
              <Card className='relative rounded-[8px] bg-white/95 p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
                <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl'></div>
                <CardHeader className='pb-4'>
                  <CardTitle className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-[#64748b]'>
                  <p className='text-sm'>
                    Manage all your courses in one place. You can create new
                    courses or view your existing ones.
                  </p>
                </CardContent>
                <CardFooter className='flex items-center justify-between gap-3'>
                  <Button
                    onClick={() =>
                      navigate({ to: '/teacher/courses/create_course' })
                    }
                  >
                    <Plus size={18} className='mr-2' />
                    Create Course
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => navigate({ to: '/teacher/courses' })}
                  >
                    <BookOpen size={18} className='mr-2' />
                    View Courses
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent
              value='analytics'
              className='space-y-2'
              forceMount={false}
            >
              <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-3xl'>
                Analytics
              </h1>
              <div className='flex items-center gap-4'>
                <div className='w-[50%]'>
                  <Suspense
                    fallback={<Skeleton className='h-[200px] w-50'></Skeleton>}
                  >
                    <ChartBarDefault monthlyEnrollments={monthlyEnrollments} />
                  </Suspense>
                </div>
                <div className='w-[50%]'>
                  <Suspense
                    fallback={<Skeleton className='h-[200px] w-50'></Skeleton>}
                  >
                    <TopCourseChart />
                  </Suspense>
                </div>
              </div>
              <div className='flex-1'>
                <div className='h-full flex-1'>
                  <Suspense
                    fallback={<Skeleton className='h-[200px] w-50'></Skeleton>}
                  >
                    <ChartPieLabel dounutData={dounutData} />
                  </Suspense>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Main>
      </div>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/teacher/',
    isActive: true,
    disabled: false,
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    href: '/teacher/courses',
    isActive: false,
    disabled: false,
    icon: BookOpen,
  },
  {
    title: 'Games',
    href: '/teacher/trainingwheelgame',
    isActive: false,
    disabled: false,
    icon: Gamepad,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    isActive: false,
    disabled: false,
    icon: Settings,
  },
]
