import { Suspense, useCallback, useEffect,useState } from 'react'
import axios from 'axios'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  useNavigate,
  useRouter,
  useSearch,
  createFileRoute,
} from '@tanstack/react-router'
import { BookOpen, Users,UsersIcon } from 'lucide-react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { handleCourseEnrollment } from '../../../shared/config/reducers/student/studentAuthSlice'
import { Show } from '../../../shared/utils/Show'
import {
  checkSubscriptionStatus,
  isActiveSubscription,
} from '../../../shared/utils/helperFunction'
import {
  getDebounceInput,
  getRenderPaginationButtons,
  useSearchInput,
} from '../../../utils/globalFunctions'

const CoursesPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6 font-sans">
      <div className="relative mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-24 rounded bg-slate-200"></div>
            <div className="h-10 w-64 rounded bg-slate-200"></div>
            <div className="h-5 w-80 rounded bg-slate-200"></div>
          </div>
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-64 rounded-lg bg-slate-200"></div>
            <div className="h-10 w-20 rounded-lg bg-slate-200"></div>
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-md p-4"
            >
              {/* Image */}
              <div className="h-44 w-full rounded-xl bg-slate-200"></div>

              {/* Body */}
              <div className="mt-4 space-y-3">
                <div className="h-6 w-3/4 rounded bg-slate-200"></div>
                <div className="h-4 w-full rounded bg-slate-200"></div>
                <div className="h-4 w-1/2 rounded bg-slate-200"></div>

                {/* Mini Stats */}
                <div className="mt-2 flex justify-between pt-2 border-t border-slate-100">
                  <div className="h-3 w-10 rounded bg-slate-200"></div>
                  <div className="h-3 w-10 rounded bg-slate-200"></div>
                  <div className="h-3 w-16 rounded bg-slate-200"></div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="h-10 w-full rounded-lg bg-slate-200"></div>
                  <div className="h-10 w-full rounded-lg bg-slate-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-lg bg-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Constants
const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1516321310762-479e93c1e69e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
const BASE_STORAGE_URL = import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL
const MESSAGES = {
  noCourses: 'No courses found!',
  noCoursesDesc:
    'Try adjusting your search criteria or explore our featured categories.',
  subscriptionExpired: 'Your subscription has expired!',
  noSubscription: 'You need an active subscription to enroll in courses!',
  enrollmentLimit: 'You have exceeded the course enrollment limit!',
  enrolledSuccess: 'Course enrolled successfully!',
}

// Query options for fetching courses
export const coursesQueryOptions = ({ q, page, userID }) =>
  queryOptions({
    queryKey: ['courses', q, page, userID],
    queryFn: async () => {
      let queryStr = `page=${page}`
      if (q) queryStr += `&q=${q}`
      if (userID) queryStr += `&userID=${userID}`

      const response = await axios.get(`/web/course/get?${queryStr}`)
      if (response.data.success) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to fetch courses')
    },
    placeholderData: (prev) => prev,
  })

// Route definition WITHOUT loader
export const Route = createFileRoute('/student/courses/')({
  validateSearch: (search) => ({
    q: search.q || '',
    page: Number(search.page ?? 1),
  }),
  component: () => (
       <Suspense fallback={<CoursesPageSkeleton />}>
      <RouteComponent />
    </Suspense>
  ),
})

export function showLoader() {
  // agar already loader exist hai to dobara na banao
  if (document.getElementById('custom-loader')) return

  const loader = document.createElement('div')
  loader.id = 'custom-loader'
  loader.innerHTML = `
    <style>
      .custom-loader-container {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        background: transparent; /* no blur, clean bg */
      }
      .custom-spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>

    <div class="custom-loader-container">
      <div class="custom-spinner">
        <!-- Lucide Spinner Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="64" height="64" 
             viewBox="0 0 24 24" 
             fill="none" stroke="currentColor" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
             class="lucide lucide-loader-2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
    </div>
  `

  document.body.appendChild(loader)
}

function hideLoader() {
  const loader = document.getElementById('custom-loader')
  if (loader) {
    loader.remove()
  }
}



const MiniStats = ({ students = 1250, instructor }) => (
  <div className='mt-2 flex justify-between text-xs text-slate-600'>
    <div className='flex items-center gap-1'>
      <Users className='h-3 w-3' />
      <span>{students}</span>
    </div>
  
    <div className='flex items-center gap-1'>
      <UsersIcon className='h-3 w-3' />
      <span>
        {instructor?.firstName} {instructor?.lastName}
      </span>
    </div>
  </div>
)

