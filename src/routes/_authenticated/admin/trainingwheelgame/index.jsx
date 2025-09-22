import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
} from '@tanstack/react-query'
import { useNavigate, useSearch, createFileRoute } from '@tanstack/react-router'
import { IconLoader } from '@tabler/icons-react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Show } from '../../../../shared/utils/Show'
import { DataTable } from '../../student/features/tasks/-components/student-data-table'
import { trainingWheelGamesSchemaAdmin } from '../layout/data/-schemas/trainingWheelGameSchemas'
import { getDebounceInput, useSearchInput } from '../../../../utils/globalFunctions'

const queryClient = new QueryClient()

export const gamesQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['gameTrainingWheelGame', deps.q,deps.page],
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
        return {games:response.success ? response.data.games : [],totalPages:response.success ? response.data.totalPages : 0}
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
    return { q: search.q || '' ,page:Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q ,page:search.page}
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
  const debouncedSearch = getDebounceInput(searchInput,800)
  console.log('debouncedSearch ====>',debouncedSearch)
  const isFirstRender = useRef(true)
  const { data, fetchStatus, isFetching } = useQuery(
    gamesQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current, // true only first render
      page:currentPage
    })
  )
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, []);
  const games = data?.games;
  const totalPages = data?.totalPages;

  const searchQuestions = async () => {
    if (searchInput !== '') {
      navigate({
        to: `/admin/trainingwheelgame`,
        search: { q: debouncedSearch },
      })
    } else {
      navigate({ to: `/admin/trainingwheelgame`, search: { q: `` } })
    }
  };


  
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

  console.log('data ===>', data)
  return (
   <div className="min-h-screen bg-[#f8fafc]">
      <Header className="bg-white border-b border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="my-2 flex w-full items-center justify-between">
          <div className="text-2xl font-semibold text-[#1e293b] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
            Training Wheel Game
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              onClick={() => navigate({ to: '/admin/trainingwheelgame/create' })}
              className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Create Game
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Button>
            <Show>
              <Show.When isTrue={true}>
                <Label>
                  <Input
                    size="sm"
                    type="text"
                    className="grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={searchQuestions}
                    disabled={isFetching}
                    className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {isFetching ? (
                      <IconLoader className="h-4 w-4 animate-spin text-[#2563eb]" />
                    ) : (
                      <Search className="h-4 w-4 text-[#2563eb]" />
                    )}
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
          columns={trainingWheelGamesSchemaAdmin}
          fetchStatus={fetchStatus}
          totalPages={totalPages}
          pagination={true}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handlePagination={handlePagination}
          paginationOptions={paginationOptions}
        />
      </div>
    </div>
  )
}
