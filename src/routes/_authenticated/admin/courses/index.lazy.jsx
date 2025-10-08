import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import { useSearch, createLazyFileRoute } from '@tanstack/react-router'
import { Loader, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
const DataTable = lazy(() => import("../../student/features/tasks/-components/student-data-table"))

import { coursesSchema } from '../layout/data/-schemas/coursesSchema'
import CoursesSummary from './-components/CoursesSummary'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'

const queryClient = new QueryClient()

const postQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['course', deps.q, deps.page],
    suspense: deps.suspense ?? true,
    queryFn: async () => {
      try {
        const pageNumber = deps.page
        let queryStr = `page=${pageNumber}`
        console.log('deps.q ===>',deps.q)
        if (deps.q) {
          queryStr += `&q=${deps.q}`
        }
        let response = await axios.get(`/admin/course/get?${queryStr}`)
        response = response.data
        if (response.success) {
          return {courses:response.data.courses,totalPages:response.data.totalPages}
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createLazyFileRoute('/_authenticated/admin/courses/')({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps }) => queryClient.ensureQueryData(postQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const { router, navigate } = useAppUtils()
  const isFirstRender = useRef(true)
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/courses/'
  )
  const debouncedSearch = getDebounceInput(searchInput,800)
  let currentPage = useSearch({
    from: '/_authenticated/admin/courses/',
    select: (search) => search.page,
  })
  console.log('currentPage ===>', currentPage)

  let { data, isFetching, fetchStatus } = useQuery(
    postQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  );

  const { data: coursesStatus,fetchStatus:statusFetchStatus } = useQuery({
    queryKey: ['get-courses-status'],
    queryFn:async () => {
      try{
let response = await axios.get(`/admin/course/get-courses-status`)
console.log('courses response ===>',response);
response = response.data;
if(response.success){
  return {...response.data}
}
      }catch(error){
        console.log('error',error);
      }
    }
  });
  console.log('coursesStatus ===>',coursesStatus)

const courses = data?.courses;
const totalPages = data?.totalPages;


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])



  let [paginationOptions, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
})

  const searchCourses = async () => {
    if (searchInput !== '') {
      router.navigate({
        to: `/admin/courses`,
        search: { q: searchInput },
      })
    } else {
      router.navigate({
        to: `/admin/courses`,
        search: { q: '' },
      })
    }
  }

  
const handlePagination = (newPageIndex) => {
  const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
  setPagination(newPagination) // table update
  navigate({
    to: '/admin/courses',
    search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
  })
}



  return (
    <>
      <Header >
        <div className="my-2 flex w-full justify-between">
          <div className="text-2xl font-semibold  bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-white">
            Courses
          </div>
        </div>
      </Header>
      <Main className=" px-4 py-8 ">
        <CoursesSummary 
          fetchStatus={statusFetchStatus} 
          total={coursesStatus?.total} 
          active={coursesStatus?.active} 
          inactive={coursesStatus?.inActive} 
        />
        <Separator className="my-5 bg-[#e2e8f0]" />
        <div className="mb-6 flex items-center justify-between">
          <h2 className="mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-bold text-transparent">
            Courses
          </h2>
          <div className="flex items-center gap-2">
            <Label>
              <Input
                size="sm"
                type="text"
                placeholder="Search Courses"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={searchCourses}
                disabled={isFetching}
                className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {isFetching ? (
                  <Loader className="h-4 w-4 animate-spin text-[#2563eb]" />
                ) : (
                  <Search className="h-4 w-4 text-[#2563eb]" />
                )}
              </Button>
            </Label>
          </div>
        </div>
 <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={courses}
          columns={coursesSchema}
          fetchStatus={fetchStatus}
          pagination={true}
          setSearchInput={setSearchInput}
          searchInput={searchInput}
          setPagination={setPagination}
          handlePagination={handlePagination}
          totalPages={totalPages}
          paginationOptions={paginationOptions} 
        />
        </Suspense>
      </Main>
    </>
  )
}
