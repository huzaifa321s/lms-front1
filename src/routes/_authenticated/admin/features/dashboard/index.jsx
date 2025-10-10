import { lazy, Suspense, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  Users,
  Gamepad,
  Layers,
  Settings,
  User,
  BookUser,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  GraduationCap,
  SettingsIcon,
} from 'lucide-react'
import { shallowEqual, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import {
  cardQueryOptions,
  EarningsQuery,
  topCoursesQueryOptions,
  topTeachersQueryOptions,
} from '../..'
import DashboardActivitySection from './-components/RecentActivity'
import TopTeachersCard from './-components/TopTeachersCard'
import { TopCourses } from './-components/topCourses'

const CountUp = lazy(() => import('react-countup'))

const ProfileDropdown = lazy(
  () => import('../../-components/admin-profile-dropdown')
)
const ActiveInactiveStudents = lazy(
  () => import('./-components/ActiveIntactiveStudents')
)
const ApexChart = lazy(() => import('./-components/radialChart'))
const EarningsCard = lazy(() => import('./-components/EarningCard'))
// Lazy import
const CategoriesPopularityChart = lazy(
  () => import('./-components/CategoriesPopularityChart')
)

function AdminWelcomeBanner({ userName }) {
  return (
     <div className="relative mb-2 overflow-hidden rounded-xl bg-blue-700 p-8 text-white shadow-xl">
      {/* Floating Decorative Circles (Subtle Glow Effect) */}
      <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl filter"></div>
      <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl filter"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Welcome back, <span className="text-yellow-300">{userName}</span> 🚀
          </h1>
          <p className="max-w-lg text-lg text-blue-100">
            Manage users, monitor courses, and keep your LMS running smoothly.
          </p>
        </div>

        {/* Right Section – Buttons */}
        <div className="flex gap-4">
          {/* Settings Button */}
          <Button >
            <Settings className="h-5 w-5" />
            Settings
          </Button>

          {/* Profile Button */}
          <Button
          className="text-black"
            variant="outline"
          >
            <User className="h-5 w-5" />
            My Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
//  Reusable Dashboard Card Component
function DashboardCard({ title, icon: Icon, value, loading, footer, onClick }) {
  return (
    <div className='relative rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-[#2563eb] uppercase'>
          {title}
        </h3>
        <Icon className='h-6 w-6 text-[#2563eb]' />
      </div>

      {/* Value */}
      <div className='text-3xl font-bold text-[#1e293b]'>
        <Suspense fallback={<span className='text-gray-400'>...</span>}>
          <CountUp end={value} className='counter-value inline-block' />
        </Suspense>
      </div>
      {footer && <p className='text-xs text-[#94a3b8]'>{footer}</p>}

      {/* Button (optional) */}
      {onClick && (
        <Button
          size='xs'
          variant='outline'
          onClick={onClick}
        >
          View All
        </Button>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/70'>
          <span className='flex items-center text-sm text-[#2563eb]'>
            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-[#2563eb]'></div>
            Loading {title}...
          </span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const credentials = useSelector(
    (state) => state.adminAuth.credentials,
    shallowEqual
  )
  console.log('credentials admin', credentials)

  // Queries
  const { data: card, fetchStatus } = useQuery(cardQueryOptions())
  const { data: topTeachers } = useQuery(topTeachersQueryOptions())
  const { data: topCourses, refetch: coursesRefetch } = useQuery({
    ...topCoursesQueryOptions(),
  })
  const { data: earningsCardData, isLoading: earningsCardLoading } =
    useQuery(EarningsQuery())

  const loading = fetchStatus === 'fetching'

  // Cards Config (DRY)
  const cardsConfig = [
    {
      title: 'Courses Overview',
      icon: BookOpen,
      value: card?.totalCourses,
      footer: 'Total Courses',
    },
    {
      title: 'Total Users',
      icon: Users,
      value: card?.totalTeachers + card?.totalStudents,
      footer: 'Teachers + Students',
    },
    {
      title: 'Total Blogs',
      icon: BookUser,
      value: card?.totalBlogs,
      footer: 'Posted on Web',
    },
    {
      title: 'Total Games',
      icon: Gamepad,
      value: card?.totalGames,
      footer: 'Training Wheel Games',
    },
    {
      title: 'Teachers',
      icon: Users,
      value: card?.totalTeachers,
      footer: 'Total Teachers',
      onClick: () => navigate({ to: '/admin/teachers' }),
    },
    {
      title: 'Students',
      icon: Users,
      value: card?.totalStudents,
      footer: 'Total Students',
      onClick: () => navigate({ to: '/admin/students' }),
    },
  ]

  return (
    <>
      {/* ===== Top Header ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search className="text-[#1e293b]"  /> */}
          <Suspense
            fallback={
              <div className='h-6 w-20 animate-pulse rounded bg-gray-200'></div>
            }
          >
            <ProfileDropdown />
          </Suspense>
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className='px-4 py-8'>
        <h1 className='mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold text-transparent drop-shadow-lg md:text-3xl'>
          Dashboard
        </h1>
        <AdminWelcomeBanner
          userName={credentials?.firstName + ' ' + credentials?.lastName}
        />
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-2'
        >
          <div className='overflow-x-auto'>
            <TabsList className='rounded-[8px] bg-[#f1f5f9] p-1'>
              <TabsTrigger
                value='overview'
                className='rounded-[6px] text-[#1e293b] transition-all duration-200 hover:bg-[#e2e8f0] data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm'
              >
               <LayoutDashboard/> Overview
              </TabsTrigger>
              <TabsTrigger
                value='analytics'
                className='rounded-[6px] text-[#1e293b] transition-all duration-200 hover:bg-[#e2e8f0] data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm'
              >
              <BarChart3/>  Analytics
              </TabsTrigger>
              <TabsTrigger
                value='reports'
                disabled
                className='rounded-[6px] text-[#64748b] transition-all duration-200 hover:bg-[#e2e8f0] data-[state=disabled]:cursor-not-allowed data-[state=disabled]:opacity-50'
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value='notifications'
                disabled
                className='rounded-[6px] text-[#64748b] transition-all duration-200 hover:bg-[#e2e8f0] data-[state=disabled]:cursor-not-allowed data-[state=disabled]:opacity-50'
              >
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== Overview Tab ===== */}
          <TabsContent value='overview' className='space-y-2'>
            {/* Cards */}
            <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'>
              {cardsConfig.map((c, i) => (
                <DashboardCard key={i} {...c} loading={loading} />
              ))}
            </div>

            {/* Categories Overview */}
            <div className='rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
              <h3 className='mb-4 text-sm font-semibold text-[#2563eb] uppercase'>
                Categories Overview
              </h3>
              <div className='grid gap-6 sm:grid-cols-3'>
                <div className='text-center'>
                  <BookOpen className='mx-auto mb-2 h-6 w-6 text-[#2563eb]' />
                  <div className='text-2xl font-bold text-[#1e293b]'>
                    <Suspense
                      fallback={<span className='text-gray-400'>...</span>}
                    >
                      <CountUp
                        end={card?.blogCategories}
                        className='counter-value inline-block'
                      />
                    </Suspense>
                  </div>
                  <p className='text-xs text-[#94a3b8]'>Blog Categories</p>
                </div>
                <div className='text-center'>
                  <Layers className='mx-auto mb-2 h-6 w-6 text-[#10b981]' />
                  <div className='text-2xl font-bold text-[#1e293b]'>
                    <Suspense
                      fallback={<span className='text-gray-400'>...</span>}
                    >
                      <CountUp
                        end={card?.courseCategories}
                        className='counter-value inline-block'
                      />
                    </Suspense>
                  </div>
                  <p className='text-xs text-[#94a3b8]'>Course Categories</p>
                </div>
                <div className='text-center'>
                  <Gamepad className='mx-auto mb-2 h-6 w-6 text-[#f59e0b]' />
                  <div className='text-2xl font-bold text-[#1e293b]'>
                    <Suspense
                      fallback={<span className='text-gray-400'>...</span>}
                    >
                      <CountUp
                        end={card?.gameCategories}
                        className='counter-value inline-block'
                      />
                    </Suspense>
                  </div>
                  <p className='text-xs text-[#94a3b8]'>Game Categories</p>
                </div>
              </div>
            </div>

            <Separator className='bg-[#e2e8f0]' />

            {/* Top Courses */}
            <section>
              <h2 className='mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                Top Courses by Enrollment
              </h2>
              <TopCourses data={topCourses?.length > 0 ? topCourses : []} />
              <Separator className='my-6 bg-[#e2e8f0]' />
              {/* Suspense wrapper */}
              <Suspense fallback={<div>Loading chart...</div>}>
                <ApexChart
                  totalStudents={card?.totalStudents}
                  totalTeachers={card?.totalTeachers}
                />
              </Suspense>
              <Separator className='my-6 bg-[#e2e8f0]' />
              <DashboardActivitySection />
            </section>
          </TabsContent>

          {/* ===== Analytics Tab ===== */}
          <TabsContent value='analytics' className='space-y-2'>
            <Suspense fallback={<div>Loading chart...</div>}>
              <EarningsCard
                totalEarnings={earningsCardData?.total}
                thisMonthTotal={earningsCardData?.thisMonthTotalEarnings}
                earnings={earningsCardData?.earnings}
                months={earningsCardData?.months}
                loading={earningsCardLoading}
              />
            </Suspense>
            <div className='flex w-full flex-wrap gap-4'>
              {topTeachers?.length > 0 && (
                <TopTeachersCard topTeachers={topTeachers} />
              )}
              <Suspense fallback={<>Loading chart...</>}>
                <CategoriesPopularityChart />
              </Suspense>
            </div>
            <Suspense
              fallback={
                <div className='animate bg-accent h-25 w-50 animate-pulse'></div>
              }
            >
              <ActiveInactiveStudents />
            </Suspense>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  { title: 'Overview', href: '/teacher', isActive: true ,icon:LayoutDashboard},
  { title: 'Students', href: '/admin/students',icon:UserCircle },
  { title: 'Teachers', href: '/admin/teachers',icon: GraduationCap},
  { title: 'Settings', href: '/admin/settings' ,icon:SettingsIcon},
]
