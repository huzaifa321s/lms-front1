import { useEffect, useRef } from 'react'
import axios from 'axios'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { FilePlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { Show } from '../../../../shared/utils/Show'
import {
  getDebounceInput,
  getRenderPaginationButtons,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import { queryClient } from '../../../../utils/globalVars'
import { CardDemo } from './-components/_Course_Card'
import { TopNav } from "@/components/layout/top-nav"


export const courseQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['teacherCourses', deps.page, deps.input],
    queryFn: async () => {
      const pageNumber = deps.page
      const searchQuery = deps.input

      let queryStr = `page=${pageNumber}`
      if (searchQuery) {
        queryStr += `&q=${searchQuery}`
      }

      try {
        let response = await axios.get(`/teacher/course/get?${queryStr}`)
        response = response.data
        if (response.success) {
          const { courses, totalPages } = response.data
          return { courses: courses, pages: totalPages }
        }
      } catch (error) {
        console.log('error', error)
        return { courses: [], pages: 0 }
      }
    },
  })

export const Route = createFileRoute('/_authenticated/teacher/courses/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return { input: search.input || '', page: Number(search.page ?? 1)}
  },
  loaderDeps: ({ search }) => {
    return { input: search.input, page: search.page }
  },
  loader: ({ deps }) => queryClient.ensureQueryData(courseQueryOptions(deps)),
})

function RouteComponent() {
  const { navigate } = useAppUtils()
  const searchParams = useSearch({ from: '/_authenticated/teacher/courses/' })
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/teacher/courses/'
  )
  const debouncedSearch = getDebounceInput(searchInput, 800)
  const isFirstRender = useRef(true)
  const { data, fetchStatus, isFetching } = useQuery(
    {...courseQueryOptions({
      input: debouncedSearch,
      page: searchParams.page,
    }),suspense:isFirstRender.current , placeholderData: (prev) => prev, }
  )
  const courses = data?.courses;
  const pages = data?.pages;
console.log('courses.length ===>',courses.length)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const queryPage = useSearch({
    select: (search) => search.page,
  })

  const searchCourses = () => {
    navigate({
      to: `/teacher/courses`,
      search: { input: searchInput, page: 1 },
    })

    // if (searchInput !== '') {
    // } else {
    //   navigate({
    //     to:'/teacher/courses',
    //     search: { input: '', page: searchParams.page },
    //   })
  }
  const handlePageChange = (page) => {
   
      navigate({
        to: `/teacher/courses`,
        search: { page: page, input: searchInput },
      })
   
  }

  return (
    <>
        <Header >
        <TopNav links={topNav} />
        <div className="my-2 flex w-full justify-between items-center px-6">
          <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
            My Courses
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              className="flex items-center gap-2 rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-medium shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
              onClick={() => navigate({ to: '/teacher/courses/create_course' })}
            >
              <FilePlus size={18} />
              Create Course
            </Button>
            <Show>
              <Show.When isTrue={true}>
                <Label className="flex items-center gap-2">
                  <Input
                    size="sm"
                    type="text"
                    className="grow rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                    placeholder="Search Courses"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    onClick={searchCourses}
                    variant="outline"
                    size="sm"
                    className="rounded-[8px] border-[#e2e8f0] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] transition-all duration-300"
                    loading={isFetching}
                    disabled={isFetching}
                  >
                    {!isFetching && <Search size={18} />}
                  </Button>
                </Label>
              </Show.When>
            </Show>
          </div>
        </div>
      </Header>


   <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl"></div>
      </div>

      {/* Header */}
  
      {/* Courses Grid */}
      <div className="mx-auto max-w-7xl p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        <Show>
          <Show.When isTrue={courses.length > 0}>
            {courses.map((i, k) => (
              <CardDemo
                key={i._id}
                courseId={i._id}
                name={i.name}
                desc={i.description}
                query={searchInput}
                page={k === 0 ? 1 : queryPage}
                index={k}
                studentsEnrolled={i.studentsEnrolled}
                fetchStatus={fetchStatus}
                isFetching={isFetching}
                dateUpdated={i.updatedAt}
                image={i.coverImage}
              />
            ))}
          </Show.When>
          <Show.Else>
            <Card className="p-6 text-center bg-white/95 backdrop-blur-sm rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
              <p className="text-[#1e293b] font-medium">No courses found!</p>
              <p className="text-sm text-[#64748b]">
                Try creating a new course or adjusting your search.
              </p>
            </Card>
          </Show.Else>
        </Show>
      </div>

      {/* Pagination */}
      <div
        className="flex w-full justify-center"
        style={{ position: 'fixed', bottom: '70px' }}
      >
        <div className="join flex items-center gap-2">
          {queryPage > 1 && (
            <Button
              size="sm"
              className="rounded-[8px] bg-white/95 backdrop-blur-sm border-[#e2e8f0] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handlePageChange(queryPage - 1)}
            >
              «
            </Button>
          )}
         {getRenderPaginationButtons(queryPage, pages, handlePageChange)}
           
          {queryPage < pages && (
            <Button
              size="sm"
              className="rounded-[8px] bg-white/95 backdrop-blur-sm border-[#e2e8f0] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handlePageChange(queryPage + 1)}
            >
              »
            </Button>
          )}
        </div>
      </div>
    </div>
        </>
  )
}


const topNav = [
  {
    title: 'Overview',
    href: '/teacher/',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Courses',
    href: '/teacher/courses',
    isActive: true,
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
