import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  createFileRoute,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { IconLoader } from '@tabler/icons-react'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { addTitle } from '../../../../shared/config/reducers/animateBgSlice'
import { Show } from '../../../../shared/utils/Show'
import {
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import { teachersSchemaStudentPanel } from '../../student/features/tasks/-components/columns'
import { DataTable } from '../../student/features/tasks/-components/student-data-table'

const queryClient = new QueryClient()

const teachersQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['teacher', deps.q, deps.page, deps.courseTeachers],
    queryFn: async () => {
      try {
        console.log('deps ===>', deps)
        const pageNumber = deps.page
        const searchQuery = deps.q
        console.log('deps.q ===>', deps.q)
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        console.log('queryStr ===>', queryStr)
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

export const Route = createFileRoute(
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
  loader: ({ deps }) => queryClient.ensureQueryData(teachersQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const { router, navigate } = useAppUtils()
  const queryClient = useQueryClient()
  const isFirstRender = useRef(true)
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/student/course-teachers/'
  )
  const searchParams = useSearch({
    from: '/_authenticated/student/course-teachers/',
  })
  console.log('searchParams ===>', searchParams)
  const debouncedSearch = getDebounceInput(searchInput, 800)
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

  const searchTeachers = async () => {
    console.log('searchInput ===>', searchInput)
    await queryClient.invalidateQueries(
      teachersQueryOptions({ q: searchInput })
    )
    if (searchInput !== '') {
      navigate({ to: '/student/course-teachers/', search: { q: searchInput } })
    } else {
      navigate({ to: '/student/course-teachers/', search: { q: '' } })
    }
    router.invalidate()
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
      <Header>
    <h1 className='bg-gradient-to-r w-full from-[#2563eb] via-[#1e40af] to-[#1d4ed8] bg-clip-text text-xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-2xl'>
  My Teachers
</h1>
        <div className='my-2 flex w-full justify-between'>
          <div className='ml-auto'>
            <Show>
              <Show.When isTrue={true}>
                <Label>
                  <Input
                    type='text'
                    className='grow'
                    size='sm'
                    placeholder='Search Teachers'
                    value={searchInput || ''}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={searchTeachers}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <IconLoader className='animate animate-spin' />
                    ) : (
                      <Search />
                    )}
                  </Button>
                </Label>
              </Show.When>
            </Show>
          </div>
        </div>
      </Header>
      <Main>
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
        />
      </Main>
    </>
  )
}
