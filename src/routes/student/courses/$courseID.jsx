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
  LogIn,
  CalendarDays,
} from 'lucide-react'
import { shallowEqual, useSelector } from 'react-redux'
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
import {
  checkSubscriptionStatus,
  getCookie,
  isActiveSubscription,
} from '../../../shared/utils/helperFunction'

export const courseQueryOptions = (deps) =>
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
        subscription?.status === 'past_due' ||
        subscription?.status === 'unpaid' ||
        subscription?.status === 'incomplete'
      ) {
        throw redirect({
          to: '/student/failed-subscription',
          replace: true,
          search: { redirect: `/student/courses/${params.courseID}` },
        })
      }
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
  const credentials = useSelector(
    (state) => state.studentAuth.credentials,
    shallowEqual
  )
  const subscription = useSelector(
    (state) => state.studentAuth.subscription,
    shallowEqual
  )
  console.log('crd', credentials)
  const [openMaterial, setOpenMaterial] = useState(null)
  const data = useLoaderData({ from: '/student/courses/$courseID' })

  const course = data?.course
  const isEnrolled = data?.isEnrolled
  const getLoggedStatus = () => {
    if (data?.isLoggedIn === false) {
      if (credentials === null) {
        return false
      } else {
        return false
      }
    } else if (data?.isLoggedIn === true) {
      if (credentials !== null) {
        return true
      } else {
        return false
      }
    }
  }
  const isLoggedIn = getLoggedStatus()

  console.log('is', isLoggedIn)
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
    <div className='page-bg'>
      {/* Enhanced Hero Section */}
      <div className='hero-bg'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='blur-circle-white -top-40 -right-40 h-80 w-80'></div>
          <div className='blur-circle-amber -bottom-20 -left-20 h-60 w-60'></div>
        </div>

        <div className='container-max'>
          <Button
            size='sm'
            variant='outline'
            className='btn-outline-white'
            onClick={() => navigate({ to: '/student/courses' })}
          >
            <ArrowLeft className='icon-transition' />
            <span className='ml-2 hidden font-medium sm:inline'>
              Back to Courses
            </span>
          </Button>

          <div className='course-grid'>
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='badge-category'>
                  <BookOpen className='h-4 w-4' />
                  <span>{course?.category?.name || 'N/A'}</span>
                </div>
                {isEnrolled && (
                  <div className='badge-enrolled'>
                    <CheckCircle className='h-4 w-4 text-[#10b981]' />
                    <span>Enrolled</span>
                  </div>
                )}
              </div>
              <h1 className='text-lg font-bold text-white'>{course.name}</h1>
              <p className='font-medium text-white'>{course.description}</p>
              <div className='course-info'>
                <div className='course-info-item'>
                  <Users className='h-4 w-4' />
                  <span>{enrolledStudents} students</span>
                </div>
                <div className='course-info-item'>
                  <FileText className='h-4 w-4' />
                  <span>{course.material?.length || 0} materials</span>
                </div>
                {!isLoggedIn && (
                  <div className='badge-locked'>
                    <Lock className='h-4 w-4' />
                    Login required
                  </div>
                )}
              </div>
            </div>
            <div className='image-container'>
              <div className='image-overlay'></div>
              <img
                src={
                  course?.coverImage
                    ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/cover-images/${course?.coverImage}`
                    : defaultCover
                }
                alt={course.name}
                className='course-image'
                loading='lazy'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='container-max py-8'>
        <div className='main-grid'>
          <div className='space-y-6 lg:col-span-2'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='tabs-container'
            >
              <TabsList className='bg-gray-300'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='materials'>Materials</TabsTrigger>
                <TabsTrigger value='instructor'>Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                <Card className='card-rounded'>
                  <CardHeader className='card-header'>
                    <CardTitle className='card-title'>
                      <div className='card-icon'>
                        <BookOpen className='h-5 w-5 text-[#2563eb]' />
                      </div>
                      Course Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='card-content'>
                    <p className='mb-8 text-lg leading-relaxed text-[#64748b]'>
                      {course.description}
                    </p>
                    <div className='stat-grid'>
                      <div className='stat-green'>
                        <div className='stat-icon bg-[#10b981]'>
                          <Users className='h-6 w-6 text-white' />
                        </div>
                        <div className='stat-value'>{enrolledStudents}</div>
                        <div className='stat-label'>Students Enrolled</div>
                      </div>
                      <div className='stat-blue'>
                        <div className='stat-icon bg-[#2563eb]'>
                          <FileText className='h-6 w-6 text-white' />
                        </div>
                        <div className='stat-value'>
                          {course.material?.length || 0}
                        </div>
                        <div className='stat-label'>Learning Materials</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='materials' className='space-y-4'>
                {/* Not Logged In */}
                {!isLoggedIn ? (
                  <Card className='flex flex-col items-center justify-center py-10 text-center shadow-sm'>
                    <Lock className='text-muted-foreground mb-3 h-8 w-8' />
                    <CardTitle className='text-lg font-semibold text-slate-700'>
                      Please login to view materials
                    </CardTitle>
                    <Button
                      onClick={() =>
                        navigate({
                          to: '/student/login',
                          search: {
                            redirect: `/student/courses/${params.courseID}`,
                            courseID: params.courseID,
                          },
                        })
                      }
                      className='mt-4 bg-blue-600 text-white hover:bg-blue-700'
                    >
                      <LogIn className='mr-2 h-4 w-4' /> Login
                    </Button>
                  </Card>
                ) : (
                  <>
                    {/* Accordion for Materials */}
                    {course.material?.length > 0 ? (
                      <Accordion type='multiple' className='space-y-3'>
                        {course.material.map((material, index) => (
                          <AccordionItem
                            key={material._id}
                            value={`material-${material._id}`}
                            className='rounded-lg border shadow-sm'
                          >
                            <AccordionTrigger className='hover:bg-muted/40 px-4 py-3'>
                              <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                  <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'>
                                    {index + 1}
                                  </div>
                                  <div className='text-left'>
                                    <h3 className='font-semibold text-slate-800'>
                                      {material.title}
                                    </h3>
                                    <p className='line-clamp-1 text-sm text-slate-500'>
                                      {material.description}
                                    </p>
                                  </div>
                                </div>
                                {!isEnrolled && (
                                  <div className='flex items-center gap-1 text-sm text-red-500'>
                                    <Lock className='h-4 w-4' />
                                    Locked
                                  </div>
                                )}
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className='px-5 pb-5'>
                              <Card
                                className={
                                  ('border-none shadow-none transition-all duration-200',
                                  !isEnrolled && 'opacity-60 grayscale')
                                }
                              >
                                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                                  <div>
                                    <CardTitle className='text-base font-semibold'>
                                      {material.title}
                                    </CardTitle>
                                    <p className='text-muted-foreground text-sm'>
                                      {material.type.charAt(0).toUpperCase() +
                                        material.type.slice(1)}
                                    </p>
                                  </div>
                                  {isEnrolled ? (
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      onClick={() =>
                                        setOpenMaterial((prev) =>
                                          prev === material._id
                                            ? null
                                            : material._id
                                        )
                                      }
                                    >
                                      <Play className='mr-2 h-3 w-3' />
                                      {openMaterial === material._id
                                        ? 'Hide Material'
                                        : 'Access Material'}
                                    </Button>
                                  ) : (
                                    <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                                      <Lock className='h-4 w-4' /> Locked
                                    </div>
                                  )}
                                </CardHeader>

                                <CardContent>
                                  {/* Description Always Visible */}
                                  <p className='mb-3 text-sm text-slate-600'>
                                    {material.description}
                                  </p>

                                  {!isEnrolled && (
                                    <Alert
                                      variant='destructive'
                                      className='mt-2'
                                    >
                                      <Lock className='h-4 w-4' />
                                      <AlertDescription className='text-sm'>
                                        You need to enroll in this course to
                                        access this material.
                                      </AlertDescription>
                                    </Alert>
                                  )}

                                  {isEnrolled &&
                                    openMaterial === material._id && (
                                      <div className='mt-3'>
                                        {material.type === 'application' && (
                                          <iframe
                                            src={`${baseMaterialUrl}${material.media}`}
                                            className='h-80 w-full rounded-md border'
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

                                        {material.media.match(
                                          /\.(png|jpg|jpeg|webp)$/i
                                        ) && (
                                          <img
                                            src={`${baseMaterialUrl}${material.media}`}
                                            alt={material.title}
                                            className='h-80 w-full rounded-lg object-contain'
                                          />
                                        )}
                                      </div>
                                    )}
                                </CardContent>
                              </Card>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <Card className='flex flex-col items-center justify-center py-10 text-center'>
                        <BookOpen className='text-muted-foreground mb-3 h-8 w-8' />
                        <CardTitle className='text-lg font-semibold text-slate-700'>
                          No Materials Available
                        </CardTitle>
                        <p className='max-w-md text-sm text-slate-500'>
                          This course doesn’t have any materials yet. Check back
                          later or contact the instructor for more information.
                        </p>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value='instructor' className='space-y-6'>
                <Card className='border-muted hover:border-primary/30 rounded-2xl border shadow-sm transition-all hover:shadow-md'>
                  <CardHeader className='border-muted/50 flex items-center gap-4 border-b pb-6'>
                    <Avatar className='border-primary/30 h-20 w-20 border-2 shadow-sm'>
                      <AvatarImage
                        src={course.instructor.profile || '/placeholder.svg'}
                        alt={course.instructor.firstName}
                      />
                      <AvatarFallback className='bg-primary/10 text-primary text-lg font-semibold'>
                        {course.instructor.firstName.charAt(0) +
                          course.instructor.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <CardTitle className='text-foreground text-2xl font-semibold'>
                        {course.instructor.firstName +
                          ' ' +
                          course.instructor.lastName}
                      </CardTitle>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        {course.instructor.bio || 'No bio available.'}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className='grid grid-cols-1 gap-6 p-6 sm:grid-cols-3'>
                    <div className='flex flex-col items-center justify-center rounded-xl bg-blue-50 p-4 text-center shadow-sm transition-all hover:shadow-md'>
                      <CalendarDays className='mb-2 h-6 w-6 text-blue-600' />
                      <div className='text-2xl font-bold text-blue-700'>
                        {format(course.instructor.createdAt, 'PPP')}
                      </div>
                      <div className='mt-1 text-sm font-medium text-blue-600'>
                        Date Joined
                      </div>
                    </div>

                    <div className='flex flex-col items-center justify-center rounded-xl bg-green-50 p-4 text-center shadow-sm transition-all hover:shadow-md'>
                      <Users className='mb-2 h-6 w-6 text-green-600' />
                      <div className='text-2xl font-bold text-green-700'>
                        {course.instructor.students?.length || 0}
                      </div>
                      <div className='mt-1 text-sm font-medium text-green-600'>
                        Total Students
                      </div>
                    </div>

                    <div className='flex flex-col items-center justify-center rounded-xl bg-amber-50 p-4 text-center shadow-sm transition-all hover:shadow-md'>
                      <BookOpen className='mb-2 h-6 w-6 text-amber-600' />
                      <div className='text-2xl font-bold text-amber-700'>
                        {course.instructor.courses?.length || 0}
                      </div>
                      <div className='mt-1 text-sm font-medium text-amber-600'>
                        Courses Created
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className='space-y-6'>
            <Card className='enroll-card'>
              <CardContent className='enroll-content'>
                {!isLoggedIn ? (
                  <div className='enroll-locked'>
                    <div className='enroll-icon'>
                      <Lock className='h-8 w-8 text-blue-600' />
                    </div>
                    <div>
                      <p className='enroll-message'>Please login to enroll</p>
                      <Button
                        onClick={() =>
                          navigate({
                            to: '/student/login',
                            search: {
                              redirect: `/student/courses/${params.courseID}`,
                              courseID: params.courseID,
                            },
                          })
                        }
                        className='enroll-btn'
                      >
                        Login to Continue
                      </Button>
                    </div>
                  </div>
                ) : isEnrolled ? (
                  <div className='enrolled-section'>
                    <div className='enrolled-icon'>
                      <CheckCircle className='h-8 w-8 text-[#10b981]' />
                    </div>
                    <p className='enrolled-message'>You're enrolled!</p>
                    <p className='enrolled-info'>
                      Start learning with the materials above
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrollCourseMutation.isPending}
                    className='enroll-btn'
                  >
                    {enrollCourseMutation.isPending
                      ? 'Enrolling...'
                      : 'Enroll Now'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className='course-info-card'>
              <CardHeader className='info-header'>
                <CardTitle className='info-title'>Course Information</CardTitle>
              </CardHeader>
              <CardContent className='info-content'>
                <div className='info-item'>
                  <span className='info-label'>Materials</span>
                  <span className='info-value'>
                    {course.material?.length || 0}
                  </span>
                </div>
                <div className='info-item'>
                  <span className='info-label'>Last Updated</span>
                  <span className='info-value'>
                    {format(course.updatedAt, 'PPP')}
                  </span>
                </div>
                <div className='info-item'>
                  <span className='info-label'>Students</span>
                  <span className='info-value-green'>{enrolledStudents}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
