import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useNavigate,
  useRouter,
  useSearch,
  createFileRoute,
} from '@tanstack/react-router'
import {
  BookOpen,
  Check,
  Clock,
  Delete,
  Eye,
  Search,
  UserCircle2,
  Users,
  User,
  Info,
  TableOfContents,
  File,
  ChevronLeft,
  ChevronRight,
  Clock11,
} from 'lucide-react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { toast } from 'sonner'
// Badges (for category / enrolled)
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
// Collapsible (for Materials)
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Separator (to divide sections)
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
// Tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { Show } from '../../../shared/utils/Show'
import {
  useDebounceInput,
  getFileUrl,
} from '@/utils/globalFunctions'
import Pagination from '../../_authenticated/student/-components/Pagination'

const CoursesPageSkeleton = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6 font-sans'>
      <div className='relative mx-auto max-w-7xl'>
        {/* Header Skeleton */}
        <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='animate-pulse space-y-3'>
            <div className='h-4 w-24 rounded bg-slate-200'></div>
            <div className='h-10 w-64 rounded bg-slate-200'></div>
            <div className='h-5 w-80 rounded bg-slate-200'></div>
          </div>
          <div className='flex animate-pulse items-center gap-3'>
            <div className='h-10 w-64 rounded-lg bg-slate-200'></div>
            <div className='h-10 w-20 rounded-lg bg-slate-200'></div>
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-md'
            >
              {/* Image */}
              <div className='h-44 w-full rounded-xl bg-slate-200'></div>

              {/* Body */}
              <div className='mt-4 space-y-3'>
                <div className='h-6 w-3/4 rounded bg-slate-200'></div>
                <div className='h-4 w-full rounded bg-slate-200'></div>
                <div className='h-4 w-1/2 rounded bg-slate-200'></div>

                {/* Mini Stats */}
                <div className='mt-2 flex justify-between border-t border-slate-100 pt-2'>
                  <div className='h-3 w-10 rounded bg-slate-200'></div>
                  <div className='h-3 w-10 rounded bg-slate-200'></div>
                  <div className='h-3 w-16 rounded bg-slate-200'></div>
                </div>

                {/* Buttons */}
                <div className='space-y-2 pt-2'>
                  <div className='h-10 w-full rounded-lg bg-slate-200'></div>
                  <div className='h-10 w-full rounded-lg bg-slate-200'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className='mt-12 flex justify-center'>
          <div className='flex animate-pulse items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-10 w-10 rounded-lg bg-slate-200'></div>
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
export const coursesQueryOptions = ({ q, page, userID, category, sort }) =>
  queryOptions({
    queryKey: ['courses', q, page, userID, sort, category],
    queryFn: async () => {
      let queryStr = `page=${page}`
      if (q) queryStr += `&q=${q}`
      if (userID) queryStr += `&userID=${userID}`
      if (sort) queryStr += `&sort=${sort}`
      if (category) queryStr += `&category=${category}`

      const response = await axios.get(`/web/course/get?${queryStr}`)
      if (response.data.success) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to fetch courses')
    },
    placeholderData: (prev) => prev,
    keepPreviousData: true,
  })

