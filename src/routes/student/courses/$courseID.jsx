import { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  redirect,
  useParams,
  useLoaderData,
  createFileRoute,
  useRouter,
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { coursesQueryOptions } from '.'
import { useAppUtils } from '../../../hooks/useAppUtils'
import { handleCourseEnrollment } from '../../../shared/config/reducers/student/studentAuthSlice'
import { openModal } from '../../../shared/config/reducers/student/studentDialogSlice'
import store from '../../../shared/config/store/store'
import {
  checkSubscriptionStatus,
  getCookie,
  isActiveSubscription,
} from '../../../shared/utils/helperFunction'

const courseQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['getCourse', deps.courseID, deps?.userID],
    queryFn: async () => {
      console.log('deps ===>', deps)
      const creds = getCookie('studentCredentials')
      let queryStr = `courseID=${deps.courseID}`
      if (deps?.userID) {
        queryStr += `&userID=${deps.userID}`
      } else if (creds?._id) {
        queryStr += `&userID=${creds._id}`
      }

      try {
        let response = await axios.get(`/web/course/getCourse?${queryStr}`)
        console.log('response ===>', response.data)

        if (response.data.success) {
          response = response.data
          return response.data
        } else {
          throw new Error('API returned success: false')
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        throw new Error(
          error?.response?.data?.message || 'Failed to fetch course'
        )
      }
    },
  })

const queryClient = new QueryClient()

