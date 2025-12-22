import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import {
  useParams,
  useSearch,
  createFileRoute,
  useLoaderData,
} from '@tanstack/react-router'
import {
  Mail,
  Search,
  BookOpen,
  Award,
  User,
  ArrowLeft,
  Loader,
  CircleX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import SearchInput from '../-components/SearchInput'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  useDebounceInput,
  useSearchInput,
  getFileUrl,
} from '@/utils/globalFunctions'
import { coursesSchemaStudent } from '../features/tasks/-components/columns'

const DataTable = lazy(
  () => import('../features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()

const teacherDetailsQueryOptions = (params) =>
  queryOptions({
    queryKey: ['student-get-teacher', 'course', params.teacherID],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/student/course/get-teacher/${params.teacherID}`,
          {}
        )
        if (response.data.success) {
          return response.data.data
        }
        throw new Error('Failed to fetch teacher details')
      } catch (error) {
        console.error('Error fetching teacher:', error)
        throw error
      }
    },
  })

const courseQueryOption = (params) =>
  queryOptions({
    queryKey: ['course', params.teacherID, params.q, params.page],
    queryFn: async () => {
      try {
        let queryStr = `page=${params.page}&teacherId=${params.teacherID}`
        if (params.q !== '') queryStr += `&q=${params.q}`

        const response = await axios.get(
          `/student/course/get-teacher-courses?${queryStr}`
        )
        if (response.data.success) {
          return {
            courses: response.data.data.courses,
            totalPages: response.data.data.totalPages,
          }
        }
        throw new Error('Failed to fetch courses')
      } catch (error) {
        console.error('Error fetching courses:', error)
        throw error
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/student/course-teachers/$teacherID'
)({
  validateSearch: (search) => ({
    q: search.q || '',
    page: Number(search.page ?? 1),
  }),
  loader: async ({ params }) => {
    try {
      const teacherData = await queryClient.ensureQueryData(
        teacherDetailsQueryOptions({ teacherID: params.teacherID })
      )
      const initialCourses = await queryClient.ensureQueryData(
        courseQueryOption({
          teacherID: params.teacherID,
          q: '',
          page: 1,
        })
      )
      return { teacher: teacherData, initialCourses }
    } catch (error) {
      console.error('Loader error:', error)
      throw new Error('Failed to load teacher or courses data')
    }
  },
  errorComponent: ({ error }) => (
    <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] p-6'>
      <div className='mx-auto max-w-7xl text-center'>
        <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-md'>
          <div className='mb-6 rounded-full bg-red-100 p-6'>
            <CircleX className='h-12 w-12 text-[#ef4444]' strokeWidth={2} />
          </div>
          <h3 className='mb-2 text-xl font-semibold text-gray-600'>
            Failed to Load Teacher Details
          </h3>
          <p className='mb-6 text-gray-500'>Error: {error.message}</p>
          <Button variant='outline' onClick={() => window.history.back()}>
            Back to Courses
          </Button>
        </div>
      </div>
    </div>
  ),
  component: RouteComponent,
})

const defaultProfile =
  'https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg?w=826'

function RouteComponent() {
  const { teacherID } = useParams({
    from: '/_authenticated/student/course-teachers/$teacherID',
  })
  const { teacher, initialCourses } = useLoaderData({
    from: '/_authenticated/student/course-teachers/$teacherID',
  })
  const { q, page: currentPage } = useSearch({
    from: '/_authenticated/student/course-teachers/$teacherID',
  })
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/student/course-teachers/$teacherID'
  )
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)

  const { data, fetchStatus, isFetching } = useQuery({
    ...courseQueryOption({
      teacherID,
      q: debouncedSearch,
      page: currentPage,
    }),
    initialData: currentPage === 1 && !q ? initialCourses : undefined,
  })

  const { navigate } = useAppUtils()
  const courses = data?.courses
  const totalPages = data?.totalPages


  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const input = formData.get('search')?.toString() || ''
      setSearchInput(input) // Update state
      navigate({
        to: `/student/course-teachers/${teacherID}`,
        search: { page: 1, q: searchInput },
      })
    },
    [navigate, setSearchInput]
  )

  const [paginationOptions, setPagination] = useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  })

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: currentPage - 1 }))
  }, [currentPage])

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination)
    navigate({
      to: `/student/course-teachers/${teacherID}`,
      search: { q: searchInput, page: newPageIndex + 1 },
    })
  }

  if (!teacher) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] p-6'>
        <div className='mx-auto max-w-7xl text-center'>
          <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-md'>
            <div className='mb-6 rounded-full bg-red-100 p-6'>
              <CircleX className='h-12 w-12 text-red-500' strokeWidth={2} />
            </div>
            <h3 className='mb-2 text-xl font-semibold text-gray-600'>
              No Teacher Found
            </h3>
            <p className='mb-6 text-gray-500'>
              The teacher data could not be loaded.
            </p>
            <Button variant='outline' onClick={() => window.history.back()}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]'>
      <Header>
        <div className='my-3 flex w-full items-center justify-between'>
          <h1 className='w-full bg-clip-text text-xl font-extrabold tracking-tight drop-shadow-lg md:text-2xl'>
            Teacher Details
          </h1>
          <Button
            size='sm'
            variant='outline'
            className='text-black'
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
            Back
          </Button>
        </div>
      </Header>

      <div className='m-6 grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Left side - Instructor Profile */}
        <div className='space-y-6 lg:col-span-4'>
          {/* Profile Card */}
          <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl'>
            <div className='text-center'>
              <div className='relative inline-block'>
                <div className='mx-auto h-32 w-32 overflow-hidden rounded-full shadow-2xl ring-4 ring-blue-200'>
                  <img
                    src={
                      teacher?.profile
                        ? getFileUrl(teacher.profile, 'public/teacher/profile')
                        : defaultProfile
                    }
                    alt='Instructor'
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                </div>
                <div className='absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] ring-4 ring-white'>
                  <User size={16} className='text-white' />
                </div>
              </div>
              <h2 className='mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                {teacher?.firstName} {teacher?.lastName}
              </h2>
              <p className='text-gray-600'>{teacher?.bio}</p>
            </div>
          </div>

          {/* Skills & Expertise Card */}
          <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2'>
                <Award className='h-5 w-5 text-white' />
              </div>
              <h3 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-xl font-bold text-transparent'>
                Skills & Expertise
              </h3>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-2xl bg-gray-50 p-4'>
                <span className='font-semibold text-gray-700'>
                  Qualification
                </span>
                <span className='font-medium text-gray-600'>
                  {teacher?.qualification}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Details and Courses */}
        <div className='space-y-6 lg:col-span-8'>
          {/* Basic Info */}
          <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl'>
            <h3 className='mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
              <div className='rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2'>
                <User className='h-5 w-5 text-white' />
              </div>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='rounded-2xl bg-gray-50 p-4 transition-all duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2'>
                    <Mail size={16} className='text-white' />
                  </div>
                  <div>
                    <div className='font-semibold text-gray-700'>Email</div>
                    <div className='text-gray-600'>{teacher?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className='rounded-3xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl'>
            <div className='p-8 pb-4'>
              <div className='mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
                <h3 className='flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                  <div className='rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2'>
                    <BookOpen className='h-5 w-5 text-white' />
                  </div>
                  Created Courses
                </h3>

                <div className='flex w-full items-center gap-3 md:w-auto'>
                  <SearchInput
                    placeholder={'Search courses...'}
                    value={searchInput}
                    onSubmit={handleSearchSubmit}
                    onChange={(e) => setSearchInput(e.target.value)}
                    isFetching={isFetching}
                  />
                </div>
              </div>
              <div className='mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
            </div>

            <div className='relative min-h-[400px]'>
              {courses && courses.length > 0 ? (
                <Suspense fallback={<DataTableSkeleton />}>
                  <DataTable
                    data={courses}
                    totalPages={totalPages}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    handlePagination={handlePagination}
                    columns={coursesSchemaStudent}
                    fetchStatus={fetchStatus}
                    isFetching={isFetching}
                    pagination={true}
                    paginationOptions={paginationOptions}
                  />
                </Suspense>
              ) : (
                <div className='flex flex-col items-center justify-center px-8 py-16'>
                  <div className='mb-6 rounded-full bg-blue-100 p-6'>
                    <BookOpen size={48} className='text-[#2563eb]' />
                  </div>
                  <h4 className='mb-2 text-xl font-semibold text-gray-600'>
                    No Courses Available
                  </h4>
                  <p className='max-w-md text-center text-gray-500'>
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
