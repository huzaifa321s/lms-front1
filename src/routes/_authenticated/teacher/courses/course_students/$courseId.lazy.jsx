import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
} from '@tanstack/react-query'
import {
  useNavigate,
  useParams,
  useSearch,
  createLazyFileRoute,
} from '@tanstack/react-router'
import { ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { enrolledCoursesSchema } from '../../-layout/data/schemas/enrolledCoursesStudentsSchema'
const DataTable = lazy(() => import("../../../student/features/tasks/-components/student-data-table"))


import { getDebounceInput, useSearchInput } from '../../../../../utils/globalFunctions'
import { DataTableSkeleton } from '../../../../-components/DataTableSkeleton'

const queryClient = new QueryClient()
const studentsQueryOption = (params) =>
  queryOptions({
    queryKey: ['get-course-students', params.params.courseId, params.deps.q,params.deps.page],
    queryFn: async () => {
      console.log('params ===>',params)
      const pageNumber = params.deps.page
      const searchQuery = params.deps.q
      let queryStr = `page=${pageNumber}`
      if (searchQuery) {
        queryStr += `&q=${searchQuery}`
      }

      try {
        let response = await axios.get(
          `/teacher/course/get-course-students?courseId=${params.params.courseId}&${queryStr}`
        )
        response = response.data
        if (response.success) {
          response = response.data
          return {
            students: response.enrolledStudents,
            totalPages: response.totalPages,
          }
        }
      } catch (error) {
        console.log('error', error)
        return { students: [], totalPages: 0 }
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/teacher/courses/course_students/$courseId'
)({
  validateSearch: (search) => {
    return { q: search.q || '',page:Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q ,page:search.page}
  },
  loader: (params) => queryClient.ensureQueryData(studentsQueryOption(params)),
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = useParams({
    from: '/_authenticated/teacher/courses/course_students/$courseId',
  })

  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/teacher/courses/course_students/$courseId'
  )
  let currentPage = useSearch({
        from: '/_authenticated/teacher/courses/course_students/$courseId',
        select: (search) => search.page,
      })
  const debouncedSearch = getDebounceInput(searchInput,800)
  const isFirstRender = useRef(true);
  const params = {
    deps: { q: debouncedSearch ,page:currentPage},
    params: { courseId: courseId },
    
  }

  const { data, fetchStatus, isFetching } = useQuery(
    {...studentsQueryOption(params),suspense:isFirstRender.current}
  )
    useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])
  const students = data?.students;
  const totalPages = data?.totalPages;
  const navigate = useNavigate()

  // Search & Pagination
  const searchStudents = async () => {
    if (searchInput !== '') {
      navigate({
        to: `/teacher/courses/course_students/${courseId}`,
        search: { q: searchInput },
      })
    } else {
      navigate({
        to: `/teacher/courses/course_students/${courseId}`,
        search: { q: '' },
      })
    }
  }


    
      let [paginationOptions, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    })
  
    const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) 
    navigate({
      to: `/teacher/courses/course_students/${courseId}`,
      search: { q: searchInput, page: newPageIndex + 1 }, 
    })
  }
  return (
    <>
      <Header >
        <div className='my-2 flex w-full items-center justify-between px-4'>
          <div className='text-2xl font-semibold text-white'>Enrolled Students</div>
          <div className='flex items-center gap-4'>
            <Label className="flex items-center gap-2">
              <Input
                size='sm'
                type='text'
                className='grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                placeholder='Search students...'
                value={searchInput || ''}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                size='sm'
                variant='outline'
                className='rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#475569] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:opacity-50'
                onClick={searchStudents}
                loading={isFetching}
                disabled={isFetching}
              >
                {!isFetching && (
                 <Search/>
                )}
                Search
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#475569] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                onClick={() => window.history.back()}
              >
              <ArrowLeft/>
                Back
              </Button>
            </Label>
          </div>
        </div>
      </Header>
      <div className="px-4 py-8">
          <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={students}
          columns={enrolledCoursesSchema}
          fetchStatus={fetchStatus}
          totalPages={totalPages}
          pagination={true}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handlePagination={handlePagination}
          paginationOptions={paginationOptions}
          className="rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
          headerClassName="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] text-[#1e293b] font-semibold"
          rowClassName="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#f1f5f9] text-[#64748b]"
          paginationClassName="border-t border-[#e2e8f0] bg-white text-[#64748b]"
        />
        </Suspense>
      </div>
    </>
  )
}