export const Route = createFileRoute('/student/courses/$courseID')({
  beforeLoad: ({ params }) => {
    const token = getCookie('studentToken')
    const credentials = getCookie('studentCredentials')
    const subscription = getCookie('studentSubscription')
    console.log('params', params)
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
      } else if (
        subscription?.status !== 'active' &&
        subscription?.subscriptionId
      ) {
        throw redirect({
          to: '/student/failed-subscription',
          replace: true,
          search: { redirect: `/student/courses/${params.courseID}` },
        })
      }
    } else {
      store.dispatch(
        openModal({
          type: 'login-modal',
          props: { redirect: `/student/courses/${params.courseID}` },
        })
      )
      throw redirect({
        to: '/student/courses',
        replace: true,
      })
    }
  },
  validateSearch: (search) => {
    return { courseID: search.courseID, userID: search.userID }
  },
  loaderDeps: ({ search }) => {
    return { courseID: search.courseID, userID: search.userID }
  },
  loader: ({ params, deps }) =>
    queryClient.fetchQuery(
      courseQueryOptions({ courseID: params.courseID, userID: deps.userID })
    ),
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({ from: '/student/courses/$courseID' })
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)

  const [openMaterial, setOpenMaterial] = useState(null)
  const data = useLoaderData({ from: '/student/courses/$courseID' })
  console.log('data', data)
  const course = data?.course
  const isEnrolled = data?.isEnrolled
  const enrolledStudents = data?.enrolledStudents || 0
  const [activeTab, setActiveTab] = useState('overview')

  const { navigate, dispatch } = useAppUtils()

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

  const enrollCourse = async () => {
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
        const response = await axios.post('/student/course/enroll', {
          courseId: params.courseID,
        })
        if (response.data.success) {
          toast.success('Course enrolled!')
          const { remainingEnrollmentCount } = response.data.data
          dispatch(
            handleCourseEnrollment({
              id: params.courseID,
              remainingEnrollmentCount,
            })
          )
        } else {
          throw new Error('Enrollment failed')
        }
      } catch (error) {
        console.error('Enrollment Error -> ', error)
        toast.error('Failed to enroll in the course. Please try again.')
      }
    }
  }

  const router = useRouter()

  const queryClient = useQueryClient()
  const enrollCourseMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: async () => {
      // 1) Invalidate React Query cache
      queryClient.invalidateQueries({
        queryKey: ['getCourse', params.courseID, credentials?._id],
      })
      queryClient.invalidateQueries(
        coursesQueryOptions({ q: '', page: 1, userID: credentials?._id })
      )
      // 2) Invalidate Router loader
      await router.invalidate({
        routeId: '/student/courses/$courseID',
        params: { courseID: params.courseID },
        search: { userID: credentials?._id },
      })
    },
  })

  const handleEnroll = async () => {
    enrollCourseMutation.mutate()
  }

  const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/defaults/course-cover.png`
  const baseMaterialUrl = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/material/`

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]'>
      {/* Enhanced Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/10 to-white/5 blur-3xl'></div>
          <div className='absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#f59e0b]/20 to-[#d97706]/10 blur-2xl'></div>
        </div>

        <div className='relative mx-auto max-w-7xl px-6 py-12'>
          <Button
            size='sm'
            variant='outline'
            className='group mb-6 border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-lg'
            onClick={() => window.history.back()}
          >
            <ArrowLeft className='h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1' />
            <span className='ml-2 hidden font-medium sm:inline'>
              Back to Courses
            </span>
          </Button>

          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm'>
                  <BookOpen className='h-4 w-4' />
                  <span>{course?.category?.name || 'N/A'}</span>
                </div>
                {isEnrolled && (
                  <div className='flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm'>
                    <CheckCircle className='h-4 w-4 text-[#10b981]' />
                    <span className='text-[#10b981]'>Enrolled</span>
                  </div>
                )}
              </div>
              <h1 className='text-4xl leading-tight font-bold lg:text-5xl'>
                {course.name}
              </h1>
              <p className='line-clamp-3 text-xl leading-relaxed text-white/90'>
                {course.description}
              </p>
              <div className='flex flex-wrap items-center gap-6 text-sm'>
                <div className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm'>
                  <Users className='h-4 w-4' />
                  <span className='font-medium'>
                    {enrolledStudents} students
                  </span>
                </div>
                <div className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm'>
                  <FileText className='h-4 w-4' />
                  <span className='font-medium'>
                    {course.material?.length || 0} materials
                  </span>
                </div>
              </div>
            </div>
            <div className='relative'>
              <div className='absolute inset-0 rounded-[12px] bg-gradient-to-br from-[#f59e0b]/20 to-transparent'></div>
              <img
                src={
                  course?.coverImage
                    ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/cover-images/${course?.coverImage}`
                    : defaultCover
                }
                alt={course.name}
                className='w-full rounded-[12px] border border-white/20 shadow-2xl'
                loading='lazy'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3 rounded-[12px] border border-[#e2e8f0] bg-white p-1 shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
                <TabsTrigger
                  value='overview'
                  className='rounded-[8px] font-medium text-[#64748b] transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-sm'
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value='materials'
                  className='rounded-[8px] font-medium text-[#64748b] transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-sm'
                >
                  Materials
                </TabsTrigger>
                <TabsTrigger
                  value='instructor'
                  className='rounded-[8px] font-medium text-[#64748b] transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2563eb] data-[state=active]:to-[#1d4ed8] data-[state=active]:text-white data-[state=active]:shadow-sm'
                >
                  Instructor
                </TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                <Card className='rounded-[12px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]'>
                  <CardHeader className='border-b border-[#f1f5f9]'>
                    <CardTitle className='flex items-center gap-3 text-[#1e293b]'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10'>
                        <BookOpen className='h-5 w-5 text-[#2563eb]' />
                      </div>
                      Course Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <p className='mb-8 text-lg leading-relaxed text-[#64748b]'>
                      {course.description}
                    </p>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                      <div className='rounded-[12px] border border-[#10b981]/10 bg-gradient-to-br from-[#10b981]/5 to-[#059669]/5 p-6 text-center'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981]'>
                          <Users className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-[#1e293b]'>
                          {enrolledStudents}
                        </div>
                        <div className='text-sm font-medium text-[#64748b]'>
                          Students Enrolled
                        </div>
                      </div>
                      <div className='rounded-[12px] border border-[#2563eb]/10 bg-gradient-to-br from-[#2563eb]/5 to-[#1d4ed8]/5 p-6 text-center'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]'>
                          <FileText className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-[#1e293b]'>
                          {course.material?.length || 0}
                        </div>
                        <div className='text-sm font-medium text-[#64748b]'>
                          Learning Materials
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='materials' className='space-y-4'>
                <Accordion type='multiple' className='space-y-4'>
                  {course.material?.map((material, index) => (
                    <AccordionItem
                      key={material._id}
                      value={`material-${material._id}`}
                      className='rounded-xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg'
                    >
                      {/* Accordion Header */}
                      <AccordionTrigger className='px-6 py-4 hover:no-underline [&[data-state=open]>div]:text-blue-600'>
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <div className='flex h-10 w-14 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white'>
                              {index + 1}
                            </div>
                            <div className='text-left'>
                              <h3 className='text-base font-semibold text-slate-800'>
                                {material.title}
                              </h3>
                              <p className='mt-1 line-clamp-1 text-sm text-slate-500'>
                                {material.description}
                              </p>
                            </div>
                          </div>

                          {!isEnrolled && (
                            <div className='flex items-center gap-2 rounded-full border border-red-200 bg-red-100 px-3 py-1'>
                              <Lock className='h-4 w-4 text-red-500' />
                              <span className='text-xs font-medium text-red-500'>
                                Locked
                              </span>
                            </div>
                          )}
                        </div>
                      </AccordionTrigger>

                      {/* Accordion Content */}
                      <AccordionContent className='px-6 pb-6'>
                        <div
                          className={`rounded-xl p-5 transition-all ${
                            isEnrolled
                              ? 'border border-slate-200 bg-slate-50 hover:bg-slate-100'
                              : 'border-2 border-red-200 bg-red-50/60'
                          }`}
                        >
                          <div className='flex flex-wrap items-center justify-between gap-4'>
                            {/* Media Info */}
                            <div className='flex items-center gap-4'>
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                  isEnrolled ? 'bg-blue-600' : 'bg-slate-400'
                                }`}
                              >
                                {getMediaIcon(material.type)}
                              </div>
                              <div>
                                <h4 className='font-semibold text-slate-800'>
                                  {material.title}
                                </h4>
                                <p className='mt-1 line-clamp-2 text-sm text-slate-600'>
                                  {material.description}
                                </p>
                                <div className='mt-2 flex items-center gap-2'>
                                  <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                                    {material.type.charAt(0).toUpperCase() +
                                      material.type.slice(1)}
                                  </span>
                                  {!isEnrolled && (
                                    <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-500'>
                                      Enrollment Required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div>
                              {!isEnrolled ? (
                                <div className='flex items-center gap-2 text-slate-400'>
                                  <Lock className='h-4 w-4' />
                                  <span className='text-sm font-medium'>
                                    Locked
                                  </span>
                                </div>
                              ) : (
                                <Button
                                  size='sm'
                                  onClick={() =>
                                    setOpenMaterial((prev) =>
                                      prev === material._id
                                        ? null
                                        : material._id
                                    )
                                  }
                                  className='flex items-center gap-2 rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
                                >
                                  <Play className='h-3 w-3' />
                                  {openMaterial === material._id
                                    ? 'Hide Material'
                                    : 'Access Material'}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Locked Alert */}
                          {!isEnrolled && (
                            <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3'>
                              <p className='text-sm font-medium text-red-600'>
                                <Lock className='mr-2 inline h-4 w-4' />
                                You need to enroll in this course to access the
                                material content and media files.
                              </p>
                            </div>
                          )}

                          {console.log('material.tyep', material.type)}
                          {/* ✅ Show material inside accordion if clicked */}
                          {isEnrolled && openMaterial === material._id && (
                            <div className='mt-4 overflow-hidden rounded-lg border border-slate-200'>
                              {material.type === 'application' && (
                                <iframe
                                  src={`${baseMaterialUrl}${material.media}`}
                                  className='h-80 w-full'
                                  title='PDF Viewer'
                                />
                              )}
                              {material.type === 'video' && (
                                <video
                                  src={`${baseMaterialUrl}${material.media}`}
                                  controls
                                  className='h-80 w-full rounded-lg'
                                />
                              )}
                              {material.media.match(/\.(mp4|webm)$/i) && (
                                <img
                                  src={`${baseMaterialUrl}${material.media}`}
                                  alt={material.title}
                                  className='h-80 w-full rounded-lg object-contain'
                                />
                              )}
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
                        This course doesn't have any materials yet. Check back
                        later or contact the instructor for more information.
                      </p>
                    </div>
                  )}
                </Accordion>
              </TabsContent>

              <TabsContent value='instructor'>
                <Card className='rounded-[12px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]'>
                  <CardContent className='p-8'>
                    <div className='flex items-start gap-8'>
                      <Avatar className='h-24 w-24 border-4 border-[#e2e8f0]'>
                        <AvatarImage
                          src={course.instructor.profile || '/placeholder.svg'}
                        />
                        <AvatarFallback className='bg-[#2563eb] text-lg font-bold text-white'>
                          {course.instructor.firstName.charAt(0) +
                            course.instructor.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-6'>
                        <div>
                          <h3 className='text-3xl font-bold text-[#1e293b]'>
                            {course.instructor.firstName +
                              ' ' +
                              course.instructor.lastName}
                          </h3>
                          <p className='mt-2 text-lg leading-relaxed text-[#64748b]'>
                            {course.instructor.bio || 'No bio available.'}
                          </p>
                        </div>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                          <div className='rounded-[12px] border border-[#2563eb]/10 bg-[#2563eb]/5 p-4 text-center'>
                            <div className='text-2xl font-bold text-[#2563eb]'>
                              {format(course.instructor.createdAt, 'PPP')}
                            </div>
                            <div className='mt-1 text-sm font-medium text-[#64748b]'>
                              Date Joined
                            </div>
                          </div>
                          <div className='rounded-[12px] border border-[#10b981]/10 bg-[#10b981]/5 p-4 text-center'>
                            <div className='text-2xl font-bold text-[#10b981]'>
                              {course.instructor.students?.length || 0}
                            </div>
                            <div className='mt-1 text-sm font-medium text-[#64748b]'>
                              Total Students
                            </div>
                          </div>
                          <div className='rounded-[12px] border border-[#f59e0b]/10 bg-[#f59e0b]/5 p-4 text-center'>
                            <div className='text-2xl font-bold text-[#f59e0b]'>
                              {course.instructor.courses?.length || 0}
                            </div>
                            <div className='mt-1 text-sm font-medium text-[#64748b]'>
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

          <div className='space-y-6'>
            <Card className='sticky top-6 rounded-[12px] border border-[#e2e8f0] shadow-[0_8px_25px_rgba(0,0,0,0.12)]'>
              <CardContent className='space-y-6 p-6'>
                {isEnrolled ? (
                  <div className='space-y-4 text-center'>
                    <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/10'>
                      <CheckCircle className='h-8 w-8 text-[#10b981]' />
                    </div>
                    <div>
                      <p className='text-lg font-bold text-[#10b981]'>
                        You're enrolled!
                      </p>
                      <p className='mt-1 text-sm text-[#64748b]'>
                        Start learning with the materials above
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrollCourseMutation.isPending}
                    className='w-full rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-4 text-lg font-semibold shadow-sm transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#1e40af] hover:shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                  >
                    {enrollCourseMutation.isPending
                      ? 'Enrolling...'
                      : 'Enroll Now'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className='rounded-[12px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
              <CardHeader className='border-b border-[#f1f5f9]'>
                <CardTitle className='text-lg font-semibold text-[#1e293b]'>
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 p-6'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-[#64748b]'>Materials</span>
                  <span className='rounded-full bg-[#f1f5f9] px-3 py-1 font-semibold text-[#1e293b]'>
                    {course.material?.length || 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-[#64748b]'>
                    Last Updated
                  </span>
                  <span className='font-semibold text-[#1e293b]'>
                    {format(course.updatedAt, 'PPP')}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-[#64748b]'>Students</span>
                  <span className='rounded-full bg-[#10b981]/10 px-3 py-1 font-semibold text-[#1e293b] text-[#10b981]'>
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
