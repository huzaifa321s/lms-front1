import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSearch, createLazyFileRoute } from '@tanstack/react-router'
import {
  Download,
  GraduationCap,
  LayoutDashboard,
  Loader,
  Search,
  Settings,
  User2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  useDebounceInput,
  useSearchInput,
  exportToCSV,
} from '@/utils/globalFunctions'
import { studentsSchema } from '../layout/data/-schemas/studentsSchema'
import StudentsMetrics from './-components/StudentsMetrics'
import SearchInput from '../../student/-components/SearchInput'

const DataTable = lazy(
  () => import('../../student/features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()

const studentsQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['student', deps.q, deps.page],
    queryFn: async () => {
      try {
        const pageNumber = deps.page
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(`/admin/student/get?${queryStr}`)
        response = response.data
        if (response.success) {
          console.log('response.data ===>', response.data)
          return {
            students: response.data.students,
            totalPages: response.data.totalPages,
          }
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createLazyFileRoute('/_authenticated/admin/students/')({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(studentsQueryOptions(deps)),
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
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)

  const { data, fetchStatus, isFetching } = useQuery({
    ...studentsQueryOptions({
      q: debouncedSearch,
      page: currentPage,
    }),
    suspense: isFirstRender.current,
  })

  const { data: studentsStatus, fetchStatus: statusFetchStatus } = useQuery({
    queryKey: ['get-students-status'],
    queryFn: async () => {
      try {
        let response = await axios.get(`/admin/student/get-students-status`)
        console.log('student response ===>', response)
        response = response.data
        if (response.success) {
          return { ...response.data }
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  })
  console.log('studentsStatus ===>', studentsStatus)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  useEffect(() => {
    navigate({
      to: '/admin/students/',
      search: { q: debouncedSearch, page: 1 },
      replace: true,
    })
  }, [debouncedSearch])

  const students = data?.students
  const totalPages = data?.totalPages

  const { navigate } = useAppUtils()


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

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const input = formData.get('search')?.toString() || ''
      setSearchInput(input) // Update state
      navigate({
        to: '/admin/students',
        search: { page: 1, q: debouncedSearch },
      })
    },
    [navigate, setSearchInput]
  )

  return (
    <>
      <Header>
        <TopNav links={topNav} />
      </Header>
      <Main className='px-4 py-2'>
        <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl'>
          Students Management
        </h1>

        <StudentsMetrics
          fetchStatus={statusFetchStatus}
          total={studentsStatus?.total}
          active={studentsStatus?.active}
          inactive={studentsStatus?.inActive}
        />
        <Separator className='my-2 bg-[#e2e8f0]' />

        <div className='mb-2 flex justify-between'>
          <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-bold text-transparent'>
            Students
          </h2>
          <SearchInput
            placeholder={'Search students...'}
            value={searchInput}
            onSubmit={handleSearchSubmit}
            onChange={(e) => setSearchInput(e.target.value)}
            isFetching={isFetching}
          />

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
            hiddenColumnsOnMobile={['serial', 'bio', 'plan', 'phone', 'profile']}

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
    isActive: true,
    disabled: false,
    icon: User2,
  },
  {
    title: 'Teachers',
    href: '/admin/teachers',
    isActive: false,
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
