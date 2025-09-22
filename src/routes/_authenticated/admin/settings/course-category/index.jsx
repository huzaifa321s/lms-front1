import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch, createFileRoute } from '@tanstack/react-router'
import { IconLoader } from '@tabler/icons-react'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { openModal } from '../../../../../shared/config/reducers/admin/DialogSlice'
import { Show } from '../../../../../shared/utils/Show'
import { DataTable } from '../../../student/features/tasks/-components/student-data-table'
import ContentSection from '../../../student/settings/-components/content-section'
import { courseCategoriesSchema } from '../../layout/data/-schemas/courseCategoriesSchema'
import { getDebounceInput, useSearchInput } from '../../../../../utils/globalFunctions'

const queryClient = new QueryClient()

export const courseCategoryQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['course-cagtegory', deps.q,deps.page],
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
          return {courseCategories:response.data.courseCategories,totalPages:response.data.totalPages}
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
    return { q: search.q || '' ,page:Number(search.page ?? 1)}
  },
  loaderDeps: ({ search }) => {
    return { q: search.q ,page:search.page}
  },
  loader: ({ deps }) =>
    queryClient.ensureQueryData(courseCategoryQueryOptions(deps)),
  component: RouteComponent,
})

export function RouteComponent() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/settings/course-category/'
  )
  const isFirstRender = useRef(true)
  const debouncedSearch = getDebounceInput(searchInput,800)
  let currentPage = useSearch({
        from: '/_authenticated/admin/settings/course-category/',
        select: (search) => search.page,
      })
  const { data, fetchStatus, isFetching } = useQuery(
    courseCategoryQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page:currentPage
    })
  )
  const courseCategories = data?.courseCategories;
  const totalPages = data?.totalPages;
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
  
  

  const handlePagination = (newPageIndex) => {
  const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
  setPagination(newPagination) // table update
  navigate({
    to: '/admin/settings/course-category',
    search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
  })
}

  return (
    <ContentSection title="Course Categories">
      <div className="my-2 flex items-center justify-between">
        <Button
          size="sm"
          onClick={() =>
            dispatch(
              openModal({
                type: 'add-course-category',
                props: { searchInput },
              })
            )
          }
          className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
        >
          Add Category
        </Button>
        <Show>
          <Show.When isTrue={true}>
            <Label className="flex items-center gap-2">
              <Input
                size="sm"
                type="text"
                className="grow rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                placeholder="Search Categories"
                value={searchInput || ''}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={searchCategories}
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
      />
    </ContentSection>
  )
}
