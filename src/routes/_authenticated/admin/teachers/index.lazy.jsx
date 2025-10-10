import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import {
  useNavigate,
  useSearch,
  createLazyFileRoute,
} from '@tanstack/react-router'
import {
  Download,
  GraduationCap,
  LayoutDashboard,
  Loader,
  Search,
  Settings,
  User2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'
import { Show } from '../../../../shared/utils/Show'
import {
  exportToCSV,
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import { teachersSchema } from '../layout/data/-schemas/teachersSchema'
import TeachersMetrics from './-components/TeachersMetrics'

const DataTable = lazy(
  () => import('../../student/features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()
const teachersQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['teacher', deps.q, deps.page],
    suspense: deps.suspense ?? true,
    queryFn: async () => {
      try {
        const pageNumber = deps.page
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(`/admin/teacher/get?${queryStr}`)
        response = response.data
        if (response.success) {
          response = response.data
          console.log('response ===>', response)
          return {
            teachers: response.teachers,
            totalPages: response.totalPages,
          }
        }
      } catch (error) {
        toast.error('Internal server error')
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createLazyFileRoute('/_authenticated/admin/teachers/')({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps }) => queryClient.ensureQueryData(teachersQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/teachers/'
  )

  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const isFirstRender = useRef(true)
  let currentPage = useSearch({
    from: '/_authenticated/admin/teachers/',
    select: (search) => search.page,
  })
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = getDebounceInput(searchInput, delay)
  const { data, fetchStatus, isFetching } = useQuery(
    teachersQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  )

  const { data: teachersStatus, fetchStatus: statusFetchStatus } = useQuery({
    queryKey: ['get-courses-status'],
    queryFn: async () => {
      try {
        let response = await axios.get(`/admin/teacher/get-teachers-status`)
        console.log('courses response ===>', response)
        response = response.data
        if (response.success) {
          return { ...response.data }
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  })
  console.log('teachersStatus ===>', teachersStatus)

  const teachers = data?.teachers
  const totalPages = data?.totalPages

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const navigate = useNavigate()
  const searchTeachers = async () => {
    console.log('searchInput ===>', searchInput)
    // await queryClient.invalidateQueries(
    //   teachersQueryOptions({ q: searchInput })
    // )
    if (searchInput !== '') {
      navigate({
        to: '/admin/teachers/',
        search: { q: debouncedSearch, page: currentPage },
      })
    } else {
      navigate({ to: '/admin/teachers/', search: { q: '', page: currentPage } })
    }
  }

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) // table update
    navigate({
      to: '/admin/teachers/',
      search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
    })
  }

  useEffect(() => {
    navigate({
      to: '/admin/teachers/',
      search: { q: debouncedSearch, page: 1 },
      replace: true,
    })
  }, [debouncedSearch, 1])

  return (
    <>
      <Header>
        <TopNav links={topNav} />
      </Header>
      <Main className='px-4 py-2'>
        <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl'>
          Teachers Management
        </h1>

        <TeachersMetrics
          fetchStatus={statusFetchStatus}
          total={teachersStatus?.total}
          active={teachersStatus?.active}
          inactive={teachersStatus?.inActive}
        />
        <Separator className='my-2 bg-[#e2e8f0]' />

        <div className='mb-2 flex justify-between'>
          <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-bold text-transparent'>
            Teachers
          </h2>
          <div className='flex items-center gap-1'>
            <Label>
              <Input
                type='text'
                className='grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] transition-all duration-300 placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                size='sm'
                placeholder='Search Teachers'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={searchTeachers}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader className='h-4 w-4 animate-spin text-[#2563eb]' />
                ) : (
                  <Search className='h-4 w-4 text-[#2563eb]' />
                )}
              </Button>
            </Label>
            <Button
              size='xs'
              onClick={() => exportToCSV(data)}
              variant='outline'
            >
              <Download className='h-4 w-4 text-[#2563eb]' />
              Export CSV
            </Button>
          </div>
        </div>
        <Suspense fallback={<DataTableSkeleton />}>
          <DataTable
            data={teachers}
            columns={teachersSchema}
            fetchStatus={fetchStatus}
            isFetching={isFetching}
            pagination={true}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handlePagination={handlePagination}
            totalPages={totalPages}
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
    icon: LayoutDashboard,
  },
  {
    title: 'Students',
    href: '/admin/students',
    isActive: false,
    disabled: false,
    icon: User2,
  },
  {
    title: 'Teachers',
    href: '/admin/teachers',
    isActive: true,
    disabled: false,
    icon: GraduationCap,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    isActive: false,
    disabled: false,
    icon: Settings,
  },
]
