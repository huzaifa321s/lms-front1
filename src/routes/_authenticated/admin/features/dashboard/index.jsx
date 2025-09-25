import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useInView } from "react-intersection-observer"
import { BookOpen, Users, Gamepad, Layers } from "lucide-react"
import { IconBooks } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { TopNav } from "@/components/layout/top-nav"
import { Search } from "@/components/search"
import { ProfileDropdown } from "../../-components/admin-profile-dropdown"

import {
  cardQueryOptions,
  EarningsQuery,
  topCoursesQueryOptions,
  topTeachersQueryOptions,
} from "../.."

import ActiveInactiveStudents from "./-components/ActiveIntactiveStudents"
import CategoriesPopularityChart from "./-components/CategoriesPopularityChart"
import EarningsCard from "./-components/EarningCard"
import DashboardActivitySection from "./-components/RecentActivity"
import TopTeachersCard from "./-components/TopTeachersCard"
import ApexChart from "./-components/radialChart"
import { TopCourses } from "./-components/topCourses"

//  Reusable Dashboard Card Component
function DashboardCard({ title, icon: Icon, value, loading, footer, onClick }) {
  return (
    <div className="relative rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase text-[#2563eb]">{title}</h3>
        <Icon className="h-6 w-6 text-[#2563eb]" />
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-[#1e293b]">
        {loading ? "---" : value}
      </div>
      {footer && <p className="text-xs text-[#94a3b8]">{footer}</p>}

      {/* Button (optional) */}
      {onClick && (
        <Button
          size="xs"
          variant="outline"
          className="mt-2 rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
          onClick={onClick}
        >
          View All
        </Button>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          <span className="text-sm text-[#2563eb] flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563eb] mr-2"></div>
            Loading {title}...
          </span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { ref: tableRef, inView: tableInView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" })

  // Queries
  const { data: card, fetchStatus } = useQuery(cardQueryOptions())
  const { data: topTeachers } = useQuery(topTeachersQueryOptions())
  const {
    data: topCourses,
    refetch: coursesRefetch,
  } = useQuery({ ...topCoursesQueryOptions()})
  const { data: earningsCardData } = useQuery(EarningsQuery())

  useEffect(() => {
    if (tableInView) coursesRefetch()
  }, [tableInView, coursesRefetch])

  const loading = fetchStatus === "fetching"

  // Cards Config (DRY)
  const cardsConfig = [
    { title: "Courses Overview", icon: BookOpen, value: card?.totalCourses, footer: "Total Courses" },
    { title: "Total Users", icon: Users, value: card?.totalTeachers + card?.totalStudents, footer: "Teachers + Students" },
    { title: "Total Blogs", icon: IconBooks, value: card?.totalBlogs, footer: "Posted on Web" },
    { title: "Total Games", icon: Gamepad, value: card?.totalGames, footer: "Training Wheel Games" },
    { title: "Teachers", icon: Users, value: card?.totalTeachers, footer: "Total Teachers", onClick: () => navigate({ to: "/admin/teachers" }) },
    { title: "Students", icon: Users, value: card?.totalStudents, footer: "Total Students", onClick: () => navigate({ to: "/admin/students" }) },
  ]

  return (
  <>
      {/* ===== Top Header ===== */}
      <Header >
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search className="text-[#1e293b]"  /> */}
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className="px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent drop-shadow-lg mb-4">
          Dashboard
        </h1>

        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="bg-[#f1f5f9] rounded-[8px] p-1">
              <TabsTrigger
                value="overview"
                className="rounded-[6px] text-[#1e293b] data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm hover:bg-[#e2e8f0] transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-[6px] text-[#1e293b] data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm hover:bg-[#e2e8f0] transition-all duration-200"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                disabled
                className="rounded-[6px] text-[#64748b] data-[state=disabled]:opacity-50 data-[state=disabled]:cursor-not-allowed hover:bg-[#e2e8f0] transition-all duration-200"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
                className="rounded-[6px] text-[#64748b] data-[state=disabled]:opacity-50 data-[state=disabled]:cursor-not-allowed hover:bg-[#e2e8f0] transition-all duration-200"
              >
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== Overview Tab ===== */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cardsConfig.map((c, i) => (
                <DashboardCard key={i} {...c} loading={loading} />
              ))}
            </div>

            {/* Categories Overview */}
            <div className="rounded-[12px] border border-[#e2e8f0] p-6 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
              <h3 className="text-sm font-semibold uppercase text-[#2563eb] mb-4">Categories Overview</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-2 w-6 h-6 text-[#2563eb]" />
                  <div className="text-2xl font-bold text-[#1e293b]">{loading ? "---" : card?.blogCategories}</div>
                  <p className="text-xs text-[#94a3b8]">Blog Categories</p>
                </div>
                <div className="text-center">
                  <Layers className="mx-auto mb-2 w-6 h-6 text-[#10b981]" />
                  <div className="text-2xl font-bold text-[#1e293b]">{loading ? "---" : card?.courseCategories}</div>
                  <p className="text-xs text-[#94a3b8]">Course Categories</p>
                </div>
                <div className="text-center">
                  <Gamepad className="mx-auto mb-2 w-6 h-6 text-[#f59e0b]" />
                  <div className="text-2xl font-bold text-[#1e293b]">{loading ? "---" : card?.gameCategories}</div>
                  <p className="text-xs text-[#94a3b8]">Game Categories</p>
                </div>
              </div>
            </div>

            <Separator className="bg-[#e2e8f0]" />

            {/* Top Courses */}
            <section ref={tableRef}>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-4">
                Top Courses by Enrollment
              </h2>
              <TopCourses data={topCourses?.length > 0 ? topCourses : []} />
              <Separator className="my-6 bg-[#e2e8f0]" />
              <ApexChart totalStudents={card?.totalStudents} totalTeachers={card?.totalTeachers} />
              <Separator className="my-6 bg-[#e2e8f0]" />
              <DashboardActivitySection />
            </section>
          </TabsContent>

          {/* ===== Analytics Tab ===== */}
        <TabsContent value="analytics" className="space-y-6">
  <EarningsCard
    totalEarnings={earningsCardData?.total}
    thisMonthTotal={earningsCardData?.thisMonthTotalEarnings}
    earnings={earningsCardData?.earnings}
    months={earningsCardData?.months}
  />
  <div className="flex flex-wrap gap-4 w-full">
    {topTeachers?.length > 0 && <TopTeachersCard topTeachers={topTeachers} />}
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
  { title: "Overview", href: "/teacher", isActive: true },
  { title: "Students", href: "/admin/students" },
  { title: "Teachers", href: "/admin/teachers" },
  { title: "Settings", href: "/admin/settings" },
]
