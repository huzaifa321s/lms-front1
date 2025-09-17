import { useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useParams, useRouterState } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  User,
  Users,
  Download,
  FileText,
  Award,
  Clock,
  Star,
  GraduationCap,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreVertical,
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
import { Input } from '@/components/ui/input'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { openModal } from '../../../../../shared/config/reducers/teacher/teacherDialogSlice'
import { format } from 'date-fns'

const queryClient = new QueryClient()

const courseDetailsQueryOptions = (params) =>
  queryOptions({
    queryKey: ['getCourse', params.courseID],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/teacher/course/getCourse/${params.courseID}`,
          {}
        )

        response = response.data
        if (response.success) {
          return response.data
        }
      } catch (error) {
        console.log('error', error)
        return null
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/teacher/courses/course_details/$courseID'
)({
  loader: ({ params }) =>
    queryClient.ensureQueryData(courseDetailsQueryOptions(params)),
  component: EnhancedCourseDetails,
})



export default function EnhancedCourseDetails() {
  const params = useParams({
    from: '/_authenticated/teacher/courses/course_details/$courseID',
  })
  const { data } = useSuspenseQuery(courseDetailsQueryOptions(params))
  console.log('data ===>', data)

    const state = useRouterState({
    select: (s) => s.location.state
  })
  const [courseObj] = useState(data)
  const [enrolledStudents] = useState(data?.studentsEnrolled);
  console.log('enrolledStudents ====>',enrolledStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const { navigate, dispatch } = useAppUtils()

  const defaultCover =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
  const [cover] = useState(defaultCover)

  const filteredStudents = enrolledStudents.filter(
    (fs) =>
      
      `${fs.student.firstName} ${fs.student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      fs.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
console.log('fitleredStudents ====>',filteredStudents)
  const handleEditClick = () => {
    navigate({ to: `/teacher/courses/edit_course/${params.courseID}` })
  }

  const handleDeleteClick = () => {
    dispatch(
      openModal({
        type: 'delete-course-modal',
        props: {
          courseDetails: {
            name: courseObj?.name,
            desc: courseObj?.description,
          },
          courseId: params.courseID,
          redirect: '/teacher/courses',
          query: '',
          page: state.page,
        },
      })
    )
  }

  return (
 <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f1f5f9]'>
      {/* Background glow effects */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] opacity-20 mix-blend-multiply blur-xl filter delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] opacity-10 mix-blend-multiply blur-xl filter delay-500'></div>
      </div>

      {/* Header */}
      <div className='relative z-10 border-b border-[#e2e8f0] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]'>
        <div className='mx-auto max-w-7xl px-4 py-4'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent'>
                Course Details
              </div>
              <div className='hidden h-8 w-px bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] sm:block'></div>
              <div className='hidden items-center gap-2 text-[#2563eb] sm:flex'>
                <BookOpen size={20} />
                <span className='text-sm font-medium'>
                  Comprehensive Overview
                </span>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                size='sm'
                variant='outline'
                className='border-[#e2e8f0] text-[#10b981] hover:bg-[#e2e8f0] rounded-[8px]'
                onClick={handleEditClick}
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='border-[#e2e8f0] text-[#ef4444] hover:bg-[#e2e8f0] rounded-[8px]'
                onClick={handleDeleteClick}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='border-[#e2e8f0] text-[#475569] hover:bg-[#e2e8f0] rounded-[8px] transition-all duration-300'
                onClick={() => window.history.back()}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8'>
        {/* Course Hero Card */}
        <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-[12px] transition-all duration-500 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>

          {/* Course Cover Image */}
          <div className='relative h-64 overflow-hidden md:h-80 lg:h-96'>
            <img
              src={cover}
              alt={courseObj?.name}
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-[#1e293b]/50 via-transparent to-transparent'></div>
            <div className='absolute top-4 right-4'>
              <Badge className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg'>
                {courseObj?.category?.name}
              </Badge>
            </div>
            <div className='absolute bottom-4 left-4 text-white'>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Users size={16} />
                  <span>{courseObj?.studentsEnrolled?.length} Students</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock size={16} />
                  <span>{courseObj?.material?.length || 0} Materials</span>
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
                    className='border-[#e2e8f0] text-[#2563eb]'
                  >
                    <GraduationCap size={14} className='mr-1' />
                    Course
                  </Badge>
                </div>
              </div>

              <div className='rounded-[12px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4'>
                <p className='leading-relaxed text-[#64748b]'>
                  {courseObj?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Stats Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Card className='group border border-[#e2e8f0] bg-white rounded-[12px] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] p-3'>
                  <Users className='h-6 w-6 text-white' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-[#1e293b]'>
                    {courseObj?.studentsEnrolled?.length}
                  </p>
                  <p className='text-sm text-[#64748b]'>Enrolled Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='group border border-[#e2e8f0] bg-white rounded-[12px] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] p-3'>
                  <FileText className='h-6 w-6 text-white' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-[#1e293b]'>
                    {courseObj?.material?.length || 0}
                  </p>
                  <p className='text-sm text-[#64748b]'>Course Materials</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='group border border-[#e2e8f0] bg-white rounded-[12px] transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] p-3'>
                  <Award className='h-6 w-6 text-white' />
                </div>
                <div>
                  <p className={`bg-gradient-to-r ${courseObj?.studentsEnrolled?.length > 0 ? "from-[#10b981]" : "from-[#ef4444]"} to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent`}>
                    {courseObj?.studentsEnrolled?.length > 0 ? "Active" : "Inactive"}
                  </p>
                  <p className='text-sm text-[#64748b]'>Course Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className='flex space-x-1 rounded-[12px] border border-[#e2e8f0] bg-white p-1 shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 rounded-[8px] px-4 py-2 font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg'
                : 'text-[#64748b] hover:bg-[rgba(37,99,235,0.05)]'
            }`}
          >
            <FileText className='mr-2 inline h-4 w-4' />
            Materials
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 rounded-[8px] px-4 py-2 font-medium transition-all duration-200 ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg'
                : 'text-[#64748b] hover:bg-[rgba(37,99,235,0.05)]'
            }`}
          >
            <Users className='mr-2 inline h-4 w-4' />
            Students {enrolledStudents.length}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
            <div className='absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>

            <CardContent className='relative z-10 p-6'>
              <CardTitle className='mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                <FileText className='h-7 w-7 text-[#2563eb]' />
                Course Materials
              </CardTitle>

              <div className='space-y-4'>
                {courseObj?.material?.map((m, k) => (
                  <Accordion
                    type='single'
                    collapsible
                    className='rounded-[12px] border border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] transition-all duration-300 hover:shadow-md'
                    key={k}
                  >
                    <AccordionItem value='item-1' className='border-none'>
                      <AccordionTrigger className='rounded-t-[12px] px-6 py-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#f1f5f9] hover:no-underline'>
                        <div className='flex items-center gap-3'>
                          <div className='rounded-lg bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2'>
                            <BookOpen className='h-5 w-5 text-white' />
                          </div>
                          <span className='font-semibold text-[#1e293b]'>
                            {m.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='px-6 pb-4'>
                        <div className='space-y-3'>
                          <div className='rounded-[12px] border border-[#e2e8f0] bg-white p-4'>
                            <span className='mb-2 block font-semibold text-[#1e293b]'>
                              Description:
                            </span>
                            <p className='text-[#64748b]'>{m.description}</p>
                          </div>

                          {m.media && (
                            <div className='flex items-center gap-3'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='border-[#e2e8f0] text-[#2563eb] hover:bg-[#e2e8f0] rounded-[8px]'
                                onClick={() => console.log('Download', m.media)}
                              >
                                <Download className='mr-2 h-4 w-4' />
                                Download {m.media}
                              </Button>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}

                {(!courseObj?.material || courseObj.material.length === 0) && (
                  <div className='py-8 text-center text-[#64748b]'>
                    <FileText className='mx-auto mb-3 h-12 w-12 text-[#94a3b8]' />
                    <p>No materials available for this course yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'students' && (
          <Card className='group relative overflow-hidden border border-[#e2e8f0] bg-white rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-lg hover:shadow-[#cbd5e1]/20'>
            <div className='absolute inset-0 bg-gradient-to-r from-[#f59e0b]/5 to-[#d97706]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100'></div>

            <CardContent className='relative z-10 p-6'>
              <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <CardTitle className='flex items-center gap-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-2xl font-bold text-transparent'>
                  <Users className='h-7 w-7 text-[#f59e0b]' />
                  Enrolled Students ({filteredStudents.length})
                </CardTitle>

                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#94a3b8]' />
                    <Input
                      placeholder='Search students...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-64 border-[#e2e8f0] pl-10 focus:border-[#2563eb]'
                    />
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-[#e2e8f0] text-[#2563eb] hover:bg-[#e2e8f0] rounded-[8px]'
                  >
                    <Filter className='mr-2 h-4 w-4' />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Students Table */}
              <div className='overflow-x-auto'>
                <div className='overflow-hidden rounded-[12px] border border-[#e2e8f0]'>
                  <table className='w-full'>
                    <thead className='bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]'>
                      <tr>
                        <th className='px-6 py-4 text-left text-sm font-semibold text-[#1e293b]'>
                          Student
                        </th>
                        <th className='px-6 py-4 text-left text-sm font-semibold text-[#1e293b]'>
                          Email
                        </th>
                        <th className='px-6 py-4 text-left text-sm font-semibold text-[#1e293b]'>
                          Enrolled Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#e2e8f0] bg-white'>
                      {filteredStudents.map((fs, index) => (
                        <tr
                          key={fs.student._id}
                          className='transition-all duration-200 hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#f1f5f9]'
                        >
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] font-semibold text-white'>
                                {fs.student.firstName[0]}
                                {fs.student.lastName[0]}
                              </div>
                              <div>
                                <div className='font-medium text-[#1e293b]'>
                                  {fs.student.firstName} {fs.student.lastName}
                                </div>
                                <div className='text-sm text-[#64748b]'>
                                  ID: {fs.student._id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-sm text-[#64748b]'>
                            {fs.student.email}
                          </td>
                          <td className='px-6 py-4 text-sm text-[#64748b]'>
                            {format(fs.student.updatedAt, "PPP")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredStudents.length === 0 && (
                  <div className='py-12 text-center'>
                    <Users className='mx-auto mb-4 h-16 w-16 text-[#94a3b8]' />
                    <h3 className='mb-2 text-lg font-medium text-[#1e293b]'>
                      No students found
                    </h3>
                    <p className='text-[#64748b]'>
                      {searchTerm
                        ? 'Try adjusting your search criteria.'
                        : 'No students have enrolled in this course yet.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
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
  )
}
