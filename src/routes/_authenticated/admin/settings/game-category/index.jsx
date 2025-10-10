import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
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
  getDebounceInput,
  useSearchInput,
} from '../../../../../utils/globalFunctions'
import ContentSection from '../../../student/settings/-components/content-section'
import { gameCategoriesSchema } from '../../layout/data/-schemas/gameCategoriesSchema'

const DataTable = lazy(
  () => import('../../../student/features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()

export const gameCategoryQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['game-category', deps.q, deps.page],
    suspense: deps.suspense ?? true,
    queryFn: async () => {
      try {
        const pageNumber = deps.page
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(`/admin/game-category/get?${queryStr}`)
        response = response.data
        console.log('response ===>', response)
        if (response.success) {
          return {
            gameCategories: response.data.gameCategories,
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
  '/_authenticated/admin/settings/game-category/'
)({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps }) =>
    queryClient.ensureQueryData(gameCategoryQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/settings/game-category/'
  )
  let currentPage = useSearch({
    from: '/_authenticated/admin/settings/game-category/',
    select: (search) => search.page,
  })
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = getDebounceInput(searchInput, delay)
  const isFirstRender = useRef(true)
  const { data, isFetching, fetchStatus } = useQuery(
    gameCategoryQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])
  const gameCategories = data?.gameCategories
  const totalPages = data?.totalPages
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const searchCategories = async () => {
    if (searchInput.trim() !== '') {
      navigate({
        to: '/admin/settings/game-category',
        search: { q: searchInput },
      })
    } else {
      navigate({ to: '/admin/settings/game-category', search: { q: '' } })
    }
    await queryClient.invalidateQueries(
      gameCategoryQueryOptions({ q: searchInput })
    )
  }
  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) // table update
    navigate({
      to: '/admin/settings/game-category',
      search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
    })
  }

  useEffect(() => {
    navigate({
      to: '/admin/settings/game-category',
      search: { q: debouncedSearch, page: 1 },
      replace: true,
    })
  }, [debouncedSearch, 1])

  return (
    <ContentSection title='Game Categories'>
      <div className='my-2 flex items-center justify-between'>
        <Button
          size='sm'
          onClick={() =>
            dispatch(
              openModalAdmin({
                type: 'add-game-category',
                props: { searchInput },
              })
            )
          }
        >
          <Plus /> Add Category
        </Button>
        <Show>
          <Show.When isTrue={true}>
            <Label className='flex items-center gap-2'>
              <Input
                type='text'
                size='sm'
                className='grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] transition-all duration-300 placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                placeholder='Search Categories'
                value={searchInput || ''}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                size='sm'
                variant='outline'
                onClick={searchCategories}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader className='h-4 w-4 animate-spin text-[#2563eb]' />
                ) : (
                  <Search className='h-4 w-4 text-[#2563eb]' />
                )}
              </Button>
            </Label>
          </Show.When>
        </Show>
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={gameCategories}
          totalPages={totalPages}
          pagination={true}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          paginationOptions={paginationOptions}
          setPagination={setPagination}
          columns={gameCategoriesSchema}
          handlePagination={handlePagination}
          fetchStatus={fetchStatus}
          isFetching={isFetching}
        />
      </Suspense>
    </ContentSection>
  )
}
