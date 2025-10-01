import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { IconBooks } from '@tabler/icons-react'
import {
  BookOpen,
  Users,
  Gamepad,
  Layers,
  BarChart,
  Settings,
  User,
} from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
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
import { ProfileDropdown } from '../../-components/admin-profile-dropdown'
import ActiveInactiveStudents from './-components/ActiveIntactiveStudents'
import CategoriesPopularityChart from './-components/CategoriesPopularityChart'
import EarningsCard from './-components/EarningCard'
import DashboardActivitySection from './-components/RecentActivity'
import TopTeachersCard from './-components/TopTeachersCard'
import ApexChart from './-components/radialChart'
import { TopCourses } from './-components/topCourses'
import { useSelector } from 'react-redux'
import { motion } from "framer-motion"



function AdminWelcomeBanner({ userName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-3xl overflow-hidden p-8 mb-8 shadow-xl"
    >
      {/* Floating Decorative Circles (Magic UI style) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute -top-16 -left-16 w-56 h-56 bg-indigo-400/20 rounded-full filter blur-3xl"
      ></motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute -bottom-16 -right-16 w-72 h-72 bg-cyan-400/20 rounded-full filter blur-3xl"
      ></motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-yellow-300">{userName}</span> 🚀
          </h1>
          <p className="text-blue-100 text-lg max-w-lg">
            Manage users, monitor courses, and keep your LMS running smoothly.
          </p>
        </div>

        <div className="flex gap-4">
          {/* Settings Button */}
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </Button>

          {/* Profile Button */}
          <Button
            variant="outline"
            className="bg-white/20 border-white/40 text-white hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <User className="h-5 w-5" />
            My Profile
          </Button>
        </div>
      </div>
    </motion.div>
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
        {loading ? (
          '---'
        ) : (
          <CountUp end={value} className='counter-value inline-block' />
        )}
      </div>
      {footer && <p className='text-xs text-[#94a3b8]'>{footer}</p>}

      {/* Button (optional) */}
      {onClick && (
        <Button
          size='xs'
          variant='outline'
          className='mt-2 rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] shadow-sm transition-all duration-300 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
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
  const { ref: tableRef, inView: tableInView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })
  const credentials = useSelector((state) => state.adminAuth.credentials)
  console.log('credentials admin', credentials)

  // Queries
  const { data: card, fetchStatus } = useQuery(cardQueryOptions())
  const { data: topTeachers } = useQuery(topTeachersQueryOptions())
  const { data: topCourses, refetch: coursesRefetch } = useQuery({
    ...topCoursesQueryOptions(),
  })
  const { data: earningsCardData, isLoading: earningsCardLoading } =
    useQuery(EarningsQuery())

  useEffect(() => {
    if (tableInView) coursesRefetch()
  }, [tableInView, coursesRefetch])

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
      icon: IconBooks,
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
          <ProfileDropdown />
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
          className='space-y-4'
        >
          <div className='overflow-x-auto'>
            <TabsList className='rounded-[8px] bg-[#f1f5f9] p-1'>
              <TabsTrigger
                value='overview'
                className='rounded-[6px] text-[#1e293b] transition-all duration-200 hover:bg-[#e2e8f0] data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm'
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value='analytics'
                className='rounded-[6px] text-[#1e293b] transition-all duration-200 hover:bg-[#e2e8f0] data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm'
              >
                Analytics
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
          <TabsContent value='overview' className='space-y-6'>
            {/* Cards */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
                    {loading ? (
                      '---'
                    ) : (
                      <CountUp
                        end={card?.blogCategories}
                        className='counter-value inline-block'
                      />
                    )}
                  </div>
                  <p className='text-xs text-[#94a3b8]'>Blog Categories</p>
                </div>
                <div className='text-center'>
                  <Layers className='mx-auto mb-2 h-6 w-6 text-[#10b981]' />
                  <div className='text-2xl font-bold text-[#1e293b]'>
                    {loading ? (
                      '---'
                    ) : (
                      <CountUp
                        end={card?.courseCategories}
                        className='counter-value inline-block'
                      />
                    )}
                  </div>
                  <p className='text-xs text-[#94a3b8]'>Course Categories</p>
                </div>
                <div className='text-center'>
                  <Gamepad className='mx-auto mb-2 h-6 w-6 text-[#f59e0b]' />
                  <div className='text-2xl font-bold text-[#1e293b]'>
                    {loading ? (
                      '---'
                    ) : (
                      <CountUp
                        end={card?.gameCategories}
                        className='counter-value inline-block'
                      />
                    )}
                  </div>
                  <p className='text-xs text-[#94a3b8]'>Game Categories</p>
                </div>
              </div>
            </div>

            <Separator className='bg-[#e2e8f0]' />

            {/* Top Courses */}
            <section ref={tableRef}>
              <h2 className='mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                Top Courses by Enrollment
              </h2>
              <TopCourses data={topCourses?.length > 0 ? topCourses : []} />
              <Separator className='my-6 bg-[#e2e8f0]' />
              <ApexChart
                totalStudents={card?.totalStudents}
                totalTeachers={card?.totalTeachers}
              />
              <Separator className='my-6 bg-[#e2e8f0]' />
              <DashboardActivitySection />
            </section>
          </TabsContent>

          {/* ===== Analytics Tab ===== */}
          <TabsContent value='analytics' className='space-y-6'>
            <EarningsCard
              totalEarnings={earningsCardData?.total}
              thisMonthTotal={earningsCardData?.thisMonthTotalEarnings}
              earnings={earningsCardData?.earnings}
              months={earningsCardData?.months}
              loading={earningsCardLoading}
            />
            <div className='flex w-full flex-wrap gap-4'>
              {topTeachers?.length > 0 && (
                <TopTeachersCard topTeachers={topTeachers} />
              )}
              <CategoriesPopularityChart />
            </div>
            <ActiveInactiveStudents />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  { title: 'Overview', href: '/teacher', isActive: true },
  { title: 'Students', href: '/admin/students' },
  { title: 'Teachers', href: '/admin/teachers' },
  { title: 'Settings', href: '/admin/settings' },
]
