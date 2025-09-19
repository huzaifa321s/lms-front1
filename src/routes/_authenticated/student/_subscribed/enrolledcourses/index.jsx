"use client"

import { useEffect, useRef } from "react"
import axios from "axios"
import { QueryClient, queryOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useSearch } from "@tanstack/react-router"
import { TopNav } from "@/components/layout/top-nav"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Show } from "../../../../../shared/utils/Show"
import { getDebounceInput, getRenderPaginationButtons, useSearchInput } from "../../../../../utils/globalFunctions"
import { CardDemo } from "./-components/_Course_Card"
import { useAppUtils } from "../../../../../hooks/useAppUtils"

const queryClient = new QueryClient()
const coursesQueryOptions = (deps) =>
  queryOptions({
    queryKey: ["course", deps.page, deps.input],
    queryFn: async () => {
      try {
        let response = await axios.get(`/student/course/enrolled-courses/get?page=${deps.page}&q=${deps.input}`)
        response = response.data
        if (response.success) {
          console.log("response.data ===>", response.data)
          const { courses, totalPages } = response.data
          return { courses: courses, pages: totalPages }
        }
      } catch (error) {
        console.log("error", error)
        return { courses: [], pages: 0 }
      }
    },
    placeholderData: (prev) => prev,
  })

export const Route = createFileRoute("/_authenticated/student/_subscribed/enrolledcourses/")({
  component: RouteComponent,
  validateSearch: (search) => {
    return { input: search.input || "", page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { input: search.input, page: search.page }
  },
  loader: ({ deps }) => queryClient.ensureQueryData(coursesQueryOptions(deps)),
})

function RouteComponent() {
  const { navigate } = useAppUtils()
  const isFirstRender = useRef(true)

  const searchParams = useSearch({
    from: "/_authenticated/student/_subscribed/enrolledcourses/",
  })
  console.log("searchParams ===>", searchParams)
  const [searchInput, setSearchInput] = useSearchInput("/_authenticated/student/_subscribed/enrolledcourses/")
  const debouncedSearch = getDebounceInput(searchInput, 800)
  const { data, fetchStatus, isFetching } = useQuery({
    ...coursesQueryOptions({ input: debouncedSearch, page: searchParams.page }),
    suspense: isFirstRender.current,
    placeholderData: (prev) => prev,
  })
  console.log("data ===>", data)
  const courses = data?.courses
  const pages = data?.pages

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const queryClient = useQueryClient()

  const queryPage = useSearch({
    select: (search) => search.page,
  })
  console.log("queryPage ===>", queryPage)

  const searchEnrolledCourses = async () => {
    if (searchInput !== "") {
      navigate({
        to: `/student/enrolledcourses`,
        search: { input: searchInput, page: 1 },
      })
    } else {
      navigate({
        to: `/student/enrolledcourses`,
        search: { input: "", page: queryPage },
      })
    }
    await queryClient.invalidateQueries({
      input: searchInput,
      page: searchParams.page,
    })
  }

  const handlePageChange = async (page) => {
    if (searchInput !== "") {
      navigate({
        to: `/student/enrolledcourses`,
        search: { page: page, input: `` },
      })
    } else {
      navigate({
        to: `/student/enrolledcourses`,
        search: { page: page, input: `` },
      })
    }
    await queryClient.invalidateQueries(coursesQueryOptions({ input: searchInput, page }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header>
        <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-3xl my-2">
          Enrolled Courses
        </h1>
        <TopNav links={topNav} />
        <div className="ml-auto w-fit">
          <Show>
            <Show.When isTrue={true}>
              <Label className="flex items-center gap-2">
                <Input
                  size="sm"
                  type="text"
                  value={searchInput}
                  className="grow border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search courses..."
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchEnrolledCourses}
                  loading={isFetching}
                  disabled={isFetching}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  {!isFetching && <Search className="h-4 w-4" />}
                </Button>
              </Label>
            </Show.When>
          </Show>
        </div>
      </Header>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Show>
            <Show.When isTrue={courses && courses.length > 0}>
              {courses.map((course, index) => {
                return (
                  <CardDemo
                    key={course._id || index}
                    courseId={course._id}
                    fetchStatus={fetchStatus}
                    title={course.name}
                    desc={course.description}
                  />
                )
              })}
            </Show.When>
            <Show.Else>
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-slate-400 text-lg mb-2">No courses found!</div>
                {searchInput?.trim() !== "" &&<p className="text-slate-500 text-sm">Try adjusting your search criteria</p>}
              </div>
            </Show.Else>
          </Show>
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-slate-200">
          {queryPage > 1 && (
            <Button
              size="sm"
              onClick={() => handlePageChange(queryPage - 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              «
            </Button>
          )}
          {getRenderPaginationButtons(queryPage, pages, handlePageChange)}
          {queryPage < pages && (
            <Button
              size="sm"
              onClick={() => handlePageChange(queryPage + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              »
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const topNav = [
  {
    title: "Overview",
    href: "/student",
    isActive: false,
    disabled: false,
  },
  {
    title: "Courses",
    href: "/student/enrolledcourses",
    isActive: true,
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
