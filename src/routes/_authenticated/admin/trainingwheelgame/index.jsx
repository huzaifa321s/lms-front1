import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch, createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'
import {
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import SearchInput from '../../student/-components/SearchInput'
import { trainingWheelGamesSchemaAdmin } from '../layout/data/-schemas/trainingWheelGameSchemas'

const DataTable = lazy(
  () => import('../../student/features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()

export const gamesQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['gameTrainingWheelGame', deps.q, deps.page],
    suspense: deps.suspense ?? true, // default to true only if not set
    queryFn: async () => {
      const pageNumber = deps.page
      const searchQuery = deps.q

      let queryStr = `page=${pageNumber}`
      if (searchQuery) {
        queryStr += `&q=${searchQuery}`
      }

      try {
        let response = await axios.get(
          `/admin/game/training-wheel-game/get?${queryStr}`
        )
        response = response.data
        console.log('response ===>', response)
        return {
          games: response.success ? response.data.games : [],
          totalPages: response.success ? response.data.totalPages : 0,
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/admin/trainingwheelgame/'
)({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps }) => queryClient.ensureQueryData(gamesQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/trainingwheelgame/'
  )
  let currentPage = useSearch({
    from: '/_authenticated/admin/trainingwheelgame/',
    select: (search) => search.page,
  })
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = getDebounceInput(searchInput, delay)
  const isFirstRender = useRef(true)
  const { data, fetchStatus, isFetching } = useQuery(
    gamesQueryOptions({
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
  const games = data?.games
  const totalPages = data?.totalPages

  useEffect(() => {
    navigate({
      to: `/admin/trainingwheelgame`,
      search: { q: debouncedSearch, page: 1 },
      replace: true,
    })
  }, [debouncedSearch, 1])

  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) // table update
    navigate({
      to: '/admin/trainingwheelgame',
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
        to: '/admin/trainingwheelgame',
        search: { page: 1, q: debouncedSearch },
      })
    },
    [navigate, setSearchInput]
  )

  return (
    <>
      <Header>
        <div className='my-2 flex w-full items-center justify-between'>
          <div className='bg-clip-text text-2xl font-semibold text-transparent text-white'>
            Training Wheel Game
          </div>
          <div className='flex items-center gap-4'>
            <Button
              size='sm'
              onClick={() =>
                navigate({ to: '/admin/trainingwheelgame/create' })
              }
              className='rounded-[8px] bg-[#2563eb] text-white shadow-sm transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
            >
              Create Game
              <Plus />
            </Button>
            <SearchInput
              placeholder={'Search games...'}
              value={searchInput}
              onSubmit={handleSearchSubmit}
              onChange={(e) => setSearchInput(e.target.value)}
              isFetching={isFetching}
            />
          </div>
        </div>
      </Header>
      <div className='min-h-screen bg-[#f8fafc]'>
        <div className='px-4 py-8'>
          <Suspense fallback={<DataTableSkeleton />}>
            <DataTable
              data={games}
              columns={trainingWheelGamesSchemaAdmin}
              fetchStatus={fetchStatus}
              totalPages={totalPages}
              pagination={true}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handlePagination={handlePagination}
              paginationOptions={paginationOptions}
              hiddenColumnsOnMobile={['serial', 'difficulties']}

            />
          </Suspense>
        </div>
      </div>
    </>
  )
}
