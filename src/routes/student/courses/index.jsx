import { Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useLoaderData,
  useSearch,
} from '@tanstack/react-router'
import { IconChalkboardTeacher } from '@tabler/icons-react'
import { BookOpen, Users, Clock, Star, Brain } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LoaderThree } from '@/components/ui/loader'
import { NavbarRouteComponent } from '../../-NavbarRouteComponent'
import { useAppUtils } from '../../../hooks/useAppUtils'
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

const coursesQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['courses', deps.q, deps.page],
    queryFn: async () => {
      const pageNumber = deps.page
      const searchQuery = deps.q
      console.log('deps ===>', deps)
      let queryStr = `page=${pageNumber}`
      if (searchQuery) {
        queryStr += `&q=${searchQuery}`
      }

      if (deps?.userID) {
        queryStr += `&userID=${deps.userID}`
      }

      try {
        let response = await axios.get(`/web/course/get?${queryStr}`)
        response = response.data
        if (response.success) {
          const { courses, totalPages, enrolledCourses } = response.data
          console.log('courses ===>', courses)
          return {
            courses: courses,
            totalPages: totalPages,
            enrolledCourses: enrolledCourses,
          }
        }
      } catch (error) {
        console.log('Registration Error -> ', error)
      }
    },
    placeholderData: (prev) => prev,
  })

const queryClient = new QueryClient()

export const Route = createFileRoute('/student/courses/')({
  validateSearch: (search) => {
    return {
      q: search.q || '',
      page: Number(search.page ?? 1),
      userID: search.userID || '',
    }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page, userID: search.userID }
  },
  loader: ({ deps }) =>
    queryClient.invalidateQueries(coursesQueryOptions(deps)),

  component: () => (
    <Suspense fallback={<LoaderThree className='text-[#2563eb]' />}>
      <RouteComponent />
    </Suspense>
  ),
})

const defaultCover =
  'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'

const MiniStats = ({ students = 1250, rating = 4.8, instructor }) => {
  return (
    <div className='mt-2 flex justify-between text-xs text-[#64748b]'>
      <div className='flex items-center gap-1'>
        <Users className='h-3 w-3' />
        <span>{students}</span>
      </div>
      <div className='flex items-center gap-1'>
        <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
        <span>{rating}</span>
      </div>
      <div className='flex items-center gap-1'>
        <IconChalkboardTeacher className='h-3 w-3' />
        <span>
          Instructor: {instructor?.firstName + ' ' + instructor?.lastName}
        </span>
      </div>
    </div>
  )
}

