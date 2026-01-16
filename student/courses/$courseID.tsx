import { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { redirect, useParams, useLoaderData, createFileRoute, useRouter } from '@tanstack/react-router'
import { Play, Users, BookOpen, CheckCircle, Lock, LogIn, FileText, ArrowLeft, ImageIcon, Video, Clock11 } from 'lucide-react'
import { shallowEqual, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { coursesQueryOptions } from '.'
import { useAppUtils } from '../../../hooks/useAppUtils'
import { handleCourseEnrollment } from '../../../shared/config/reducers/student/studentAuthSlice'
import { checkSubscriptionStatus, getCookie, isActiveSubscription } from '../../../shared/utils/helperFunction'
import { getFileUrl } from '@/utils/globalFunctions'

type CourseDeps = { courseID: string; userID?: string }

export const courseQueryOptions = (deps: CourseDeps) =>
  queryOptions({
    queryKey: ['getCourse', deps.courseID, deps?.userID],
    queryFn: async () => {
      const creds = getCookie('studentCredentials')
      const params = new URLSearchParams({ courseID: deps.courseID })
      const uid = deps?.userID || creds?._id
      if (uid) params.append('userID', uid)
      const response = await axios.get(`/web/course/getCourse?${params.toString()}`)
      if (response.data?.success) {
        return response.data.data
      }
      throw new Error(response.data?.message || 'Failed to fetch course')
    },
  })

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
  validateSearch: (search: Record<string, unknown>) => {
    return { courseID: search.courseID as string, userID: search.userID as string | undefined }
  },
  loaderDeps: ({ search }) => {
    return { courseID: search.courseID as string, userID: search.userID as string | undefined }
  },
  loader: ({ params, deps, context }) =>
    context.queryClient.fetchQuery(courseQueryOptions({ courseID: params.courseID, userID: deps.userID })),
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({ from: '/student/courses/$courseID' })
  const credentials = useSelector((state: any) => state.studentAuth.credentials, shallowEqual)
  const subscription = useSelector((state: any) => state.studentAuth.subscription, shallowEqual)
  const [openMaterial, setOpenMaterial] = useState<string | null>(null)
  const data = useLoaderData({ from: '/student/courses/$courseID' }) as any

  const course = data?.course
  const isEnrolled = data?.isEnrolled as boolean
  const isLoggedIn = !!credentials
  const enrolledStudents = data?.enrolledStudents || 0
  const [activeTab, setActiveTab] = useState('overview')

  const { navigate, dispatch } = useAppUtils()

  const getMediaIcon = (type: string) => {
    if (type === 'image') return <ImageIcon className='h-4 w-4' />
    if (type === 'video') return <Video className='h-4 w-4' />
    return <FileText className='h-4 w-4' />
  }

  const enrollCourse = async () => {
    if (subscription && !isActiveSubscription(subscription)) {
      if (checkSubscriptionStatus(subscription) === 'past_due') {
        toast.error('Subscription expired!')
        return navigate('/student/pay-invoice')
      }
      toast.error('You have no subscription, subscribe some plan to enroll the course!')
      return navigate({ to: '/student/resubscription-plans' })
    } else if (credentials && credentials.remainingEnrollmentCount === 0) {
      return toast.error('You have exceeded the limit of enrolling courses!')
    } else {
      const response = await axios.post('/student/course/enroll', { courseId: params.courseID })
      if (response.data?.success) {
        toast.success('Course enrolled!')
        const { remainingEnrollmentCount } = response.data.data
        dispatch(handleCourseEnrollment({ id: params.courseID, remainingEnrollmentCount }))
      } else {
        throw new Error('Enrollment failed')
      }
    }
  }

  const router = useRouter()
  const queryClient = useQueryClient()
  const enrollCourseMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['getCourse', params.courseID, credentials?._id] })
      queryClient.invalidateQueries(coursesQueryOptions({ q: '', page: 1, userID: credentials?._id }))
      await router.invalidate({
        routeId: '/student/courses/$courseID',
        params: { courseID: params.courseID },
        search: { userID: credentials?._id },
      })
    },
    onError: () => {
      toast.error('Failed to enroll in the course. Please try again.')
    },
  })

  const defaultCover = getFileUrl('course-cover.png', 'defaults')

  return (
    <div className='page-bg'>
      <div className='hero-bg'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='blur-circle-white -top-40 -right-40 h-80 w-80'></div>
          <div className='blur-circle-amber -bottom-20 -left-20 h-60 w-60'></div>
        </div>

        <div className='container-max'>
          <Button size='sm' variant='outline' className='btn-outline-white' onClick={() => navigate({ to: '/student/courses' })}>
            <ArrowLeft className='icon-transition' />
            <span className='ml-2 hidden font-medium sm:inline'>Back to Courses</span>
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
              <h1 className='text-lg font-bold text-white'>{course?.name}</h1>
              <p className='font-medium text-white'>{course?.description}</p>
              <div className='course-info'>
                <div className='course-info-item'>
                  <Users className='h-4 w-4' />
                  <span>{enrolledStudents} students</span>
                </div>
                <div className='course-info-item'>
                  <FileText className='h-4 w-4' />
                  <span>{course?.material?.length || 0} materials</span>
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
                src={course?.coverImage ? getFileUrl(course?.coverImage, 'public/courses/cover-images') : defaultCover}
                alt={course?.name}
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className='tabs-container'>
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
                    <p className='mb-8 text-lg leading-relaxed text-[#64748b]'>{course?.description}</p>
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
                        <div className='stat-value'>{course?.material?.length || 0}</div>
                        <div className='stat-label'>Learning Materials</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='materials' className='space-y-4'>
                {!isLoggedIn ? (
                  <Card className='flex flex-col items-center justify-center py-10 text-center shadow-sm'>
                    <Lock className='text-muted-foreground mb-3 h-8 w-8' />
                    <CardTitle className='text-lg font-semibold text-slate-700'>Please login to view materials</CardTitle>
                    <Button
                      onClick={() =>
                        navigate({
                          to: '/student/login',
                          search: { redirect: `/student/courses/${params.courseID}`, courseID: params.courseID },
                        })
                      }
                      className='mt-4 bg-blue-600 text-white hover:bg-blue-700'
                    >
                      <LogIn className='mr-2 h-4 w-4' /> Login
                    </Button>
                  </Card>
                ) : (
                  <>
                    {course?.material?.length > 0 ? (
                      <Accordion type='multiple' className='space-y-3'>
                        {course.material.map((material: any, index: number) => (
                          <AccordionItem key={material._id} value={`material-${material._id}`} className='rounded-lg border shadow-sm'>
                            <AccordionTrigger className='hover:bg-muted/40 px-4 py-3'>
                              <div className='flex w-full items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                  <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'>
                                    {index + 1}
                                  </div>
                                  <div className='text-left'>
                                    <h3 className='font-semibold text-slate-800'>{material.title}</h3>
                                    <p className='line-clamp-1 text-sm text-slate-500'>{material.description}</p>
                                  </div>
                                </div>
                                {!isEnrolled && <div className='flex items-center gap-1 text-sm text-red-500'><Lock className='h-4 w-4' />Locked</div>}
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className='px-5 pb-5'>
                              <Card className={!isEnrolled ? 'opacity-60 grayscale' : ''}>
                                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                                  <div>
                                    <CardTitle className='text-base font-semibold'>{material.title}</CardTitle>
                                    <p className='text-muted-foreground text-sm'>
                                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                                    </p>
                                  </div>
                                  {isEnrolled ? (
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      onClick={() => setOpenMaterial(prev => (prev === material._id ? null : material._id))}
                                    >
                                      <Play className='mr-2 h-3 w-3' />
                                      {openMaterial === material._id ? 'Hide Material' : 'Access Material'}
                                    </Button>
                                  ) : (
                                    <div className='text-muted-foreground flex items-center gap-2 text-sm'><Lock className='h-4 w-4' /> Locked</div>
                                  )}
                                </CardHeader>

                                <CardContent>
                                  <p className='mb-3 text-sm text-slate-600'>{material.description}</p>
                                  {!isEnrolled && (
                                    <Alert variant='destructive' className='mt-2'>
                                      <Lock className='h-4 w-4' />
                                      <AlertDescription className='text-sm'>You need to enroll in this course to access this material.</AlertDescription>
                                    </Alert>
                                  )}
                                  {isEnrolled && openMaterial === material._id && (
                                    <div className='mt-3'>
                                      {material.type === 'application' && (
                                        <iframe
                                          src={getFileUrl(material.media, 'public/courses/material')}
                                          className='h-80 w-full rounded-md border'
                                          title='PDF Viewer'
                                        />
                                      )}
                                      {material.type === 'video' && (
                                        <video
                                          src={getFileUrl(material.media, 'public/courses/material')}
                                          controls
                                          className='h-80 w-full rounded-lg'
                                        />
                                      )}
                                      {/\.(png|jpg|jpeg|webp)$/i.test(material.media) && (
                                        <img
                                          src={getFileUrl(material.media, 'public/courses/material')}
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
                      <Card className='flex flex-col items-center justify-center py-10 text-center shadow-sm'>
                        <BookOpen className='text-muted-foreground mb-3 h-8 w-8' />
                        <CardTitle className='text-lg font-semibold text-slate-700'>No materials available</CardTitle>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value='instructor' className='space-y-6'>
                <Card className='card-rounded'>
                  <CardHeader className='card-header'>
                    <CardTitle className='card-title'>
                      Instructor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='card-content'>
                    <div className='flex items-center gap-4'>
                      <Avatar>
                        <AvatarImage src={getFileUrl(course?.instructor?.profile || '', 'public/student/profile')} />
                        <AvatarFallback>{course?.instructor?.firstName?.[0] || 'I'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-base font-semibold text-slate-800'>{course?.instructor?.firstName} {course?.instructor?.lastName || ''}</p>
                        <p className='text-sm text-slate-500'>{course?.instructor?.bio || 'Experienced instructor'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className='space-y-6'>
            <Card className='card-rounded'>
              <CardHeader className='card-header'>
                <CardTitle className='card-title'>Actions</CardTitle>
              </CardHeader>
              <CardContent className='card-content'>
                {isEnrolled ? (
                  <Button disabled className='w-full'>Already Enrolled</Button>
                ) : (
                  <Button onClick={() => enrollCourseMutation.mutate()} className='w-full'>Enroll Now</Button>
                )}
              </CardContent>
            </Card>
            <Card className='card-rounded'>
              <CardHeader className='card-header'>
                <CardTitle className='card-title'>Last Updated</CardTitle>
              </CardHeader>
              <CardContent className='card-content'>
                <div className='flex items-center gap-2 text-slate-600'>
                  <Clock11 className='h-4 w-4' />
                  <span>{course?.updatedAt ? format(course.updatedAt, 'PPP') : 'Recent'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
