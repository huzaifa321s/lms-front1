import { useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
  useQuery,
} from '@tanstack/react-query'
import {
  useParams,
  createLazyFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  User,
  Users,
  FileText,
  Award,
  Clock,
  Star,
  GraduationCap,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from '@/components/ui/shadcn-io/status'
import { Header } from '@/components/layout/header'
import { getFileUrl } from '@/utils/globalFunctions'

const queryClient = new QueryClient()

const courseQueryOption = (courseID) =>
  queryOptions({
    queryKey: ['course', courseID],
    queryFn: async () => {
      console.log('courseID inner ===>', courseID)
      try {
        let response = await axios.get(
          `/admin/course/getCourse/${courseID}`,
          {}
        )
        response = response.data
        console.log('response.data ===>', response.data)

        if (response.success) {
          return response.data
        }
      } catch (error) {
        console.log('error', error)
        return null
      }
    },
  })

const enrolledStudentsQueryOption = (courseID) =>
  queryOptions({
    queryKey: ['enrolledStudents', courseID],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/admin/course/getEnrolledStudents/${courseID}`,
          {}
        )
        response = response.data
        console.log('enrolled students ===>', response.data)

        if (response.success) {
          return response.data
        }
      } catch (error) {
        console.log('error fetching enrolled students', error)
        return []
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/admin/courses/$courseID'
)({
  loader: ({ params }) => {
    queryClient.ensureQueryData(courseQueryOption(params.courseID))
    queryClient.prefetchQuery(enrolledStudentsQueryOption(params.courseID))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { courseID } = useParams({
    from: '/_authenticated/admin/courses/$courseID',
  })
  const { data } = useSuspenseQuery(courseQueryOption(courseID))
  console.log('data ===>', data)
  const { data: enrolledStudents = [] } = useQuery(
    enrolledStudentsQueryOption(courseID)
  )
  const [courseObj, setCourseObj] = useState(data)
  const [cover, setCover] = useState(
    data && data.coverImage
      ? getFileUrl(data.coverImage, 'public/courses/cover-images')
      : defaultCover
  )

  return (
    <>
      <Header>
        <div className='relative z-10 my-4 flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-white'>
              Course Overview
            </div>
            <div className='hidden h-8 w-px bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] sm:block'></div>
            <div className='hidden items-center gap-2 text-white sm:flex'>
              <BookOpen size={20} />
              <span className='text-sm font-medium'>Detailed Information</span>
            </div>
          </div>
          <Button
            variant='outline'
            className="text-black"
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
            <span className='ml-2 hidden sm:inline'>Back</span>
          </Button>
        </div>
      </Header>

      <div className='min-h-screen bg-[#f8fafc]'>

        <div className='relative z-10 mb-8 space-y-6 px-4 py-8'>
          {/* Course Hero Card */}
          <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
            <div className='absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>

            {/* Course Cover Image */}
            <div className='relative h-64 overflow-hidden md:h-80 lg:h-96'>
              <img
                src={cover}
                alt={courseObj?.name}
                className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent'></div>
              <div className='absolute top-4 right-4'>
                <Badge className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-sm'>
                  {courseObj?.category?.name}
                </Badge>
              </div>
              <div className='absolute bottom-4 left-4 text-white'>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1'>
                    <Users size={16} />
                    <span>{courseObj?.enrolledStudents?.length} Students</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock size={16} />
                    <span>{courseObj?.material?.length} Materials</span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className='relative z-10 p-6'>
              <div className='space-y-4'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='flex-1'>
                    <h1 className='mb-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent lg:text-4xl'>
                      {courseObj?.name}
                    </h1>
                    <div className='mb-4 flex items-center gap-3 text-[#64748b]'>
                      <div className='flex items-center gap-1'>
                        <User size={16} className='text-[#2563eb]' />
                        <span className='font-medium'>
                          {courseObj?.instructor?.firstName}{' '}
                          {courseObj?.instructor?.lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <Badge
                      variant='outline'
                      className='border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b]'
                    >
                      <GraduationCap
                        size={14}
                        className='mr-1 text-[#2563eb]'
                      />
                      Course
                    </Badge>
                    <Badge
                      variant='outline'
                      className='border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b]'
                    >
                      <Star size={14} className='mr-1 text-[#f59e0b]' />
                      Featured
                    </Badge>
                  </div>
                </div>

                <div className='rounded-[12px] border border-[#e2e8f0] bg-white p-4'>
                  <p className='leading-relaxed text-[#1e293b]'>
                    {courseObj?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Stats Cards */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <Card className='group border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='rounded-[8px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-3'>
                    <Users className='h-6 w-6 text-[#2563eb]' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-[#1e293b]'>
                      {courseObj?.enrolledStudents?.length}
                    </p>
                    <p className='text-sm text-[#94a3b8]'>Enrolled Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='rounded-[8px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-3'>
                    <FileText className='h-6 w-6 text-[#2563eb]' />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-[#1e293b]'>
                      {courseObj?.material?.length || 0}
                    </p>
                    <p className='text-sm text-[#94a3b8]'>Course Materials</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='rounded-[8px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-3'>
                    <Award className='h-6 w-6 text-[#2563eb]' />
                  </div>
                  <div>
                    <Status
                      status={
                        courseObj?.enrolledStudents?.length > 0
                          ? 'Paid'
                          : 'Uncollectible'
                      }
                    >
                      <StatusIndicator />
                      <StatusLabel
                        value={
                          courseObj?.enrolledStudents?.length > 0
                            ? 'Active'
                            : 'Inactive'
                        }
                      />
                    </Status>
                    <p className='text-sm text-[#94a3b8]'>Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
            {/* Course Materials */}
            <div className='xl:col-span-2'>
              <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>

                <CardContent className='relative z-10 p-6'>
                  <CardTitle className='mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                    <FileText className='h-7 w-7 text-[#2563eb]' />
                    Course Materials
                  </CardTitle>

                  <Accordion type='single' collapsible className='space-y-4'>
                    {courseObj?.material?.map((material, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`material-${idx}`}
                        className='rounded-[12px] border border-[#e2e8f0] bg-white shadow-sm transition-all duration-300 hover:shadow-md'
                      >
                        {/* Accordion Header */}
                        <AccordionTrigger className='px-6 py-4 hover:no-underline [&[data-state=open]>div]:text-[#2563eb]'>
                          <div className='flex items-center gap-3'>
                            <div className='rounded-[8px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 p-2'>
                              <BookOpen className='h-5 w-5 text-[#2563eb]' />
                            </div>
                            <h3 className='font-semibold text-[#1e293b]'>
                              {material.title}
                            </h3>
                          </div>
                        </AccordionTrigger>

                        {/* Accordion Content */}
                        <AccordionContent className='px-6 pb-6'>
                          <div className='space-y-4'>
                            {/* Description */}
                            {material.description && (
                              <p className='text-sm text-[#64748b]'>
                                {material.description}
                              </p>
                            )}

                            {/* Media Preview */}
                            {material.media && (
                              <>
                                {/* PDF */}
                                {material.type === 'application' && (
                                  <iframe
                                    src={getFileUrl(material.media, 'public/courses/material')}
                                    className='h-[70vh] w-full rounded-lg border bg-slate-50'
                                  />
                                )}

                                {/* Images */}
                                {material.media.match(
                                  /\.(png|jpg|jpeg|gif)$/i
                                ) && (
                                    <div className='flex h-[70vh] items-center justify-center rounded-lg border bg-slate-100'>
                                      <img
                                        src={getFileUrl(material.media, 'public/courses/material')}
                                        alt='Preview'
                                        className='max-h-full max-w-full object-contain'
                                      />
                                    </div>
                                  )}

                                {/* Videos */}
                                {material.media.match(/\.(mp4|webm)$/i) && (
                                  <video
                                    controls
                                    src={getFileUrl(material.media, 'public/courses/material')}
                                    className='h-[70vh] w-full rounded-lg border bg-black'
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    {/* No Material Fallback */}
                    {(!courseObj?.material ||
                      courseObj.material.length === 0) && (
                        <div className='py-8 text-center text-[#94a3b8]'>
                          <FileText className='mx-auto mb-3 h-12 w-12 text-[#94a3b8]' />
                          <p>No materials available for this course yet.</p>
                        </div>
                      )}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Enrolled Students */}
            <div className='xl:col-span-1'>
              <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>

                <CardContent className='relative z-10 p-6'>
                  <CardTitle className='mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                    <Users className='h-7 w-7 text-[#2563eb]' />
                    Enrolled Students
                  </CardTitle>

                  <div className='custom-scrollbar max-h-96 space-y-3 overflow-y-auto'>
                    {courseObj?.enrolledStudents?.map((ec, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 rounded-[8px] border border-[#e2e8f0] bg-white p-3 transition-all duration-200 hover:bg-[#f8fafc] hover:shadow-sm'
                      >
                        {index + 1}
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] font-semibold text-white'>
                          {ec.student.firstName?.[0]?.toUpperCase()}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-semibold text-[#1e293b]'>
                            {ec.student.firstName &&
                              ec.student.lastName &&
                              `${ec.student.firstName} ${ec.student.lastName}`}
                          </p>
                          <p className='truncate text-sm text-[#94a3b8]'>
                            {ec.student.email}
                          </p>
                        </div>
                      </div>
                    ))}

                    {(!courseObj?.enrolledStudents ||
                      courseObj?.enrolledStudents.length === 0) && (
                        <div className='py-8 text-center text-[#94a3b8]'>
                          <Users className='mx-auto mb-3 h-12 w-12 text-[#94a3b8]' />
                          <p>No students enrolled yet.</p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #2563eb, #1d4ed8);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #1d4ed8, #1e40af);
          }
        `}</style>
      </div>
    </>
  )
}
