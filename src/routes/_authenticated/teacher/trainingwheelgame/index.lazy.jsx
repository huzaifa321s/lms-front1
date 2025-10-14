import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import {
  useNavigate,
  useSearch,
  createLazyFileRoute,
} from '@tanstack/react-router'
import {
  BookOpen,
  Gamepad,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { trainingWheelGamesSchema } from '../-layout/data/schemas/trainingWheelGamesSchema'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'
import { Show } from '../../../../shared/utils/Show'
import {
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import SearchInput from '../../student/-components/SearchInput'

const DataTable = lazy(
  () => import('../../student/features/tasks/-components/student-data-table')
)

const queryClient = new QueryClient()
export const gameQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['teacher', deps.q, deps.page],
    suspense: deps.suspense ?? true,
    queryFn: async () => {
      const pageNumber = deps.page
      const searchQuery = deps.q
      let queryStr = `page=${pageNumber}`
      if (searchQuery) {
        queryStr += `&q=${searchQuery}`
      }

      try {
        let response = await axios.get(
          `/teacher/game/training-wheel-game/get?${queryStr}`
        )
        response = response.data
        if (response.success) {
          console.log('response.data ===>', response.data)
          return {
            games: response.data.games,
            totalPages: response.data.totalPages,
          }
        }
      } catch (error) {
        console.log('error', error)
        return { games: [] }
      }
    },
  })

export const Route = createLazyFileRoute(
  '/_authenticated/teacher/trainingwheelgame/'
)({
  validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ params }) => queryClient.ensureQueryData(gameQueryOptions(params)),
  component: RouteComponent,
})

function RouteComponent() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/teacher/trainingwheelgame/'
  )
  console.log('searcNput', searchInput)
  const isFirstRender = useRef(true)
  let currentPage = useSearch({
    from: '/_authenticated/teacher/trainingwheelgame/',
    select: (search) => search.page,
  })
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = getDebounceInput(searchInput, delay)
  const { data, fetchStatus, isFetching } = useQuery(
    gameQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  )

  const games = data?.games
  const totalPages = data?.totalPages
  const navigate = useNavigate()

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])



  let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  console.log('isFirstRender.current ===>', isFirstRender.current)

  const handlePagination = (newPageIndex) => {
    const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
    setPagination(newPagination) // table update
    navigate({
      to: '/teacher/trainingwheelgame',
      search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
    })
  }

  useEffect(() => {
    navigate({
      to: '/teacher/trainingwheelgame',
      search: { q: debouncedSearch, page: 1 },
      replace: 1,
    })
  }, [debouncedSearch])

  // Combine input handling and navigation in one submit handler
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const input = formData.get('search')?.toString() || ''
      setSearchInput(input) // Update state
      navigate({
        to: '/teacher/trainingwheelgame',
        search: { q: debouncedSearch, page: 1 },
      })
    },
    [navigate, setSearchInput]
  )

  return (
    <>
      {/* Header */}
      <Header>
        <TopNav links={topNav} />

        {/* Header Actions */}
        <div className='ml-auto flex items-center gap-3'>
          {/* Create Button */}
          <Button
            size='sm'
            className='flex items-center gap-2 rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
            onClick={() =>
              navigate({ to: '/teacher/trainingwheelgame/create' })
            }
          >
            <Plus size={18} />
            Create Game
          </Button>
          <SearchInput
            placeholder={'Search games...'}
            value={searchInput}
            onSubmit={handleSearchSubmit}
            onChange={(e) => setSearchInput(e.target.value)}
            isFetching={isFetching}
          />
        </div>
      </Header>

      {/* Page Wrapper */}
      <div className='relative min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] px-6 pt-10 pb-32'>
        {/* Title Section */}
        <div className='relative z-10 mb-8 flex items-center justify-between'>
          <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
            Training Wheel Game
          </h2>
          <p className='text-sm text-[#64748b]'>
            Showing {games?.length || 0} games
          </p>
        </div>

        {/* Data Table */}
        <div className='relative z-10'>
          <Suspense fallback={<DataTableSkeleton />}>
            <DataTable
              data={games}
              columns={trainingWheelGamesSchema}
              fetchStatus={fetchStatus}
              totalPages={totalPages}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              pagination={true}
              paginationOptions={paginationOptions}
              setPagination={setPagination}
              handlePagination={handlePagination}
              hiddenColumnsOnMobile={['serial', 'category.name','difficulties']}

            />
          </Suspense>
        </div>
      </div>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/teacher/',
    isActive: false,
    disabled: false,
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    href: '/teacher/courses',
    isActive: false,
    disabled: false,
    icon: BookOpen,
  },
  {
    title: 'Games',
    href: '/teacher/trainingwheelgame',
    isActive: true,
    disabled: false,
    icon: Gamepad,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    isActive: false,
    disabled: false,
    icon: Settings,
  },
]
