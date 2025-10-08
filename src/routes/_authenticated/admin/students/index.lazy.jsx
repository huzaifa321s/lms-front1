import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSearch, createLazyFileRoute } from '@tanstack/react-router'
import { Download, GraduationCap, LayoutDashboard, Loader, Search, Settings, User2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  getDebounceInput,
  useSearchInput,
  exportToCSV,
} from '../../../../utils/globalFunctions'
const DataTable = lazy(() => import("../../student/features/tasks/-components/student-data-table"))

import { studentsSchema } from '../layout/data/-schemas/studentsSchema'
import StudentsMetrics from './-components/StudentsMetrics'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'

const queryClient = new QueryClient()

const studentsQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['student', deps.q,deps.page],
    queryFn: async () => {
      try {
        const pageNumber = deps.page;
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(`/admin/student/get?${queryStr}`)
        response = response.data
        if (response.success) {
          console.log('response.data ===>',response.data)
          return {students:response.data.students,totalPages:response.data.totalPages}
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createLazyFileRoute('/_authenticated/admin/students/')({
  validateSearch: (search) => {
    return { q: search.q || '',page:Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q ,page:search.page}
  },
  loader: ({ deps }) => queryClient.ensureQueryData(studentsQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const isFirstRender = useRef(true)
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/students/'
  )
  let currentPage = useSearch({
      from: '/_authenticated/admin/students/',
      select: (search) => search.page,
    })
  const debouncedSearch = getDebounceInput(searchInput,800)
  const { data, fetchStatus, isFetching } = useQuery(
    {...studentsQueryOptions({
      q: debouncedSearch,
      page:currentPage
    }),suspense: isFirstRender.current,
}
  )



  const { data: studentsStatus,fetchStatus:statusFetchStatus } = useQuery({
    queryKey: ['get-students-status'],
    queryFn:async () => {
      try{
let response = await axios.get(`/admin/student/get-students-status`)
console.log('student response ===>',response);
response = response.data;
if(response.success){
  return {...response.data}
}
      }catch(error){
        console.log('error',error);
      }
    }
  });
  console.log('studentsStatus ===>',studentsStatus)


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, []);


  const students = data?.students;
  const totalPages = data?.totalPages;

  const { navigate } = useAppUtils()
  const searchStudents = async () => {
    if (searchInput.trim() !== '') {
      navigate({ to: '/admin/students/', search: { q: debouncedSearch } })
      await queryClient.invalidateQueries(
        studentsQueryOptions({ q: searchInput })
      )
    } else {
      navigate({ to: '/admin/students', search: { q: '' } })
      // await queryClient.invalidateQueries(studentsQueryOptions({ q: '' }))
    }
  }


  
    let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handlePagination = (newPageIndex) => {
  const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
  setPagination(newPagination) // table update
  navigate({
    to: '/admin/students',
    search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
  })
}



  return (
   <>
      <Header >
        <TopNav links={topNav} />
      </Header>
      <Main className=" px-4 py-2">
        <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
          Students Management
        </h1>

        <StudentsMetrics
          fetchStatus={statusFetchStatus}
          total={studentsStatus?.total}
          active={studentsStatus?.active}
          inactive={studentsStatus?.inActive}
        />
        <Separator className="my-2 bg-[#e2e8f0]" />

        <div className="flex justify-between mb-2">
          <h2 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-bold text-transparent">
            Students
          </h2>
          <div className="flex items-center gap-1">
            <Label>
              <Input
                type="text"
                className="grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                size="sm"
                placeholder="Search Students"
                value={searchInput || ''}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  navigate({
                    to: '/admin/students',
                    search: { q: debouncedSearch }
                  });
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={searchStudents}
                className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {isFetching ? (
                  <Loader className="h-4 w-4 animate-spin text-[#2563eb]" />
                ) : (
                  <Search className="h-4 w-4 text-[#2563eb]" />
                )}
              </Button>
            </Label>
            <Button
              size="xs"
              onClick={() => exportToCSV(data)}
              variant="outline"
              className="ml-2 rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Download className="h-4 w-4 text-[#2563eb]" />
              Export CSV
            </Button>
          </div>
        </div>
    <Suspense fallback={<DataTableSkeleton />}>

        <DataTable
          data={students}
          columns={studentsSchema}
          fetchStatus={fetchStatus}
          totalPages={totalPages}
          pagination={true}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handlePagination={handlePagination}
          paginationOptions={paginationOptions}
        />
        </Suspense>
      </Main>
    </>
  )
}
const topNav = [
  {
    title: 'Overview',
    href: '/admin',
    isActive: false,
    disabled: false,
    icon:LayoutDashboard
  },
  {
    title: 'Students',
    href: '/admin/students',
    isActive: true,
    disabled: false,
    icon:User2
  },
  {
    title: 'Teachers',
    href: '/admin/teachers',
    isActive: false,
    disabled: false,
    icon: GraduationCap
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    isActive: false,
    disabled: false,
    icon:Settings
  },
]