function RouteComponent() {
    const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { q, page: currentPage } = useSearch({ from: '/student/courses/' })
  const [searchInput, setSearchInput] = useSearchInput('/student/courses/')
  const credentials = useSelector((s) => s.studentAuth.credentials,shallowEqual)
  const subscription = useSelector((s) => s.studentAuth.subscription,shallowEqual)
  const isLoggedIn = useSelector((s) => !!s.studentAuth.token)
  const [selectedEnrolledCourseID, setSelectedEnrolledCourseID] = useState('')

  const debouncedSearch = getDebounceInput(searchInput, 800)

  // Query
  const { data, isLoading } = useQuery(
    {...coursesQueryOptions({
      q: debouncedSearch,
      page: currentPage,
      userID: credentials?._id,
    }),suspense:true}
  )

useEffect(() => {
  const requestInterceptor = axios.interceptors.request.use(
    function (config) {
      showLoader()
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  const responseInterceptor = axios.interceptors.response.use(
    function (response) {
      hideLoader()
      return response
    },
    function (error) {
      hideLoader()
      return Promise.reject(error)
    }
  )

  // Cleanup interceptors when component unmounts
  return () => {
    axios.interceptors.request.eject(requestInterceptor)
    axios.interceptors.response.eject(responseInterceptor)
  }
}, [])

  
  // Prefetch next page for faster navigation
  useEffect(() => {
    if (currentPage < (data?.totalPages || 1)) {
      queryClient.prefetchQuery(
        coursesQueryOptions({
          q: debouncedSearch,
          page: currentPage + 1,
          userID: credentials?._id,
        })
      )
    }
  }, [currentPage, debouncedSearch, credentials?._id, data?.totalPages])

  const { courses = [], totalPages = 1, enrolledCourses = [] } = data || {}

  // Navigation
  const handleNavigation = useCallback(
    ({ page = currentPage, query = searchInput } = {}) => {
      navigate({
        to: '/student/courses',
        search: { page, q: query || undefined },
      })
    },
    [navigate, currentPage, searchInput]
  )

  const router = useRouter()

  // Enrollment mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (courseId) => {
      if (subscription && !isActiveSubscription(subscription)) {
        const status = checkSubscriptionStatus(subscription)
        if (status === 'past_due') {
          toast.error(MESSAGES.subscriptionExpired)
          navigate('/student/pay-invoice')
          throw new Error('Subscription expired')
        }
        toast.error(MESSAGES.noSubscription)
        navigate({ to: '/student/resubscription-plans' })
        throw new Error('No active subscription')
      }
      if (credentials?.remainingEnrollmentCount === 0) {
        toast.error(MESSAGES.enrollmentLimit)
        throw new Error('Enrollment limit exceeded')
      }

      const response = await axios.post('/student/course/enroll', { courseId })
      if (response.data.success) {
        const { remainingEnrollmentCount } = response.data.data
        dispatch(
          handleCourseEnrollment({ id: courseId, remainingEnrollmentCount })
        )
        toast.success(MESSAGES.enrolledSuccess)
        return response.data
      }
      throw new Error(response.data.message || 'Enrollment failed')
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(
        coursesQueryOptions({
          q: debouncedSearch,
          page: currentPage,
          userID: credentials?._id,
        })
      )
      await router.invalidate({ routeId: '/student/courses/' })
      setSelectedEnrolledCourseID('')
    },
  })

  const handleEnrollCourse = useCallback(
    (courseId) => {
      setSelectedEnrolledCourseID(courseId)
      mutate(courseId)
    },
    [mutate]
  )
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6 font-sans'>
      <div className='relative mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='space-y-2'>
            <div className='flex items-center text-sm text-slate-600'>
              <span>Home</span>
              <svg
                className='mx-2 h-4 w-4'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='font-medium text-slate-800'>Courses</span>
            </div>
            <h1 className='bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
              Available Courses
            </h1>
            <p className='text-lg text-slate-600'>
              Explore courses tailored for your learning journey
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative w-full max-w-sm'>
              <Input
                type='text'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNavigation()}
                placeholder='Search courses...'
                className='w-full rounded-lg border-slate-200 bg-white py-2.5 pr-10 pl-10 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                aria-label='Search courses'
              />
              <button
                onClick={() => handleNavigation()}
                className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-600 transition-all duration-200 hover:text-blue-600'
                aria-label='Search'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
              </button>
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('')
                    handleNavigation({ query: '' })
                  }}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-all duration-200 hover:text-red-500'
                  aria-label='Clear search'
                >
                  <svg
                    className='h-4 w-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              )}
            </div>
            <Button
              variant='outline'
              className='rounded-lg border-slate-200 text-slate-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600'
              aria-label='Filter courses'
            >
              <svg
                className='mr-2 h-4 w-4'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
                  clipRule='evenodd'
                />
              </svg>
              Filter
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <Show>
          <Show.When isTrue={courses.length > 0 && !isLoading}>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {courses.map((course) => {
                const coverImageUrl = course.coverImage
                  ? `${BASE_STORAGE_URL}public/courses/cover-images/${course.coverImage}`
                  : DEFAULT_COVER_IMAGE

                const isEnrolled =
                  isLoggedIn && enrolledCourses?.includes(course._id)

                return (
              <Card
  key={course._id}
  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500"
  role="article"
  aria-label={`Course: ${course.name}`}
>
  {/* Image Section */}
  <div className="relative h-44 overflow-hidden">
    <img
      src={coverImageUrl}
      alt={course.name || 'Course cover image'}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

    {/* Category Badge */}
    <div
      className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      title={`Category: ${course.category?.name || 'N/A'}`}
      tabIndex={0}
      aria-label={`Category: ${course.category?.name || 'N/A'}`}
    >
      {course.category?.name || 'N/A'}
    </div>

    {/* Enrolled Badge */}
    {isEnrolled && (
      <div
        className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 text-xs font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
        title="You are enrolled in this course"
        tabIndex={0}
        aria-label="Enrolled in this course"
      >
        <svg
          className="h-3 w-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
            01-1.414 0l-4-4a1 1 0 011.414-1.414L8 
            12.586l7.293-7.293a1 1 0 011.414 
            0z"
            clipRule="evenodd"
          />
        </svg>
        Enrolled
      </div>
    )}
  </div>

  {/* Body */}
  <div className="space-y-3 p-5">
    {/* Title */}
    <h3 className="line-clamp-2 text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">
      {course.name}
    </h3>

    {/* Description */}
    <p className="line-clamp-2 text-sm text-slate-600">{course.description}</p>

    {/* Stats */}
    <div className="border-t border-slate-100 pt-2">
      <MiniStats
        students={course.enrolledStudents}
        rating={course.rating}
        instructor={course.instructor}
      />
    </div>

    {/* Buttons */}
    <div className="space-y-2 pt-2">
      {isLoggedIn && !isEnrolled && (
        <Button
          disabled={isPending && selectedEnrolledCourseID === course._id}
          onClick={() => handleEnrollCourse(course._id)}
          className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 font-semibold text-white shadow-sm transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label={`Enroll in ${course.name}`}
          aria-pressed={isEnrolled}
          aria-busy={isPending && selectedEnrolledCourseID === course._id}
        >
          {isPending && selectedEnrolledCourseID === course._id ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
              Enrolling...
            </div>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
              Enroll Now
            </>
          )}
        </Button>
      )}

      <Button
        variant="outline"
        disabled={isPending && selectedEnrolledCourseID === course._id}
        onClick={() =>
          navigate({
            to: `/student/courses/${course._id}`,
            search: { userID: credentials?._id },
          })
        }
        className="w-full rounded-lg border-slate-200 text-slate-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={`View details of ${course.name}`}
      >
        <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
        View Details
      </Button>
    </div>

    {/* Live region for enrollment status updates */}
    <div
      aria-live="polite"
      className="sr-only"
      role="status"
      aria-atomic="true"
    >
      {isPending && selectedEnrolledCourseID === course._id
        ? `Enrolling in ${course.name}...`
        : isEnrolled
        ? `You are enrolled in ${course.name}`
        : ''}
    </div>
  </div>
</Card>

                )
              })}
            </div>
          </Show.When>
          <Show.When isTrue={!isLoading && courses.length === 0}>
         
         
              <div className='py-16 text-center'>
                <div className='mx-auto w-fit rounded-full bg-slate-100 p-6 shadow-inner'>
                  <BookOpen className='h-16 w-16 text-slate-300' />
                </div>
                <h3 className='mt-6 text-2xl font-bold text-slate-800'>
                  {MESSAGES.noCourses}
                </h3>
                <p className='mx-auto mt-2 max-w-md text-lg text-slate-600'>
                  {MESSAGES.noCoursesDesc}
                </p>
              </div>
          
          </Show.When>
        </Show>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-12 flex justify-center'>
            <div className='flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md'>
              {currentPage > 1 && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => handleNavigation({ page: currentPage - 1 })}
                  className='h-10 w-10 rounded-lg text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700'
                  aria-label='Previous page'
                >
                  <svg
                    className='h-4 w-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Button>
              )}
              {getRenderPaginationButtons(currentPage, totalPages, (page) =>
                handleNavigation({ page })
              )}
              {currentPage < totalPages && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => handleNavigation({ page: currentPage + 1 })}
                  className='h-10 w-10 rounded-lg text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700'
                  aria-label='Next page'
                >
                  <svg
                    className='h-4 w-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RouteComponent
