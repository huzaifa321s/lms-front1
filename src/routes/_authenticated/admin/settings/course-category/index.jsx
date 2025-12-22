import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch, createFileRoute } from '@tanstack/react-router'
import { Loader, Plus, Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTableSkeleton } from '../../../../-components/DataTableSkeleton'
import { openModalAdmin } from '../../../../../shared/config/reducers/admin/DialogSlice'
import { Show } from '../../../../../shared/utils/Show'
import {
  useDebounceInput,
  useSearchInput,
} from '@/utils/globalFunctions'
import SearchInput from '../../../student/-components/SearchInput'
import ContentSection from '../../../student/settings/-components/content-section'
import { courseCategoriesSchema } from '../../layout/data/-schemas/courseCategoriesSchema'

const DataTable = lazy(
  () => import('../../../student/features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()

export const courseCategoryQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['course-cagtegory', deps.q, deps.page],
    suspense: deps.suspense ?? true,
    queryFn: async () => {
      try {
        const pageNumber = deps.page
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(`/admin/course-category/get?${queryStr}`)
        response = response.data
        console.log('response ===>', response)
        if (response.success) {
          return {
            courseCategories: response.data.courseCategories,
            totalPages: response.data.totalPages,
          }
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/admin/settings/course-category/'
)({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(courseCategoryQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/settings/course-category/'
  )
  const isFirstRender = useRef(true)
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)
  let currentPage = useSearch({
    from: '/_authenticated/admin/settings/course-category/',
    select: (search) => search.page,
  })
  const { data, fetchStatus, isFetching } = useQuery(
    courseCategoryQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  )
  const courseCategories = data?.courseCategories
  const totalPages = data?.totalPages
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const searchCategories = async () => {
    if (searchInput.trim() !== '') {
      navigate({
        to: '/admin/settings/course-category',
        search: { q: searchInput },
      })
    } else {
      navigate({ to: '/admin/settings/course-category', search: { q: '' } })
    }

    // await queryClient.invalidateQueries(courseCategoryQueryOptions({q:searchInput}));
  }
  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    navigate({
      to: '/admin/settings/course-category',
      search: { q: debouncedSearch, page: 1 },
      replace: true,
    })
  }, [debouncedSearch, 1])

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination)
    navigate({
      to: '/admin/settings/course-category',
      search: { q: debouncedSearch, page: newPageIndex + 1 },
    })
  }

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const input = formData.get('search')?.toString() || ''
      setSearchInput(input) // Update state
      navigate({
        to: `/student/enrolledcourses`,
        search: { page: 1, input: debouncedSearch },
      })
    },
    [navigate, setSearchInput]
  )
  return (
    <ContentSection title='Course Categories'>
      <div className='my-2 flex items-center justify-between'>
        <Button
          size='sm'
          onClick={() =>
            dispatch(
              openModalAdmin({
                type: 'add-course-category',
                props: { searchInput },
              })
            )
          }
        >
          <Plus /> Add Category
        </Button>
        <SearchInput
          placeholder={'Search categories...'}
          value={searchInput}
          onSubmit={handleSearchSubmit}
          onChange={(e) => setSearchInput(e.target.value)}
          isFetching={isFetching}
        />
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={courseCategories}
          totalPages={totalPages}
          pagination={true}
          searchInput={searchInput}
          paginationOptions={paginationOptions}
          setPagination={setPagination}
          columns={courseCategoriesSchema}
          handlePagination={handlePagination}
          fetchStatus={fetchStatus}
          isFetching={isFetching}
          hiddenColumnsOnMobile={['serial']}
        />
      </Suspense>
    </ContentSection>
  )
}
