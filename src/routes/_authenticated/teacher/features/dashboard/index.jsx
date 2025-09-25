import { useQuery } from '@tanstack/react-query'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle ,CardFooter} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { cardQueryOptions } from '../..'
import { useAppUtils } from '../../../../../hooks/useAppUtils.jsx'
import { ProfileDropdown } from '../../../../teacher/-components/teacher-profile-dropdown.jsx'
import { ChartPieLabel } from './-components/ChartCourseByStudents.jsx'
import { TopCourseChart } from './-components/TopCourseChart.jsx'
import { ChartBarDefault } from './-components/overview'
import {Separator} from '@/components/ui/separator'
import './index.css'
import { useRef } from 'react'


export default function Dashboard() {
  const isFirstRender = useRef(true);
  const { data } = useQuery({...cardQueryOptions(),suspense:isFirstRender.current})
  const { navigate } = useAppUtils()
  const { card, dounutData, monthlyEnrollments } = data
 
  return (
     <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] relative">
    

      {/* ===== Top Heading ===== */}
      <Header >
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" /> */}
          <ProfileDropdown className="text-[#64748b] hover:text-[#2563eb] transition-all duration-300" />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className=" p-6">
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="flex gap-2 bg-transparent">
              <TabsTrigger
                value="overview"
                className="rounded-[8px] px-4 py-2 text-[#64748b] font-medium transition-all duration-300 hover:bg-[#2563eb]/10 hover:text-[#2563eb] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-[8px] px-4 py-2 text-[#64748b] font-medium transition-all duration-300 hover:bg-[#2563eb]/10 hover:text-[#2563eb] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                disabled
                className="rounded-[8px] px-4 py-2 text-[#64748b]/50 font-medium cursor-not-allowed"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
                className="rounded-[8px] px-4 py-2 text-[#64748b]/50 font-medium cursor-not-allowed"
              >
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6" forceMount={false}>
            <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-3xl">
              Dashboard
            </h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Points Overview Card */}
              <Card className="relative rounded-[8px] bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#1e293b]">Points Overview</h3>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white">
                      ⭐
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent">
                    330
                  </div>
                  <div className="text-sm text-[#64748b] mt-2">Total Points</div>
                  <div className="text-sm text-[#64748b] mt-4">
                    Points per Enrollment: <strong className="text-[#1e293b]">10</strong>
                  </div>
                </div>
              </Card>

              {/* Created Courses Card */}
              <Card className="relative rounded-[8px] bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1e293b]">Created Courses</h3>
                      <div className="h-1 w-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]"></div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path
                          d="M7.875 5.25C7.875 4.62868 8.37868 4.125 9 4.125L20 4.125C20.6213 4.125 21.125 4.62868 21.125 5.25C21.125 5.87132 20.6213 6.375 20 6.375L9 6.375C8.37868 6.375 7.875 5.87132 7.875 5.25ZM2.875 9.75C2.875 9.12868 3.37868 8.625 4 8.625L20 8.625C20.6213 8.625 21.125 9.12868 21.125 9.75C21.125 10.3713 20.6213 10.875 20 10.875L4 10.875C3.37868 10.875 2.875 10.3713 2.875 9.75ZM7.875 14.25C7.875 13.6287 8.37868 13.125 9 13.125L20 13.125C20.6213 13.125 21.125 13.6287 21.125 14.25C21.125 14.8713 20.6213 15.375 20 15.375L9 15.375C8.37868 15.375 7.875 14.8713 7.875 14.25ZM2.875 18.75C2.875 18.1287 3.37868 17.625 4 17.625L20 17.625C20.6213 17.625 21.125 18.1287 21.125 18.75C21.125 19.3713 20.6213 19.875 20 19.875L4 19.875C3.37868 19.875 2.875 19.3713 2.875 18.75Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent">
                    {card.myCoursesCount}
                  </div>
                  <p className="text-sm text-[#64748b] mt-2">Courses I've Created</p>
                </div>
              </Card>

              {/* Student Enrollment Card */}
              <Card className="relative rounded-[8px] bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#1e293b]">Student Enrollment</h3>
                      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]"></div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path
                          d="M16.4107 6.35C16.4107 8.74 14.4707 10.69 12.0707 10.69L12.0607 10.68C9.6707 10.68 7.7207 8.73 7.7207 6.34C7.7207 3.95 9.6807 2 12.0707 2C14.4607 2 16.4107 3.96 16.4107 6.35ZM14.9107 6.34C14.9107 4.78 13.6407 3.5 12.0707 3.5C10.5107 3.5 9.2307 4.78 9.2307 6.34C9.2307 7.9 10.5107 9.18 12.0707 9.18C13.6307 9.18 14.9107 7.9 14.9107 6.34Z"
                          fill="currentColor"
                        />
                        <path
                          opacity="0.4"
                          d="M12 12.1895C14.67 12.1895 16.76 12.9395 18.21 14.4195V14.4095C20.2567 16.4956 20.2504 19.2563 20.25 19.4344L20.25 19.4395C20.24 19.8495 19.91 20.1795 19.5 20.1795H19.49C19.07 20.1695 18.75 19.8295 18.75 19.4195C18.75 19.3695 18.75 17.0895 17.13 15.4495C15.97 14.2795 14.24 13.6795 12 13.6795C9.76002 13.6795 8.03002 14.2795 6.87002 15.4495C5.25002 17.0995 5.25002 19.3995 5.25002 19.4195C5.25002 19.8295 4.92002 20.1795 4.51002 20.1795C4.15002 20.1995 3.75002 19.8595 3.75002 19.4495L3.75002 19.4448C3.74962 19.2771 3.74302 16.506 5.79002 14.4195C7.24002 12.9395 9.33002 12.1895 12 12.1895Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4">
                      <div>
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
                          {card.enrolledStudentsCount.toLocaleString()}
                        </div>
                        <p className="text-sm text-[#64748b]">Total Students Enrolled</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#2563eb]"
                        >
                          <path
                            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9H21ZM15 16L12 13L9 16V20H15V16Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4">
                      <div>
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
                          {card.studentsEnrolledThisWeek}
                        </div>
                        <p className="text-sm text-[#64748b]">New Students This Week</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#2563eb]"
                        >
                          <path
                            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H17V12H7V10ZM7 14H12V16H7V14Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#64748b]">Weekly Growth Rate</span>
                      <div className="flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#10b981]"
                        >
                          <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
                        </svg>
                        <span className="font-semibold text-[#10b981]">
                          {((card.studentsEnrolledThisWeek / card.enrolledStudentsCount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Earnings Overview Card */}
              <Card className="relative rounded-[8px] bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#1e293b]">
                        Earnings Overview <span className="text-sm text-[#64748b]">(Demo Feature)</span>
                      </h3>
                      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]"></div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path
                          d="M12 2C13.1 2 14 2.9 14 4V6.28C16.6 6.62 18.5 8.81 18.5 11.5C18.5 14.54 15.79 17 12.5 17H11.5V19C11.5 20.1 10.6 21 9.5 21S7.5 20.1 7.5 19V17H5.5C4.4 17 3.5 16.1 3.5 15S4.4 13 5.5 13H7.5V11H5.5C4.4 11 3.5 10.1 3.5 9S4.4 7 5.5 7H7.5V4C7.5 2.9 8.4 2 9.5 2H12ZM12 8.5H9.5V10.5H12C13.4 10.5 14.5 9.4 14.5 8C14.5 6.6 13.4 5.5 12 5.5V8.5ZM12 13.5V15.5C13.4 15.5 14.5 14.4 14.5 13C14.5 11.6 13.4 10.5 12 10.5V13.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4">
                      <div>
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
                          $324
                        </div>
                        <p className="text-sm text-[#64748b]">Total Earnings (All Time)</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#2563eb]"
                        >
                          <path
                            d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7ZM9 8H15V16H9V8Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4">
                      <div>
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
                          $234
                        </div>
                        <p className="text-sm text-[#64748b]">Earnings This Month</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#2563eb]"
                        >
                          <path
                            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H17V12H7V10ZM7 14H12V16H7V14Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4">
                      <div>
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
                          $234
                        </div>
                        <p className="text-sm text-[#64748b]">Pending Payouts</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#2563eb]"
                        >
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Separator className="my-4 bg-[#e2e8f0] shadow-md" />

            {/* Course Management Card */}
            <Card className="relative rounded-[8px] bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-xl"></div>
              <CardHeader className="pb-4">
                <CardTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
                  Course Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[#64748b]">
                <p className="text-sm">
                  Manage all your courses in one place. You can create new courses or view your existing ones.
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-3">
                <Button
                  className="rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-medium transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
                  onClick={() => navigate({ to: '/teacher/courses/create_course' })}
                >
                  <Plus size={18} className="mr-2" />
                  Create Course
                </Button>
                <Button
                  variant="outline"
                  className="rounded-[8px] border-[#e2e8f0] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] transition-all duration-300"
                  onClick={() => navigate({ to: '/teacher/courses' })}
                >
                  <BookOpen size={18} className="mr-2" />
                  View Courses
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6" forceMount={false}>
            <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-3xl">
              Analytics
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-[50%]">
                <ChartBarDefault monthlyEnrollments={monthlyEnrollments} />
              </div>
              <div className="w-[50%]">
                <TopCourseChart />
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex-1">
                <ChartPieLabel dounutData={dounutData} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </div>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/teacher/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Courses',
    href: '/teacher/courses',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Games',
    href: '/teacher/trainingwheelgame',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    isActive: false,
    disabled: false,
  },
]
