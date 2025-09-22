import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate, useSearch, createLazyFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { trainingWheelGamesSchema } from '../-layout/data/schemas/trainingWheelGamesSchema'
import { Show } from '../../../../shared/utils/Show'
import {
  getDebounceInput,
  useSearchInput,
} from '../../../../utils/globalFunctions'
import { DataTable } from '../../student/features/tasks/-components/student-data-table'
import { TopNav } from "@/components/layout/top-nav"


const queryClient = new QueryClient()
export const gameQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['teacher', deps.q, deps.page],
    suspense: deps.suspense ?? true,
    queryFn: async () => {
      const pageNumber = deps.page
      const searchQuery = deps.q
      console.log('deps ===>', deps)
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
  const isFirstRender = useRef(true)
  let currentPage = useSearch({
    from: '/_authenticated/teacher/trainingwheelgame/',
    select: (search) => search.page,
  })
  const debouncedSearch = getDebounceInput(searchInput,800)
  const { data, fetchStatus, isFetching } = useQuery(
    gameQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  )

  const games = data?.games;
  const totalPages = data?.totalPages;
  const navigate = useNavigate()

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const searchQuestions = () => {
    if (searchInput !== '') {
      navigate({ to: `/teacher/trainingwheelgame`, search: { q: searchInput } })
    } else {
      navigate({ to: `/teacher/trainingwheelgame`, search: { q: `` } })
    }
  }

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

  return (
    <>
      <Header className="bg-white border-b border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
         <TopNav links={topNav} className="bg-white text-[#1e293b]" />
        <div className='my-2 flex w-full items-center justify-between max-w-7xl mx-auto px-4'>
          <div className='text-2xl font-semibold text-[#1e293b]'>Training Wheel Game</div>
          <div className='flex items-center gap-4'>
            <Button
              size='sm'
              className='rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white hover:from-[#1d4ed8] hover:to-[#1e40af] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-lg'
              onClick={() =>
                navigate({ to: '/teacher/trainingwheelgame/create' })
              }
            >
              Create Game
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-4 w-4 ml-2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 4.5v15m7.5-7.5h-15'
                />
              </svg>
            </Button>
            <Show>
              <Show.When isTrue={true}>
                <Label className="flex items-center gap-2">
                  <Input
                    type='text'
                    size='sm'
                    className='grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2'
                    placeholder='Search games...'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#475569] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:opacity-50'
                    loading={isFetching}
                    disabled={isFetching}
                    onClick={searchQuestions}
                  >
                    {!isFetching && (
                      <Search/>
                    )}
                    Search
                  </Button>
                </Label>
              </Show.When>
            </Show>
          </div>
        </div>
      </Header>
      <div className="max-w-7xl mx-auto px-4 py-8">
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
          className="rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
          headerClassName="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] text-[#1e293b] font-semibold"
          rowClassName="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#f1f5f9] text-[#64748b]"
          paginationClassName="border-t border-[#e2e8f0] bg-white text-[#64748b]"
        />
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
  },
  {
    title: 'Courses',
    href: '/teacher/courses',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Games',
    href: '/teacher/trainingwheelgame',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    isActive: false,
    disabled: false,
  },
]
