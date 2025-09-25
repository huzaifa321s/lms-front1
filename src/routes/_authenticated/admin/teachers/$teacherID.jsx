import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { IconLoader } from '@tabler/icons-react'
import { Search, ArrowLeft, User, Mail, Phone, Calendar, GraduationCap, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { DataTable } from '../../student/features/tasks/-components/student-data-table'
import { coursesSchema } from '../layout/data/-schemas/coursesSchema'
import { getDebounceInput, useSearchInput } from '../../../../utils/globalFunctions'

const queryClient = new QueryClient()
const teacherDetailsQueryOptions = (params) =>
  queryOptions({
    queryKey: ['teacher', 'course', params.params.teacherID],
    queryFn: async () => {
      try {
        console.log('params ===>', params)
        let teacherDetailsResponse = await axios.get(
          `/admin/teacher/getTeacher/${params.params.teacherID}`,
          {}
        )
        teacherDetailsResponse = teacherDetailsResponse.data
        console.log('teacherDetailsResponse ===>', teacherDetailsResponse)

        return {
          teacher: teacherDetailsResponse.success
            ? teacherDetailsResponse.data
            : null,
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

const courseQueryOption = (params) =>
  queryOptions({
    queryKey: ['course', params.params.teacherID, params.deps.q,params.deps.page],
    queryFn: async () => {
      try {
        console.log('params.deps ===>',params.deps)
        let queryStr = `page=${params.deps.page}&teacherId=${params.params.teacherID}`
        if (params.deps.q !== '') queryStr += `&q=${params.deps.q}`
        let coursesResponse = await axios.get(`/admin/course/get?${queryStr}`)
        coursesResponse = coursesResponse.data
        console.log('courseResponse ===>',coursesResponse)
        if (coursesResponse.success) {
          return { courses: coursesResponse.data.courses,totalPages :coursesResponse.data.totalPages }
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/admin/teachers/$teacherID'
)({
  validateSearch: (search) => {
    return { q: search.q || '' ,page:Number(search.page ?? 1)}
  },
  loaderDeps: ({ search }) => {
    return { q: search.q ,page:search.page}
  },
  loader: async (params) => {
    ;(await queryClient.ensureQueryData(teacherDetailsQueryOptions(params)),
      queryClient.prefetchQuery(courseQueryOption(params)))
  },
  component: RouteComponent,
})

const defaultProfile =
  'https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg?w=826'

function RouteComponent() {
  const { teacherID } = useParams({
    from: '/_authenticated/admin/teachers/$teacherID',
  })
    let currentPage = useSearch({
    from: '/_authenticated/admin/teachers/$teacherID',
    select: (search) => search.page,
  })
  const isFirstRender = useRef(true)
  const [searchInput, setSearchInput] = useSearchInput('/_authenticated/admin/teachers/$teacherID')
  console.log('search Input ===>',searchInput)
  const debouncedSearch = getDebounceInput(searchInput,800)
  const deps = { q: debouncedSearch,page:currentPage }
 
  const params = { deps, params: { teacherID } }
  const { data:{teacher},  isFetching } = useSuspenseQuery(
    teacherDetailsQueryOptions(params)
  )
console.log('teacher 1 ====>',teacher)
  const {
    data,isFetching:coursesIsFetching,fetchStatus:coursesFetchStatus
  } = useQuery({...courseQueryOption(params),suspense:isFirstRender.current})

 useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, []);


  const courses = data?.courses;
  const totalPages = data?.totalPages;

  const navigate = useNavigate()

  const searchCourses = async () => {
    if (searchInput !== '') {
      navigate({
        to: `/admin/teachers/${teacherID}`,
        search: { q: searchInput },
      })
    } else {
      navigate({ to: `/admin/teachers/${teacherID}`, search: { q: '' } })
    }
    params.deps.q = searchInput
    // await queryClient.invalidateQueries(teacherDetailsQueryOptions(params))
  }
  

  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  console.log('isFirstRender.current ===>', isFirstRender.current)

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) // table update
    navigate({
      to: '/admin/teachers/$teacherID',
      search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
    })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
          <Header >
        <div className="relative z-10 my-4 flex w-full items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold  bg-clip-text ">
              Teacher Profile
            </div>
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-[#2563eb]/20 to-[#1d4ed8]/20"></div>
            <div className="hidden sm:flex items-center gap-2 ">
              <User size={20} />
              <span className="text-sm font-medium">Professional Details</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 text-[#2563eb] group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="ml-2 hidden sm:inline">Back</span>
          </Button>
        </div>
      </Header>
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

  

      <div className="relative z-10 mb-8 ">
        {/* Left sidebar - Profile & Skills */}
        <div className="flex items-center  space-y-6">
          {/* Profile Card */}
          <Card className="group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300 w-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 p-8">
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="relative group/avatar">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full blur opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-[#e2e8f0] group-hover/avatar:ring-[#cbd5e1] transition-all duration-300 shadow-sm">
                    <img
                      src={
                        teacher?.profile
                          ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/teacher/profile/${teacher.profile}`
                          : defaultProfile
                      }
                      loading="lazy"
                      alt="Teacher Profile"
                      className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Name and Bio */}
              <div className="text-center">
                <CardTitle className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  {teacher?.firstName} {teacher?.lastName}
                </CardTitle>
                <p className="text-[#64748b] text-sm leading-relaxed">
                  {teacher?.bio ||
                    'Passionate educator dedicated to inspiring and empowering students through innovative teaching methods and personalized learning experiences.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Skills & Expertise Card */}
          <Card className="group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300 w-1/2 h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-lg">
                    <Award className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                    Qualification
                  </CardTitle>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0] hover:shadow-md transition-all duration-300">
                  <GraduationCap className="w-5 h-5 text-[#2563eb] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[#1e293b] mb-1">Qualification</div>
                    <div className="text-[#64748b] text-sm">{teacher?.qualification}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Basic Info & Courses */}
        <div className="xl:col-span-12 space-y-6">
          {/* Basic Info Card */}
          <Card className="group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative z-10 p-6">
              <CardTitle className="text-2xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                <User className="w-7 h-7 text-[#2563eb]" />
                Basic Information
              </CardTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group/item flex items-center gap-4 p-4 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0] hover:shadow-md transition-all duration-300">
                  <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-lg group-hover/item:bg-[#2563eb]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#1e293b] uppercase tracking-wide mb-1">Email</div>
                    <div className="text-[#1e293b] font-medium text-sm">{teacher?.email || 'teacher@example.com'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Card */}
          <Card className="group relative overflow-hidden border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="relative z-10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  <GraduationCap className="w-7 h-7 text-[#2563eb]" />
                  Courses Created
                </CardTitle>

                <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-[8px] border border-[#e2e8f0]">
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={searchInput || ''}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10 rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2563eb]" />
                  </div>
                  <Button
                    size="sm"
                    disabled={isFetching}
                    onClick={searchCourses}
                    className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {isFetching ? (
                      <IconLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-[8px] border border-[#e2e8f0] overflow-hidden">
                <DataTable
                  data={courses}
                  columns={coursesSchema}
                  fetchStatus={coursesFetchStatus}
                  isFetching={coursesIsFetching}
                  totalPages={totalPages}
                  pagination={true}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  paginationOptions={paginationOptions}
                  setPagination={setPagination}
                  handlePagination={handlePagination}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}