// Route definition WITHOUT loader
export const Route = createFileRoute('/student/courses/')({
  validateSearch: (search) => ({
    q: search.q || '',
    page: Number(search.page ?? 1),
    sort: search?.sort ?? 'newest',
    category: search?.category ?? 'All',
    userID: search?.userID,
  }),
  component: () => (
    <Suspense fallback={<CoursesPageSkeleton />}>
      <RouteComponent />
    </Suspense>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    page: currentPage,
    sort,
    category,
  } = useSearch({ from: '/student/courses/' })
  const [searchInput, setSearchInput] = useSearchInput('/student/courses/')
  const credentials = useSelector(
    (s) => s.studentAuth.credentials,
    shallowEqual
  )

  const isLoggedIn = useSelector((s) => !!s.studentAuth.token)
  const [sortOrder, setSortOrder] = useState(sort)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)

  const handlePageChange = async (page) => {
    if (searchInput !== '') {
      navigate({
        to: `/student/courses`,
        search: { page: page, q: searchInput },
      })
    } else {
      navigate({
        to: `/student/courses`,
        search: { page: page, q: `` },
      })
    }
    await queryClient.invalidateQueries(
      coursesQueryOptions({ q: searchInput, page })
    )
  }

  // Query
  const { data, isLoading, fetchStatus } = useQuery({
    ...coursesQueryOptions({
      q: debouncedSearch,
      page: currentPage,
      userID: credentials?._id,
      sort: sortOrder,
      category: selectedCategory,
    }),
    suspense: true,
  })
  const { courses = [], totalPages = 1, enrolledCourses = [] } = data || {}

  const paginationButtons = useMemo(
    () => getRenderPaginationButtons(currentPage, totalPages, handlePageChange),
    [currentPage, totalPages]
  )

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

  useEffect(() => {
    navigate({
      to: '/student/courses',
      search: {
        q: debouncedSearch,
        category: selectedCategory,
        sort: sortOrder,
        page: 1,
        userID: credentials?._id,
      },
      replace: true,
    })
  }, [selectedCategory, sortOrder])

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
  }

  const handleSortChange = (value) => {
    setSortOrder(value)
  }

  const categories = [
    { _id: '1', name: 'Web Development' },
    { _id: '2', name: 'Data Science' },
    { _id: '3', name: 'Graphic Design' },
    { _id: '4', name: 'Digital Marketing' },
    { _id: '5', name: 'Mobile App Development' },
    { _id: '6', name: 'Cybersecurity' },
    { _id: '7', name: 'Artificial Intelligence' },
    { _id: '8', name: 'test course category' },
    { _id: '9', name: 'Content Writing' },
    { _id: '10', name: 'UI/UX Design' },
  ]
  const [courseID, setCourseID] = useState('')
  const [courseFetch, setCourseFetch] = useState(false)

  const { data: courseDetails, isLoading: courseLoading } = useQuery({
    queryKey: ['course-details', courseID],
    queryFn: async () => {
      const res = await axios.get(`/web/course/get/details/${courseID}`)
      return res.data.data
    },
    enabled: !!courseFetch && !!courseID,
    keepPreviousData: false,
    placeholderData: undefined,
    staleTime: 0,
    cacheTime: 0,
    retry: false,
  })

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
          <div className='flex items-center gap-4'>
            {/* Search Bar */}
            <div className='relative flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200/50 bg-white/90 p-1.5 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg'>
              <Button
                onClick={() => handleNavigation()}
                aria-label='Search'
                variant='outline'
                size='sm'
                className='rounded-lg border-slate-200 bg-white/50 text-slate-800 transition-all duration-300 hover:scale-105 hover:bg-blue-50'
              >
                <Search className='h-5 w-5' />
              </Button>
              <Input
                type='text'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNavigation()}
                placeholder='Search courses...'
                className='w-full rounded-lg border-slate-200 bg-transparent py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50'
                aria-label='Search courses'
              />
              {searchInput && (
                <Button
                  onClick={() => {
                    setSearchInput('')
                    handleNavigation({ query: '' })
                  }}
                  variant='outline'
                  className='rounded-lg border-slate-200 text-red-500 transition-all duration-300 hover:scale-105 hover:bg-red-50'
                  aria-label='Clear search'
                >
                  <Delete className='h-5 w-5' />
                </Button>
              )}
            </div>

            {/* Filters Section */}
            <div className='flex items-center gap-3'>
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  handleCategoryChange(value)
                }}
              >
                <SelectTrigger
                  className='w-44 rounded-xl border-slate-200 bg-white/90 py-3 text-sm font-medium text-slate-800 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-blue-50 focus:ring-2 focus:ring-blue-200/50'
                  onClick={() => console.log('select triggered')}
                >
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent className='rounded-xl border border-slate-200/50 bg-white/95 shadow-lg backdrop-blur-md'>
                  <SelectItem
                    value='All'
                    className='text-sm text-slate-700 hover:bg-blue-50'
                  >
                    All
                  </SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem
                      key={cat._id}
                      value={cat.name}
                      className='text-sm text-slate-700 hover:bg-blue-50'
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select
                value={sortOrder}
                onValueChange={(value) => {
                  handleSortChange(value)
                }}
              >
                <SelectTrigger className='w-40 rounded-xl border-slate-200 bg-white/90 py-3 text-sm font-medium text-slate-800 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-blue-50 focus:ring-2 focus:ring-blue-200/50'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent className='rounded-xl border border-slate-200/50 bg-white/95 shadow-lg backdrop-blur-md'>
                  <SelectItem
                    value='newest'
                    className='text-sm text-slate-700 hover:bg-blue-50'
                  >
                    Newest
                  </SelectItem>
                  <SelectItem
                    value='oldest'
                    className='text-sm text-slate-700 hover:bg-blue-50'
                  >
                    Oldest
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <Show>
          <Show.When isTrue={courses.length > 0 && !isLoading}>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {courses.map((course) => {
                const coverImageUrl = course.coverImage
                  ? getFileUrl(course.coverImage, 'public/courses/cover-images')
                  : DEFAULT_COVER_IMAGE

                const isEnrolled =
                  isLoggedIn && enrolledCourses?.includes(course._id)
                return (
                  <Card
                    key={course._id}
                    className={`group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-500 focus-within:ring-4 focus-within:ring-blue-500/50 hover:-translate-y-2 hover:bg-white/95 hover:shadow-2xl ${fetchStatus === 'fetching' && 'bg-accent/50 animate-pulse'}`}
                    role='article'
                    aria-label={`Course: ${course.name}`}
                  >
                    {/* Image Section */}
                    <div className='relative h-56 overflow-hidden'>
                      <img
                        src={coverImageUrl}
                        alt={course.name || 'Course cover image'}
                        className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
                        loading='lazy'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 group-hover:from-black/70' />

                      {/* Category Badge */}
                      <Badge
                        className='absolute top-4 left-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-md ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105'
                        title={`Category: ${course.category?.name || 'General'}`}
                      >
                        {course.category?.name || 'General'}
                      </Badge>

                      {/* Enrolled Badge */}
                      {isEnrolled && (
                        <Badge className='absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105'>
                          <Check size={16} />
                          Enrolled
                        </Badge>
                      )}
                    </div>

                    {/* Body */}
                    <CardContent className='space-y-4 p-5'>
                      <h3 className='line-clamp-2 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600'>
                        {course.name}
                      </h3>
                      <p className='line-clamp-2 text-sm leading-relaxed text-slate-600'>
                        {course.description}
                      </p>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className='flex flex-col gap-3 px-5 pb-5'>
                      <div className='flex w-full items-center gap-3'>
                        {/* View Button */}
                        <Button
                          onClick={() =>
                            navigate({
                              to: `/student/courses/${course._id}`,
                              search: { userID: credentials?._id },
                            })
                          }
                          className='w-1/2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                        >
                          <Eye className='mr-1.5 h-4 w-4' />
                          View
                        </Button>

                        {/* Popover with structured content */}
                        <Popover
                          onOpenChange={(open) => {
                            if (!open) {
                              queryClient.removeQueries({
                                queryKey: ['course-details', courseID],
                              })
                              setCourseFetch(false)
                              setCourseID('')
                            }
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  onClick={() => {
                                    setCourseID(course._id)
                                    setCourseFetch(true)
                                  }}
                                  className='w-1/2 rounded-xl border-blue-600 bg-blue-50/30 py-2.5 font-medium text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-50'
                                >
                                  <Info className='mr-1.5 h-4 w-4' />
                                  Details
                                </Button>
                              </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent className='rounded-lg bg-blue-600 p-2 text-sm text-white'>
                              Quick course stats and instructor info
                            </TooltipContent>
                          </Tooltip>

                          <PopoverContent
                            side='top'
                            align='center'
                            className='w-80 space-y-4 rounded-2xl border border-slate-200/50 bg-white/95 p-5 text-sm shadow-xl backdrop-blur-md transition-all duration-300'
                          >
                            {courseLoading ? (
                              <div className='h-64 w-full animate-pulse rounded-lg bg-slate-200/50' />
                            ) : (
                              <>
                                {/* Tabs for structured info */}
                                <Tabs
                                  defaultValue='overview'
                                  className='space-y-3'
                                >
                                  <TabsList className='grid w-full grid-cols-3'>
                                    <TabsTrigger value='overview'>
                                      Overview
                                    </TabsTrigger>
                                    <TabsTrigger value='materials'>
                                      Materials
                                    </TabsTrigger>
                                    <TabsTrigger value='instructor'>
                                      Instructor
                                    </TabsTrigger>
                                  </TabsList>

                                  {/* Overview */}
                                  <TabsContent
                                    value='overview'
                                    className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-36 space-y-2 overflow-y-auto'
                                  >
                                    <p className='text-slate-700'>
                                      {courseDetails?.description ||
                                        'No description available.'}
                                    </p>
                                    <div className='space-y-2 border-t border-slate-200/50 pt-2'>
                                      <div className='flex items-center gap-2 text-slate-700'>
                                        <Users className='h-4 w-4 text-blue-500' />
                                        <span>
                                          {courseDetails?.enrolledCount || 0}{' '}
                                          students enrolled
                                        </span>
                                      </div>
                                      {courseDetails?.updatedAt && (
                                        <div className='flex items-center gap-2 text-slate-700'>
                                          <Clock className='h-4 w-4 text-blue-500' />
                                          <span>
                                            Updated{' '}
                                            {format(
                                              courseDetails.updatedAt,
                                              'PPP'
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>

                                  {/* Materials */}
                                  <TabsContent
                                    value='materials'
                                    className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-36 overflow-y-auto'
                                  >
                                    {courseDetails?.material?.length ? (
                                      <Collapsible>
                                        <CollapsibleTrigger className='w-full rounded-lg bg-blue-50 px-3 py-2 text-left font-medium transition hover:bg-blue-100'>
                                          Show Materials
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-32 space-y-1 overflow-y-auto px-2 py-2'>
                                          {courseDetails.material.map((mat) => (
                                            <p
                                              key={mat._id}
                                              className='rounded bg-[whitesmoke] px-2 py-1 text-sm text-slate-700'
                                            >
                                              {mat.title}
                                            </p>
                                          ))}
                                        </CollapsibleContent>
                                      </Collapsible>
                                    ) : (
                                      <p className='text-slate-500'>
                                        No materials available.
                                      </p>
                                    )}
                                  </TabsContent>

                                  {/* Instructor */}
                                  <TabsContent
                                    value='instructor'
                                    className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-36 space-y-2 overflow-y-auto'
                                  >
                                    <div className='flex items-center gap-2 text-slate-700'>
                                      <User className='h-4 w-4 text-blue-500' />
                                      <span>
                                        {courseDetails?.instructor?.firstName
                                          ? `${courseDetails.instructor.firstName} ${courseDetails?.instructor.lastName || ''}`
                                          : 'Unknown Instructor'}
                                      </span>
                                    </div>
                                    {courseDetails?.instructor?.bio && (
                                      <p className='text-sm text-slate-600'>
                                        {courseDetails.instructor.bio}
                                      </p>
                                    )}
                                  </TabsContent>
                                </Tabs>

                                <Separator className='my-2' />

                                {/* Quick Actions */}
                                <div className='flex gap-2'>
                                  <Button
                                    size='sm'
                                    className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                    onClick={() =>
                                      navigate({
                                        to: `/student/courses/${course._id}`,
                                      })
                                    }
                                  >
                                    <Eye className='mr-1 h-4 w-4' />
                                    View Course
                                  </Button>
                                </div>
                              </>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </CardFooter>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleNavigation}
          paginationButtons={paginationButtons}
        />
      </div>
    </div>
  )
}

export default RouteComponent
