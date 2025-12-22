import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
} from '@tanstack/react-query'
import { useSearch, createLazyFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import SearchInput from '../-components/SearchInput'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import {
  useDebounceInput,
  useSearchInput,
} from '@/utils/globalFunctions'
import { SmallLoader } from '../../teacher/-layout/data/components/teacher-authenticated-layout'
import { teachersSchemaStudentPanel } from '../features/tasks/-components/columns'

const DataTable = lazy(
  () => import('../features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()

const teachersQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['teacher', deps.q, deps.page, deps.courseTeachers],
    queryFn: async () => {
      try {
        console.log('deps ===>', deps)
        const pageNumber = deps.page
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(
          `/student/course/get-teachers?teacherIDs=${deps.courseTeachers}&page=${deps.page}&q=${deps.q}`
        )
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
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/student/course-teachers/'
)({
  validateSearch: (search) => {
    return {
      courseTeachers: search.courseTeachers,
      q: search.q,
      page: Number(search.page ?? 1),
    }
  },
  loaderDeps: ({ search }) => {
    return {
      courseTeachers: search.courseTeachers,
      q: search.q,
      page: search.page,
    }
  },
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(teachersQueryOptions(deps)),
  component: () => (
    <Suspense fallback={<SmallLoader />}>
      <RouteComponent />
    </Suspense>
  ),
})

function RouteComponent() {
  const { navigate } = useAppUtils()
  const isFirstRender = useRef(true)
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/student/course-teachers/'
  )
  const searchParams = useSearch({
    from: '/_authenticated/student/course-teachers/',
  })
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)
  let currentPage = useSearch({
    from: '/_authenticated/student/course-teachers/',
    select: (search) => search.page,
  })
  const { data, fetchStatus, isFetching } = useQuery({
    ...teachersQueryOptions({
      q: debouncedSearch,
      page: currentPage,
      courseTeachers: searchParams.courseTeachers,
    }),
    suspense: isFirstRender.current,
  })
  console.log('data ===>', data)
  const teachers = data?.teachers
  const totalPages = data?.totalPages
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

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
      setSearchInput(input)
      navigate({
        to: '/admin/students',
        search: { page: 1, input: debouncedSearch },
      })
    },
    [navigate, setSearchInput]
  )

  return (
    <>
      <Header className="flex items-center justify-between">
        <h1 className='w-full bg-clip-text text-xl font-extrabold tracking-tight drop-shadow-lg md:text-2xl'>
          My Teachers
        </h1>
        <SearchInput
          placeholder={'Search teachers...'}
          value={searchInput}
          onSubmit={handleSearchSubmit}
          onChange={(e) => setSearchInput(e.target.value)}
          isFetching={isFetching}
        />
      </Header>
      <Main>
        <Suspense fallback={<DataTableSkeleton />}>
          <DataTable
            data={teachers?.length ? teachers : []}
            columns={teachersSchemaStudentPanel}
            fetchStatus={fetchStatus}
            isFetching={isFetching}
            totalPages={totalPages}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handlePagination={handlePagination}
            pagination={true}
            paginationOptions={paginationOptions}
            hiddenColumnsOnMobile={['serial', 'profile', 'bio', 'createdAt', 'courses']}
          />
        </Suspense>
      </Main>
    </>
  )
}