function RouteComponent() {
  const { navigate, dispatch, router } = useAppUtils()
  console.log('router.sate ===>', router.state)
  const currentPage = useSearch({
    from: '/student/courses/',
    select: (search) => search.page,
  })
  const queryClient = useQueryClient()
  const [selectedEnrolledCourseID, setSelectedEnrolledCourseID] = useState('')
  const isFirstRender = useRef(true)

  const [searchInput, setSearchInput] = useSearchInput('/student/courses/')
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)

  const debouncedSearch = getDebounceInput(searchInput, 800)
  const { data } = useQuery({
    ...coursesQueryOptions({
      q: debouncedSearch,
      page: currentPage,
      userID: credentials?._id,
    }),
    suspense: true,
  })
  const courses = data?.courses
  const totalPages = data?.totalPages
  const enrolledCourses = data?.enrolledCourses

  // Check if Student LoggedIn
  const isLoggedIn = useSelector((state) => state.studentAuth.token)
    ? true
    : false

  // Search & Pagination
  const searchCourses = () => {
    if (searchInput !== '') {
      navigate({ to: `/student/courses`, search: { page: 1, q: searchInput } })
    } else {
      navigate({ to: `/student/courses`, search: { page: 1 } })
    }
  }
  const handlePageChange = (page) => {
    if (searchInput !== '') {
      navigate({
        to: `/student/courses`,
        search: { page: page, q: searchInput },
      })
    } else {
      navigate({ to: '/student/courses', search: { page: page } })
    }
  }

  // API Methods
  const enrollCourse = async (id) => {
    if (subscription && !isActiveSubscription(subscription)) {
      if (checkSubscriptionStatus(subscription) === 'past_due') {
        toast.error('Subscription expired!')
        return navigate('/student/pay-invoice')
      }

      toast.error(
        'You have no subscription, subscribe some plan to enroll the course!'
      )
      return navigate({ to: '/student/resubscription-plans' })
    } else if (credentials && credentials.remainingEnrollmentCount === 0) {
      return toast.error('You have exceeded the limit of enrolling courses!')
    } else {
      try {
        let response = await axios.post('/student/course/enroll', {
          courseId: id,
        })
        response = response.data
        console.log('response.data course ===', response.data)
        if (response.success) {
          toast.success('Course enrolled!')
          const { remainingEnrollmentCount } = response.data
          dispatch(handleCourseEnrollment({ id, remainingEnrollmentCount }))
        }
      } catch (error) {
        console.log('Registration Error -> ', error)
      }
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const enrollCourseMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(
        coursesQueryOptions({
          suspense: false,
          q: searchInput,
          page: currentPage,
        })
      )
      setSelectedEnrolledCourseID('')
    },
  })
  const handleEnrollCourse = (courseID) => {
    setSelectedEnrolledCourseID(courseID)
    enrollCourseMutation.mutate(courseID)
  }

  return (
    <>
  <div 
    className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6'
    style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
  >
    {/* Enhanced Decorative Background Elements */}
    <div className='fixed inset-0 overflow-hidden pointer-events-none'>
      {/* Primary Blue Orbs */}
      <div className='absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#2563eb]/15 to-[#1d4ed8]/10 blur-3xl animate-pulse'></div>
      <div className='absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#2563eb]/15 to-[#1d4ed8]/10 blur-3xl animate-pulse' style={{ animationDelay: '2s' }}></div>
      
      {/* Secondary Accent Orbs */}
      <div className='absolute top-1/4 right-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-[#10b981]/10 to-[#059669]/5 blur-2xl animate-pulse' style={{ animationDelay: '1s' }}></div>
      <div className='absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-[#f59e0b]/10 to-[#d97706]/5 blur-2xl animate-pulse' style={{ animationDelay: '3s' }}></div>
      
      {/* Center Accent */}
      <div className='absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-[#2563eb]/8 to-[#1d4ed8]/5 blur-2xl'></div>
    </div>

    <div className='relative mx-auto max-w-7xl'>
      {/* Enhanced Header Section */}
      <div className='mb-8 flex w-full items-center justify-between'>
        <div className='space-y-2'>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-[#64748b]'>
            <span>Home</span>
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd' />
            </svg>
            <span className='text-[#1e293b] font-medium'>Courses</span>
          </div>
          
          {/* Main Title */}
          <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent'>
            Available Courses
          </h1>
          <p className='text-lg text-[#64748b]'>
            Discover and enroll in amazing courses tailored for your learning journey
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='text'
              className='w-80 rounded-[8px] border-2 border-[#e2e8f0] bg-white py-3 pr-12 pl-10 text-[#1e293b] placeholder-[#94a3b8] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#cbd5e1] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 focus:shadow-[0_4px_12px_rgba(37,99,235,0.1)]'
              placeholder='Search courses, categories, instructors...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCourses()}
            />
            
            {/* Search Icon */}
            <button
              onClick={searchCourses}
              className='absolute top-1/2 left-3 -translate-y-1/2 transform text-[#64748b] transition-all duration-200 hover:text-[#2563eb] hover:scale-110'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                />
              </svg>
            </button>
            
            {/* Clear Search */}
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className='absolute top-1/2 right-3 -translate-y-1/2 transform text-[#94a3b8] transition-all duration-200 hover:text-[#ef4444] hover:scale-110'
              >
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
              </button>
            )}
          </div>
          
          {/* Filter Button */}
          <Button
            variant="outline"
            className='px-4 py-3 rounded-[8px] border-2 border-[#e2e8f0] bg-white text-[#475569] hover:border-[#2563eb] hover:bg-[#2563eb]/5 hover:text-[#2563eb] transition-all duration-300'
          >
            <svg className='mr-2 h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z' clipRule='evenodd' />
            </svg>
            Filter
          </Button>
        </div>
      </div>

      {/* Enhanced Courses Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <Show>
          <Show.When isTrue={courses?.length > 0 || !router.state.isLoading}>
            {courses?.map((course, index) => {
              const coverImageUrl = course.coverImage
                ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/courses/cover-images/${course.coverImage}`
                : defaultCover
              
              const isEnrolled =
                isLoggedIn &&
                enrolledCourses?.length > 0 &&
                enrolledCourses?.some((c) => c === course._id)

              return (
                <Card
                  className='group relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#cbd5e1] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:scale-[1.02]'
                  key={index}
                >
                  {/* Enhanced Image Section */}
                  <div className='relative h-44 overflow-hidden'>
                    <img
                      src={coverImageUrl || '/placeholder.svg'}
                      alt={course.name}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    
                    {/* Multi-layered Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
                    <div className='absolute inset-0 bg-gradient-to-br from-[#2563eb]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    
                    {/* Enhanced Category Badge */}
                    <div className='absolute top-3 left-3 flex items-center space-x-1 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm border border-white/20'>
                      <div className='h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse'></div>
                      <span>{course.category?.name || 'N/A'}</span>
                    </div>

                    {/* Enhanced Enrollment Status */}
                    {isEnrolled && (
                      <div className='absolute top-3 right-3 flex items-center space-x-1 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm border border-white/20'>
                        <svg className='h-3 w-3 fill-current' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                        <span>Enrolled</span>
                      </div>
                    )}

                    {/* Hover Overlay Effects */}
                    <div className='absolute inset-0 bg-gradient-to-t from-[#2563eb]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </div>

                  {/* Enhanced Content Section */}
                  <div className='space-y-4 p-5'>
                    {/* Course Title & Description */}
                    <div className='space-y-3'>
                      <h3 className='line-clamp-2 text-lg font-bold text-[#1e293b] transition-all duration-300 group-hover:text-[#2563eb] leading-tight'>
                        {course.name}
                      </h3>
                      <p className='line-clamp-2 text-sm text-[#64748b] leading-relaxed'>
                        {course.description}
                      </p>
                    </div>

                    {/* Enhanced Stats Section */}
                    <div className='flex items-center justify-between border-t border-[#f1f5f9] pt-3'>
                      <div className='flex items-center space-x-4'>
                        {/* Students Count with Enhanced Icon */}
                        <div className='flex items-center space-x-1.5'>
                          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300'>
                            <svg className='h-3.5 w-3.5 text-[#64748b] group-hover:text-[#2563eb] transition-colors duration-300' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z'/>
                            </svg>
                          </div>
                          <span className='text-xs font-semibold text-[#64748b]'>{course.enrolledStudents}</span>
                        </div>
                        
                        {/* Instructor with Enhanced Icon */}
                        <div className='flex items-center space-x-1.5'>
                          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] group-hover:from-[#10b981]/10 group-hover:to-[#059669]/10 transition-all duration-300'>
                            <svg className='h-3.5 w-3.5 text-[#64748b] group-hover:text-[#10b981] transition-colors duration-300' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd'/>
                            </svg>
                          </div>
                          <span className='text-xs font-semibold text-[#64748b] truncate max-w-20'>
                            {course.instructor.firstName + " " + course.instructor.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className='space-y-2 pt-2'>
                      {/* Student Theme Enroll Button */}
                      {isLoggedIn && !isEnrolled && (
                        <Button
                          disabled={
                            enrollCourseMutation.isPending &&
                            selectedEnrolledCourseID === course._id
                          }
                          loading={
                            enrollCourseMutation.isPending &&
                            selectedEnrolledCourseID === course._id
                          }
                          onClick={() => handleEnrollCourse(course._id)}
                          className='w-full rounded-[8px] bg-gradient-to-r from-[#f59e0b] to-[#d97706] py-2.5 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(245,158,11,0.35)] hover:from-[#d97706] hover:to-[#b45309] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          <BookOpen className='mr-2 h-4 w-4' />
                          Enroll Now
                        </Button>
                      )}

                      {/* Enhanced View Details Button */}
                      <Button
                        disabled={
                          enrollCourseMutation.isPending &&
                          selectedEnrolledCourseID === course._id
                        }
                        onClick={() => {
                          navigate({ to: `/student/courses/${course._id}` })
                        }}
                        className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] py-2.5 font-semibold text-[#475569] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e2e8f0] hover:shadow-[0_4px_12px_rgba(71,85,105,0.15)] hover:border-[#cbd5e1] active:translate-y-0'
                      >
                        <BookOpen className='mr-2 h-4 w-4' />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Decorative Elements */}
                  <div className='absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#2563eb] to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]' />
                  <div className='absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-[#10b981]/0 via-[#10b981]/20 to-[#10b981]/0 opacity-0 transition-all duration-500 group-hover:opacity-100' />
                </Card>
              )
            })}
          </Show.When>
          
          {/* Enhanced Empty State */}
          <Show.Else>
            <div className='col-span-full py-16 text-center'>
              <div className='mx-auto w-fit rounded-full bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] p-6 shadow-inner'>
                <BookOpen className='mx-auto h-16 w-16 text-[#cbd5e1]' />
              </div>
              <h3 className='mt-6 text-2xl font-bold text-[#1e293b]'>No courses found!</h3>
              <p className='mt-2 text-[#64748b] text-lg max-w-md mx-auto'>
                Try adjusting your search criteria or explore our featured categories
              </p>
              <Button
                className='mt-6 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white px-6 py-3 rounded-[8px] shadow-sm hover:shadow-lg transition-all duration-300'
                onClick={() => setSearchInput('')}
              >
                Clear Search
              </Button>
            </div>
          </Show.Else>
        </Show>
      </div>

      {/* Enhanced Pagination */}
      <div className='mt-16 flex justify-center'>
        <div className='flex items-center gap-2 rounded-[12px] bg-white p-3 shadow-[0_8px_25px_rgba(0,0,0,0.08)] border border-[#e2e8f0]'>
          {currentPage > 1 && (
            <Button
              size='sm'
              variant='ghost'
              onClick={() => handlePageChange(currentPage - 1)}
              className='h-10 w-10 rounded-[8px] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] transition-all duration-200'
            >
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
            </Button>
          )}
          
          {getRenderPaginationButtons(currentPage, totalPages, handlePageChange)}
          
          {currentPage < totalPages && (
            <Button
              size='sm'
              variant='ghost'
              onClick={() => handlePageChange(currentPage + 1)}
              className='h-10 w-10 rounded-[8px] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] transition-all duration-200'
            >
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd' />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
</>
  )
}

export default RouteComponent
