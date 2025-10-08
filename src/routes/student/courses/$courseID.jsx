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
    if(data?.isLoggedIn === false){
      if(credentials === null){
        return false
      }else{
        return false
      }
    }else if(data?.isLoggedIn === true){
     if(credentials !== null){
        return true
     }else{
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
              <h1 className='course-title'>{course.name}</h1>
              <p className='course-desc'>{course.description}</p>
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
              <TabsList className='tabs-list'>
                <TabsTrigger value='overview' className='tabs-trigger'>
                  Overview
                </TabsTrigger>
                <TabsTrigger value='materials' className='tabs-trigger'>
                  Materials
                </TabsTrigger>
                <TabsTrigger value='instructor' className='tabs-trigger'>
                  Instructor
                </TabsTrigger>
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

              <TabsContent value='materials' className='accordion-container'>
                {!isLoggedIn ? (
                  <div className='locked-section'>
                    <Lock className='mx-auto mb-3 h-8 w-8 text-slate-500' />
                    <p className='text-lg font-semibold text-slate-700'>
                      Please login to view materials
                    </p>
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
                      className='mt-4 bg-blue-600 text-white'
                    >
                      Login
                    </Button>
                  </div>
                ) : (
                  <Accordion type='multiple' className='accordion-container'>
                    {console.log('oourse.material', course.material)}
                    {course.material?.map((material, index) => (
                      <AccordionItem
                        key={material._id}
                        value={`material-${material._id}`}
                        className='accordion-item'
                      >
                        <AccordionTrigger className='accordion-trigger'>
                          <div className='material-header'>
                            <div className='flex items-center gap-4'>
                              <div className='material-number'>{index + 1}</div>
                              <div className='text-left'>
                                <h3 className='material-title'>
                                  {material.title}
                                </h3>
                                <p className='material-desc'>
                                  {material.description}
                                </p>
                              </div>
                            </div>
                            {!isEnrolled && (
                              <div className='material-locked'>
                                <Lock className='h-4 w-4 text-red-500' />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className='px-6 pb-6'>
                          <div
                            className={
                              isEnrolled
                                ? 'material-card'
                                : 'material-card-locked'
                            }
                          >
                            <div className='flex flex-wrap items-center justify-between gap-4'>
                              <div className='material-info'>
                                <div
                                  className={`material-icon ${isEnrolled ? 'bg-blue-600' : 'bg-slate-400'}`}
                                >
                                  {getMediaIcon(material.type)}
                                </div>
                                <div>
                                  <h4 className='material-title'>
                                    {material.title}
                                  </h4>
                                  <p className='mt-1 line-clamp-2 text-sm text-slate-600'>
                                    {material.description}
                                  </p>
                                  <div className='mt-2 flex items-center gap-2'>
                                    <span className='material-type'>
                                      {material.type.charAt(0).toUpperCase() +
                                        material.type.slice(1)}
                                    </span>
                                    {!isEnrolled && (
                                      <span className='material-locked-badge'>
                                        Enrollment Required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
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
                                    className='material-action'
                                  >
                                    <Play className='h-3 w-3' />
                                    {openMaterial === material._id
                                      ? 'Hide Material'
                                      : 'Access Material'}
                                  </Button>
                                )}
                              </div>
                            </div>
                            {!isEnrolled && (
                              <div className='material-alert'>
                                <p className='text-sm font-medium text-red-600'>
                                  <Lock className='mr-2 inline h-4 w-4' />
                                  You need to enroll in this course to access
                                  the material content and media files.
                                </p>
                              </div>
                            )}
                            {isEnrolled && openMaterial === material._id && (
                              <div className='material-content'>
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
                      <div className='no-materials'>
                        <div className='no-materials-icon'>
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
                )}
              </TabsContent>

              <TabsContent value='instructor' className='space-y-6'>
                <Card className='card-rounded'>
                  <CardContent className='card-content p-8'>
                    <div className='instructor-card'>
                      <Avatar className='instructor-avatar'>
                        <AvatarImage
                          src={course.instructor.profile || '/placeholder.svg'}
                        />
                        <AvatarFallback className='instructor-fallback'>
                          {course.instructor.firstName.charAt(0) +
                            course.instructor.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-6'>
                        <div>
                          <h3 className='instructor-name'>
                            {course.instructor.firstName +
                              ' ' +
                              course.instructor.lastName}
                          </h3>
                          <p className='instructor-bio'>
                            {course.instructor.bio || 'No bio available.'}
                          </p>
                        </div>
                        <div className='instructor-stats'>
                          <div className='instructor-stat instructor-stat-blue'>
                            <div className='text-2xl font-bold text-[#2563eb]'>
                              {format(course.instructor.createdAt, 'PPP')}
                            </div>
                            <div className='stat-label'>Date Joined</div>
                          </div>
                          <div className='instructor-stat instructor-stat-green'>
                            <div className='text-2xl font-bold text-[#10b981]'>
                              {course.instructor.students?.length || 0}
                            </div>
                            <div className='stat-label'>Total Students</div>
                          </div>
                          <div className='instructor-stat instructor-stat-amber'>
                            <div className='text-2xl font-bold text-[#f59e0b]'>
                              {course.instructor.courses?.length || 0}
                            </div>
                            <div className='stat-label'>Courses Created</div>
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
