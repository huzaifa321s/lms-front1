import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useParams, useSearch, createLazyFileRoute } from '@tanstack/react-router'
import { IconLoader } from '@tabler/icons-react'
import { Mail, Phone, Search, BookOpen, Award, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { addTitle } from '../../../../shared/config/reducers/animateBgSlice'
import {
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import { coursesSchemaStudent } from '../features/tasks/-components/columns'
import { DataTable } from '../features/tasks/-components/student-data-table'

const queryClient = new QueryClient()
const teacherDetailsQueryOptions = (params) =>
  queryOptions({
    queryKey: ['student-get-teacher', 'course', params.params.teacherID],
    queryFn: async () => {
      try {
        let teacherDetailsResponse = await axios.get(
          `/student/course/get-teacher/${params.params.teacherID}`,
          {}
        )
        teacherDetailsResponse = teacherDetailsResponse.data
        console.log('teacherDetailsResponse ===>', teacherDetailsResponse)

        return {
          teacher: teacherDetailsResponse.success
            ? teacherDetailsResponse.data
            : null,
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

const courseQueryOption = (params) =>
  queryOptions({
    queryKey: [
      'course',
      params.params.teacherID,
      params.deps.q,
      params.deps.page,
    ],
    queryFn: async () => {
      try {
        let queryStr = `page=${params.deps.page}&teacherId=${params.params.teacherID}`
        if (params.deps.q !== '') queryStr += `&q=${params.deps.q}`

        let coursesResponse = await axios.get(
          `/student/course/get-teacher-courses?${queryStr}`
        )
        coursesResponse = coursesResponse.data
        console.log('coursesResponse ===>', coursesResponse)
        if (coursesResponse.success) {
          return {
            courses: coursesResponse.data.courses,
            totalPages: coursesResponse.data.totalPages,
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/student/course-teachers/$teacherID'
)({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: async (params) => {
    ;(await queryClient.ensureQueryData(teacherDetailsQueryOptions(params)),
      queryClient.prefetchQuery(courseQueryOption(params)))
  },
  component: RouteComponent,
})

const defaultProfile =
  'https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg?w=826'

function RouteComponent() {
  const queryClient = useQueryClient()
  const { teacherID } = useParams({
    from: '/_authenticated/student/course-teachers/$teacherID',
  })
  const isFirstRender = useRef(true)
  let currentPage = useSearch({
    from: '/_authenticated/student/course-teachers/$teacherID',
    select: (search) => search.page,
  })
  console.log('currentPage ===>',currentPage)
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/student/course-teachers/$teacherID'
  )
  const debouncedSearch = getDebounceInput(searchInput, 800)
  const deps = { q: debouncedSearch, page: currentPage }
  const params = { deps, params: { teacherID } }
  const { data:{teacher}, fetchStatus, isFetching } = useSuspenseQuery(
    teacherDetailsQueryOptions(params)
  )
  const {
    data,
    fetchStatus:coursesFetchStatus,
    isFetching:coursesIsFetching
  } = useQuery({
    ...courseQueryOption(params),
    suspense: isFirstRender.current,
  })
  const courses = data?.courses;
  const totalPages = data?.totalPages;
  console.log('totalPages ===>', totalPages)
  console.log('courses ===>', courses)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])
  const { navigate } = useAppUtils()

  const searchCourses = async () => {
    if (searchInput !== '') {
      navigate({
        to: `/student/course-teachers/${teacherID}`,
        search: { q: searchInput },
      })
    } else {
      navigate({
        to: `/student/course-teachers/${teacherID}`,
        search: { q: `` },
      })
    }
    params.deps.q = searchInput
    await queryClient.invalidateQueries(teacherDetailsQueryOptions(params))
  }

  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) // table update
    navigate({
      to: `/student/course-teachers/${teacherID}`,
      search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
    })
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]">
    <Header>
      <h1 className="w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-2xl">
        Teacher Details
      </h1>
      <div className="my-3 flex w-full items-center justify-between">
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.history.back()}
          className="ml-auto transform border-0 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-2 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
          Back
        </Button>
      </div>
    </Header>

    <div className="m-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left side - Instructor Profile */}
      <div className="space-y-6 lg:col-span-4">
        {/* Profile Card */}
        <div className="hover:shadow-xl overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full shadow-2xl ring-4 ring-blue-200">
                <img
                  src={
                    teacher?.profile
                      ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/teacher/profile/${teacher.profile}`
                      : defaultProfile
                  }
                  alt="Instructor"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] ring-4 ring-white">
                <User size={16} className="text-white" />
              </div>
            </div>
            <h2 className="mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
              {teacher?.firstName} {teacher?.lastName}
            </h2>
            <p className="text-gray-600">{teacher?.bio}</p>
          </div>
        </div>

        {/* Skills & Expertise Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h3 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-xl font-bold text-transparent">
              Skills & Expertise
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
              <span className="font-semibold text-gray-700">Qualification</span>
              <span className="font-medium text-gray-600">
                {teacher?.qualification}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Details and Courses */}
      <div className="space-y-6 lg:col-span-8">
        {/* Basic Info */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <h3 className="mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
            <div className="rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2">
              <User className="h-5 w-5 text-white" />
            </div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2">
                  <Mail size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Email</div>
                  <div className="text-gray-600">{teacher?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300">
          <div className="p-8 pb-4">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <h3 className="flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
                <div className="rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Created Courses
              </h3>

              <div className="flex w-full items-center gap-3 md:w-auto">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchInput || ''}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-2xl border-gray-200 bg-gray-50 py-2 pr-12 pl-4 focus:border-[#2563eb] md:w-64"
                />
                <Button
                  size="sm"
                  disabled={isFetching}
                  onClick={searchCourses}
                  className="transform rounded-2xl border-0 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-4 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {isFetching ? (
                    <IconLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="relative min-h-[400px]">
            {courses && courses.length > 0 ? (
              <DataTable
                data={courses}
                totalPages={totalPages}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handlePagination={handlePagination}
                columns={coursesSchemaStudent}
                fetchStatus={coursesFetchStatus}
                isFetching={coursesIsFetching}
                pagination={true}
                paginationOptions={paginationOptions}
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-8 py-16">
                <div className="mb-6 rounded-full bg-blue-100 p-6">
                  <BookOpen size={48} className="text-[#2563eb]" />
                </div>
                <h4 className="mb-2 text-xl font-semibold text-gray-600">
                  No Courses Available
                </h4>
                <p className="max-w-md text-center text-gray-500">
                  This instructor hasn't published any courses yet. Check back
                  later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)


}
