import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createFileRoute,
  Outlet,
  redirect,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  CheckCircle,
  Lock,
  Share2,
  Heart,
  ImageIcon,
  Video,
  FileText,
  ArrowLeft,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppUtils } from '../../../hooks/useAppUtils'
import {
  checkSubscriptionStatus,
  getCookie,
  isActiveSubscription,
} from '../../../shared/utils/helperFunction'
import store from '../../../shared/config/store/store'
import { openModal } from '../../../shared/config/reducers/student/studentDialogSlice'

const courseQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['getCourse', deps.courseID, deps.userID],
    queryFn: async () => {
      console.log('deps ===>', deps)
      let queryStr = `courseID=${deps.courseID}`
      if (deps?.userID) {
        queryStr += `&userID=${deps.userID}`
      }

      try {
        let response = await axios.get(`/web/course/getCourse?${queryStr}`)
        response = response.data
        if (response.success) {
          response = response.data
          console.log('response ===>', response)
          return {
            course: response.course,
            isEnrolled: response.isEnrolled,
            enrolledStudents: response.enrolledStudents,
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  })

const queryClient = new QueryClient()

export const Route = createFileRoute('/student/courses/$courseID')({
  beforeLoad: ({ params }) => {
    const token = getCookie('studentToken')
    const credentials = getCookie('studentCredentials')
        const subscription = getCookie('studentSubscription')

    if (token && credentials) {
      if (credentials?.customerId && !subscription) {
        throw redirect({
          to: '/student/resubscription-plans',
          replace: true,
          search: { redirect: `/student/courses/${params.courseID}` },
        })
      } else if (!subscription) {
        throw redirect({
          to: '/student/subscription-plans',
          replace: true,
          search: { redirect: `/student/courses/${params.courseID}` },
        })
      } else if (subscription?.status !== 'active' && subscription?.subscriptionId) {
        throw redirect({
          to: '/student/failed-subscription',
          replace: true,
          search: { redirect: `/student/courses/${params.courseID}` },
        })
      } else {
        return <Outlet />
      }
    } else {
      
      store.dispatch(openModal({type:'login-modal',props:{redirect: `/student/courses/${params.courseID}`}}))
     
    throw redirect({
      to: '/student/courses', 
      replace: true,
    })
    }
  },
  validateSearch: (search) => {
    return { courseID: search.courseID, userID: search.userID || '' }
  },
  loaderDeps: ({ search }) => {
    return { courseID: search.courseID, userID: search.userID }
  },
  loader: ({ params }) =>
    queryClient.ensureQueryData(courseQueryOptions(params)),
  component: RouteComponent,
})

function MiniProgressChart({ progress, color = '#2563eb' }) {
  return (
    <div className='flex items-center gap-2'>
      <div className='h-2 w-16 overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-full rounded-full transition-all duration-500'
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
      <span className='text-xs font-medium text-gray-600'>{progress}%</span>
    </div>
  )
}

// Mini Rating Chart Component
function MiniRatingChart({ rating, reviews }) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-3 w-3 ${i < rating ? `fill-yellow-400 text-yellow-400` : `text-gray-300`}`}
    />
  ))

  return (
    <div className='flex items-center gap-1'>
      <div className='flex'>{stars}</div>
      <span className='text-xs text-gray-600'>({reviews})</span>
    </div>
  )
}
function RouteComponent() {
  const params = useParams({ from: '/student/courses/$courseID' })
  const [loading, setLoading] = useState(true)
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)

  const { data } = useQuery(
    courseQueryOptions({ courseID: params.courseID, userID: credentials?._id })
  )
  const course = data?.course
  const isEnrolled = data?.isEnrolled
  const enrolledStudents = data?.enrolledStudents
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (course) {
      setLoading(false)
    }
  }, [course])

  const handleMediaAccess = (material) => {
    if (!isEnrolled) {
      toast.warning(
        'Please enroll in this course to access the material content.'
      )
      return
    }
    if (material.media) {
      window.open(material.media, '_blank')
    }
  }

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon className='h-4 w-4' />
      case 'video':
        return <Video className='h-4 w-4' />
      case 'document':
        return <FileText className='h-4 w-4' />
      default:
        return <FileText className='h-4 w-4' />
    }
  }

  const { navigate, dispatch } = useAppUtils()

  // API Methods
  const enrollCourse = async () => {
    if (subscription && !isActiveSubscription(subscription)) {
      if (checkSubscriptionStatus(subscription) === 'past_due') {
        toast.error('Subscription expired!')
        return navigate('/student/pay-invoice')
      }
      
      toast.error(
        'You have no subscription, subscribe some plan to enroll the course!'
      )
      return navigate({ to: '/student/subscription-plans' })
    } else if (credentials && credentials.remainingEnrollmentCount === 0) {
      return toast.error('You have exceed the limit of enrolling courses!')
    } else {
      try {
        let response = await axios.post('/student/course/enroll', {
          courseId: params.courseID,
        })
        response = response.data
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

  const queryClient = useQueryClient()
  const enrollCourseMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(
        courseQueryOptions({
          courseID: params.courseID,
          userID: credentials?._id,
        })
      )
    },
  })

  const handleEnroll = async () => {
    enrollCourseMutation.mutate()
  }

  if (loading) {
    return (
      <div 
        className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6'
        style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
      >
        <div className='mx-auto max-w-7xl'>
          <div className='animate-pulse space-y-6'>
            <div className='h-8 w-1/3 rounded-[12px] bg-[#e2e8f0]'></div>
            <div className='h-64 rounded-[12px] bg-[#e2e8f0]'></div>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              <div className='space-y-4 lg:col-span-2'>
                <div className='h-32 rounded-[12px] bg-[#e2e8f0]'></div>
                <div className='h-48 rounded-[12px] bg-[#e2e8f0]'></div>
              </div>
              <div className='h-96 rounded-[12px] bg-[#e2e8f0]'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/defaults/course-cover.png`

  return (
    <div 
      className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]'
      style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
    >
      {/* Enhanced Hero Section */}
      <div className='relative bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white overflow-hidden'>
        {/* Decorative Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/10 to-white/5 blur-3xl'></div>
          <div className='absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#f59e0b]/20 to-[#d97706]/10 blur-2xl'></div>
        </div>

        <div className='relative mx-auto max-w-7xl px-6 py-12'>
          {/* Enhanced Back Button */}
          <Button
            size='sm'
            variant='outline'
            className='group mb-6 border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-lg'
            onClick={() => window.history.back()}
          >
            <ArrowLeft className='h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1' />
            <span className='ml-2 hidden sm:inline font-medium'>Back to Courses</span>
          </Button>

          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-6'>
              {/* Category Badge */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm border border-white/20'>
                  <BookOpen className='h-4 w-4' />
                  <span>{course?.category?.name || 'N/A'}</span>
                </div>
                {isEnrolled && (
                  <div className='flex items-center gap-2 rounded-full bg-[#10b981]/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm border border-[#10b981]/30'>
                    <CheckCircle className='h-4 w-4 text-[#10b981]' />
                    <span className='text-[#10b981]'>Enrolled</span>
                  </div>
                )}
              </div>

              {/* Course Title */}
              <h1 className='text-4xl font-bold leading-tight lg:text-5xl'>
                {course.name}
              </h1>

              {/* Description */}
              <p className='text-xl leading-relaxed text-white/90 line-clamp-3'>
                {course.description}
              </p>

              {/* Stats */}
              <div className='flex flex-wrap items-center gap-6 text-sm'>
                <div className='flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm'>
                  <Users className='h-4 w-4' />
                  <span className='font-medium'>{enrolledStudents} students</span>
                </div>
                <div className='flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm'>
                  <FileText className='h-4 w-4' />
                  <span className='font-medium'>{course.material?.length || 0} materials</span>
                </div>
              </div>
            </div>

            {/* Enhanced Course Image */}
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-br from-[#f59e0b]/20 to-transparent rounded-[12px]'></div>
              <img
                src={
                  course?.coverImage
                    ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/courses/cover-images/${course?.coverImage}`
                    : defaultCover
                }
                alt={course.name}
                className='w-full rounded-[12px] shadow-2xl border border-white/20'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Enhanced Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] rounded-[12px] p-1'>
                <TabsTrigger
                  value='overview'
                  className='data-[state=active]:bg-[#f59e0b] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748b] font-medium rounded-[8px] transition-all duration-200'
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value='materials'
                  className='data-[state=active]:bg-[#f59e0b] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748b] font-medium rounded-[8px] transition-all duration-200'
                >
                  Materials
                </TabsTrigger>
                <TabsTrigger
                  value='instructor'
                  className='data-[state=active]:bg-[#f59e0b] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748b] font-medium rounded-[8px] transition-all duration-200'
                >
                  Instructor
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value='overview' className='space-y-6'>
                <Card className='border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-[12px] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]'>
                  <CardHeader className='border-b border-[#f1f5f9]'>
                    <CardTitle className='flex items-center gap-3 text-[#1e293b]'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10'>
                        <BookOpen className='h-5 w-5 text-[#2563eb]' />
                      </div>
                      Course Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <p className='mb-8 leading-relaxed text-[#64748b] text-lg'>
                      {course.description}
                    </p>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                      <div className='rounded-[12px] bg-gradient-to-br from-[#10b981]/5 to-[#059669]/5 p-6 text-center border border-[#10b981]/10'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981]'>
                          <Users className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-[#1e293b]'>
                          {enrolledStudents}
                        </div>
                        <div className='text-sm font-medium text-[#64748b]'>Students Enrolled</div>
                      </div>
                      <div className='rounded-[12px] bg-gradient-to-br from-[#2563eb]/5 to-[#1d4ed8]/5 p-6 text-center border border-[#2563eb]/10'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]'>
                          <FileText className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-[#1e293b]'>
                          {course.material?.length || 0}
                        </div>
                        <div className='text-sm font-medium text-[#64748b]'>Learning Materials</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value='materials' className='space-y-4'>
                <Accordion type='single' collapsible className='space-y-4'>
                  {course.material?.map((material, index) => (
                    <AccordionItem
                      key={material._id}
                      value={`material-${material._id}`}
                      className='rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]'
                    >
                      <AccordionTrigger className='px-6 py-4 hover:no-underline [&[data-state=open]>div]:text-[#2563eb]'>
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#f59e0b] text-sm font-bold text-white'>
                              {index + 1}
                            </div>
                            <div className='text-left'>
                              <h3 className='text-lg font-semibold text-[#1e293b]'>
                                {material.title}
                              </h3>
                              <p className='mt-1 text-sm text-[#64748b]'>
                                {material.description}
                              </p>
                            </div>
                          </div>
                          {!isEnrolled && (
                            <div className='flex items-center gap-2 rounded-full bg-[#ef4444]/10 px-3 py-1 border border-[#ef4444]/20'>
                              <Lock className='h-4 w-4 text-[#ef4444]' />
                              <span className='text-xs font-medium text-[#ef4444]'>Locked</span>
                            </div>
                          )}
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className='px-6 pb-6'>
                        <div
                          className={`rounded-[12px] p-6 transition-all duration-300 ${
                            isEnrolled
                              ? 'bg-[#f1f5f9] border border-[#e2e8f0] hover:bg-[#e2e8f0]'
                              : 'border-2 border-[#ef4444]/20 bg-[#ef4444]/5'
                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                              <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${
                                isEnrolled ? 'bg-[#2563eb]' : 'bg-[#94a3b8]'
                              }`}>
                                {getMediaIcon(material.type)}
                              </div>
                              <div>
                                <h4 className='font-semibold text-[#1e293b]'>
                                  {material.title}
                                </h4>
                                <p className='text-sm text-[#64748b] mt-1'>
                                  {material.description}
                                </p>
                                <div className='mt-2 flex items-center gap-2'>
                                  <span className='rounded-full bg-[#2563eb]/10 px-3 py-1 text-xs font-medium text-[#2563eb]'>
                                    {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                                  </span>
                                  {!isEnrolled && (
                                    <span className='rounded-full bg-[#ef4444]/10 px-3 py-1 text-xs font-medium text-[#ef4444]'>
                                      Enrollment Required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className='flex items-center gap-3'>
                              {!isEnrolled ? (
                                <div className='flex items-center gap-2 text-[#94a3b8]'>
                                  <Lock className='h-4 w-4' />
                                  <span className='text-sm font-medium'>Locked</span>
                                </div>
                              ) : (
                                <Button
                                  size='sm'
                                  onClick={() => handleMediaAccess(material)}
                                  className='flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-[8px] px-4 py-2'
                                >
                                  <Play className='h-3 w-3' />
                                  Access Material
                                </Button>
                              )}
                            </div>
                          </div>

                          {!isEnrolled && (
                            <div className='mt-4 rounded-[8px] border border-[#ef4444]/20 bg-[#ef4444]/10 p-4'>
                              <p className='text-sm text-[#ef4444] font-medium'>
                                <Lock className='mr-2 inline h-4 w-4' />
                                You need to enroll in this course to access the material content and media files.
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}

                  {course.material?.length === 0 && (
                    <div className='flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-6 py-12'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f9]'>
                        <BookOpen className='h-8 w-8 text-[#94a3b8]' />
                      </div>
                      <h3 className='mb-2 text-lg font-semibold text-[#64748b]'>
                        No Materials Available
                      </h3>
                      <p className='max-w-md text-center text-sm text-[#94a3b8]'>
                        This course doesn't have any materials yet. Check back later or contact the instructor for more information.
                      </p>
                    </div>
                  )}
                </Accordion>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value='instructor'>
                <Card className='border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-[12px] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]'>
                  <CardContent className='p-8'>
                    <div className='flex items-start gap-8'>
                      <Avatar className='h-24 w-24 border-4 border-[#e2e8f0]'>
                        <AvatarImage src={course.instructor.profile || '/placeholder.svg'} />
                        <AvatarFallback className='text-lg font-bold bg-[#2563eb] text-white'>
                          {course.instructor.firstName.charAt(0) + course.instructor.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className='flex-1 space-y-6'>
                        <div>
                          <h3 className='text-3xl font-bold text-[#1e293b]'>
                            {course.instructor.firstName + ' ' + course.instructor.lastName}
                          </h3>
                          <p className='text-[#64748b] text-lg mt-2 leading-relaxed'>
                            {course.instructor.bio}
                          </p>
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                          <div className='text-center rounded-[12px] bg-[#2563eb]/5 p-4 border border-[#2563eb]/10'>
                            <div className='text-2xl font-bold text-[#2563eb]'>
                              {format(course.instructor.createdAt, 'PPP')}
                            </div>
                            <div className='text-sm font-medium text-[#64748b] mt-1'>
                              Date Joined
                            </div>
                          </div>
                          <div className='text-center rounded-[12px] bg-[#10b981]/5 p-4 border border-[#10b981]/10'>
                            <div className='text-2xl font-bold text-[#10b981]'>
                              {course.instructor.students?.length || 0}
                            </div>
                            <div className='text-sm font-medium text-[#64748b] mt-1'>
                              Total Students
                            </div>
                          </div>
                          <div className='text-center rounded-[12px] bg-[#f59e0b]/5 p-4 border border-[#f59e0b]/10'>
                            <div className='text-2xl font-bold text-[#f59e0b]'>
                              {course.instructor.courses?.length || 0}
                            </div>
                            <div className='text-sm font-medium text-[#64748b] mt-1'>
                              Courses Created
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className='space-y-6'>
            {/* Enrollment Card */}
            <Card className='sticky top-6 border border-[#e2e8f0] shadow-[0_8px_25px_rgba(0,0,0,0.12)] rounded-[12px]'>
              <CardContent className='space-y-6 p-6'>
                {isEnrolled ? (
                  <div className='space-y-4 text-center'>
                    <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/10'>
                      <CheckCircle className='h-8 w-8 text-[#10b981]' />
                    </div>
                    <div>
                      <p className='text-lg font-bold text-[#10b981]'>You're enrolled!</p>
                      <p className='text-sm text-[#64748b] mt-1'>Start learning with the materials above</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    loading={enrollCourseMutation.isPending}
                    disabled={enrollCourseMutation.isPending}
                    className='w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] py-4 text-lg font-semibold rounded-[8px] shadow-sm hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition-all duration-300'
                  >
                    Enroll Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course Info Card */}
            <Card className='border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-[12px]'>
              <CardHeader className='border-b border-[#f1f5f9]'>
                <CardTitle className='text-lg font-semibold text-[#1e293b]'>Course Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 p-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-[#64748b] font-medium'>Materials</span>
                  <span className='font-semibold text-[#1e293b] bg-[#f1f5f9] px-3 py-1 rounded-full'>
                    {course.material?.length || 0}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[#64748b] font-medium'>Last Updated</span>
                  <span className='font-semibold text-[#1e293b]'>
                    {format(course.updatedAt, 'PPP')}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[#64748b] font-medium'>Students</span>
                  <span className='font-semibold text-[#1e293b] bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full'>
                    {enrolledStudents}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}