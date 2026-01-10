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
  useSearchInput,
  getRenderPaginationButtons,
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
                    className={`group relative flex flex-col overflow-hidden rounded-[2rem] border-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] ${fetchStatus === 'fetching' && 'animate-pulse bg-slate-50 opacity-70'}`}
                    role='article'
                    aria-label={`Course: ${course.name}`}
                  >
                    {/* Image Section with Enhanced Effects */}
                    <div className='relative h-60 overflow-hidden'>
                      <img
                        src={coverImageUrl}
                        alt={course.name || 'Course cover image'}
                        className='h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110'
                        loading='lazy'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

                      {/* Hover Stats Section */}
                      <div className='absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-all duration-500 translate-y-6 group-hover:translate-y-0 group-hover:opacity-100'>
                        <div className='flex flex-col items-center rounded-2xl border border-white/30 bg-white/10 p-3 text-white backdrop-blur-md'>
                          <Users className='mb-1 h-5 w-5' />
                          <span className='text-xs font-bold leading-none'>{course.enrolledCount || 0}</span>
                        </div>
                        <div className='flex flex-col items-center rounded-2xl border border-white/30 bg-white/10 p-3 text-white backdrop-blur-md'>
                          <TableOfContents className='mb-1 h-5 w-5' />
                          <span className='text-xs font-bold leading-none'>{course.material?.length || 0}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className='absolute top-4 left-4 flex flex-col gap-2'>
                        <Badge className='w-fit rounded-xl border-white/20 bg-blue-600/90 py-1.5 px-3.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md'>
                          {course.category?.name || 'General'}
                        </Badge>
                        {isEnrolled && (
                          <Badge className='flex w-fit items-center gap-1.5 rounded-xl border-white/20 bg-emerald-500/90 py-1.5 px-3.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md'>
                            <Check className='h-3 w-3' />
                            Enrolled
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className='flex flex-1 flex-col p-6'>
                      <div className='mb-3 flex items-center gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white'>
                          <BookOpen className='h-4 w-4' />
                        </div>
                        <span className='text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400'>Elite Course</span>
                      </div>

                      <h3 className='mb-3 line-clamp-2 text-xl font-extrabold leading-tight text-slate-800 transition-colors duration-300 group-hover:text-blue-600'>
                        {course.name}
                      </h3>
                      <p className='line-clamp-2 text-sm leading-relaxed text-slate-500'>
                        {course.description}
                      </p>

                      <div className='mt-auto flex items-center gap-3 border-t border-slate-50 pt-5'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 ring-2 ring-white'>
                          <UserCircle2 className='h-6 w-6 text-slate-400' />
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>Curated by</span>
                          <span className='text-xs font-extrabold text-slate-700'>
                            {course.instructor?.firstName ? `${course.instructor.firstName} ${course.instructor.lastName || ''}` : 'Academy Expert'}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Action Footer with Glass Design */}
                    <CardFooter className='grid grid-cols-2 gap-4 bg-slate-50/50 p-5 backdrop-blur-sm'>
                      <Button
                        onClick={() =>
                          navigate({
                            to: `/student/courses/${course._id}`,
                            search: { userID: credentials?._id },
                          })
                        }
                        className='h-12 rounded-2xl bg-slate-900 font-bold text-white shadow-xl shadow-slate-200 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-600 hover:shadow-blue-200 active:scale-95'
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        View
                      </Button>

                      <Popover
                        onOpenChange={(open) => {
                          if (!open) {
                            queryClient.removeQueries({ queryKey: ['course-details', courseID] })
                            setCourseFetch(false)
                            setCourseID('')
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            onClick={() => {
                              setCourseID(course._id)
                              setCourseFetch(true)
                            }}
                            className='h-12 rounded-2xl border-2 border-slate-200 bg-white font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg active:scale-95'
                          >
                            <Info className='mr-2 h-4 w-4' />
                            Details
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          side='top'
                          align='center'
                          className='z-50 w-80 overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/80 p-0 shadow-2xl backdrop-blur-2xl transition-all'
                        >
                          {courseLoading ? (
                            <div className='flex h-64 items-center justify-center gap-3 p-10'>
                              <div className='h-4 w-4 animate-bounce rounded-full bg-blue-600' />
                              <div className='h-4 w-4 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]' />
                              <div className='h-4 w-4 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]' />
                            </div>
                          ) : (
                            <Tabs defaultValue='overview' className='flex flex-col'>
                              <TabsList className='grid h-16 w-full grid-cols-3 bg-slate-100/50 p-1.5'>
                                <TabsTrigger value='overview' className='rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-md'>About</TabsTrigger>
                                <TabsTrigger value='materials' className='rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-md'>Modules</TabsTrigger>
                                <TabsTrigger value='instructor' className='rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-md'>Expert</TabsTrigger>
                              </TabsList>

                              <div className='p-8'>
                                <TabsContent value='overview' className='mt-0 space-y-6'>
                                  <div className='space-y-2'>
                                    <span className='text-[10px] font-black uppercase tracking-widest text-blue-600'>Curriculum Description</span>
                                    <p className='line-clamp-4 text-sm font-medium leading-relaxed text-slate-600 italic'>
                                      "{courseDetails?.description || 'This course is architected to provide a holistic understanding of the subject matter.'}"
                                    </p>
                                  </div>
                                  <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex flex-col rounded-2xl bg-blue-50/50 p-4'>
                                      <Users className='mb-2 h-4 w-4 text-blue-600' />
                                      <span className='text-xs font-black text-slate-400'>Learners</span>
                                      <span className='text-sm font-bold text-slate-800'>{courseDetails?.enrolledCount || 0}+</span>
                                    </div>
                                    <div className='flex flex-col rounded-2xl bg-purple-50/50 p-4'>
                                      <Clock11 className='mb-2 h-4 w-4 text-purple-600' />
                                      <span className='text-xs font-black text-slate-400'>Last Build</span>
                                      <span className='text-sm font-bold text-slate-800'>
                                        {courseDetails?.updatedAt ? format(courseDetails.updatedAt, 'MMM yyyy') : 'Recent'}
                                      </span>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value='materials' className='mt-0'>
                                  <div className='mb-4'>
                                    <h4 className='text-[10px] font-black uppercase tracking-widest text-blue-600'>Digital Assets included</h4>
                                  </div>
                                  {courseDetails?.material?.length ? (
                                    <div className='scrollbar-none max-h-56 space-y-3 overflow-y-auto pr-2'>
                                      {courseDetails.material.map((mat) => (
                                        <div
                                          key={mat._id}
                                          className='flex items-center gap-3 rounded-2xl border border-slate-50 bg-white p-4 transition-all hover:scale-[1.02] hover:border-blue-100 hover:shadow-md'
                                        >
                                          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50'>
                                            <File className='h-4 w-4 text-blue-500' />
                                          </div>
                                          <div className='flex flex-col'>
                                            <span className='text-xs font-bold text-slate-800'>{mat.title}</span>
                                            <span className='text-[9px] font-black uppercase text-slate-400'>Learning Material</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className='flex flex-col items-center py-10 text-center'>
                                      <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50'>
                                        <BookOpen className='h-6 w-6 text-slate-200' />
                                      </div>
                                      <p className='text-xs font-bold text-slate-400'>Curriculum schedule being finalized.</p>
                                    </div>
                                  )}
                                </TabsContent>

                                <TabsContent value='instructor' className='mt-0'>
                                  <div className='flex flex-col items-center py-2 text-center'>
                                    <div className='relative mb-6'>
                                      <div className='h-24 w-24 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-2xl shadow-blue-200' />
                                      <UserCircle2 className='absolute inset-0 m-auto h-12 w-12 text-white/90' />
                                      <div className='absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg ring-4 ring-white'>
                                        <Check className='h-4 w-4 text-white' />
                                      </div>
                                    </div>
                                    <h3 className='text-xl font-black text-slate-800'>
                                      {courseDetails?.instructor?.firstName ? `${courseDetails.instructor.firstName} ${courseDetails?.instructor.lastName || ''}` : 'Verified Faculty'}
                                    </h3>
                                    <p className='mt-2 text-sm font-medium leading-relaxed text-slate-400'>
                                      {courseDetails?.instructor?.bio || 'Distinguished industry professional with extensive field experience and academic contributions.'}
                                    </p>
                                  </div>
                                </TabsContent>
                              </div>

                              <div className='border-t border-slate-50 bg-slate-50/50 p-6'>
                                <Button
                                  className='h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95'
                                  onClick={() => navigate({ to: `/student/courses/${course._id}` })}
                                >
                                  Enter Classroom
                                </Button>
                              </div>
                            </Tabs>
                          )}
                        </PopoverContent>
                      </Popover>
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
