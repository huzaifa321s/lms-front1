import { lazy, useEffect, useRef, useState ,Suspense} from 'react'
import axios from 'axios'
import {
  queryOptions,
  useQuery,
} from '@tanstack/react-query'
import {
  createLazyFileRoute,
  useSearch,
} from '@tanstack/react-router'
import { Loader, PlusIcon, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Show } from '../../../../shared/utils/Show'
const DataTable = lazy(() => import("../../student/features/tasks/-components/student-data-table"))

import { blogsSchema } from '../layout/data/-schemas/blogsSchema'
import { useAppUtils } from '../../../../hooks/useAppUtils'
import { queryClient } from '../../../../utils/globalVars'
import { getDebounceInput, useSearchInput } from '../../../../utils/globalFunctions'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'


export const blogsQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['blog', deps.q,deps.page],
    queryFn: async () => {
      try {
        const pageNumber = deps.page
        const searchQuery = deps.q

        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        console.log('searchQuery ===>', searchQuery)
        let response = await axios.get(`/admin/blog/get?${queryStr}`)
        response = response.data
        console.log('respnse 23',response)
        if (response.success) {
          
          return {blogs:response.data.blogs,totalPages:response.data.totalPages}
        }
      } catch (error) {
        console.log('error', error)
        return {blogs:[],totalPages:0}
      }
    },
  })

export const Route = createLazyFileRoute('/_authenticated/admin/blogs/')({
    validateSearch: (search) => {
    return { q: search.q || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q, page: search.page }
  },
  loader: ({ deps }) => queryClient.ensureQueryData(blogsQueryOptions(deps)),
  component: RouteComponent,
})

function RouteComponent() {
  const {navigate} = useAppUtils()
  const isFirstRender = useRef(true);
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/blogs/'
  )
    let currentPage = useSearch({
      from: '/_authenticated/admin/blogs/',
      select: (search) => search.page,
    })
const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = getDebounceInput(searchInput, delay)
  
    let [paginationOptions, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  
  const { data, fetchStatus, isFetching } = useQuery(
    blogsQueryOptions({ q: debouncedSearch, suspense: isFirstRender.current ,page:currentPage})
  )
  console.log('data 22 ===>',data)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const blogs = data?.blogs;
  const totalPages = data?.totalPages;

  const searchBlogs = async () => {
    // await queryClient.invalidateQueries(blogsQueryOptions({ q: searchInput }))
    if (searchInput !== '') {
      navigate({
        to: `/admin/blogs`,
        search: { q: searchInput },
      })
    } else {
      navigate({
        to: `/admin/blogs`,
        search: { q: '' },
      })
    }
  }

  const handlePagination = (newPageIndex) => {
  const newPagination = { ...paginationOptions, pageIndex: newPageIndex }
  setPagination(newPagination) // table update
  navigate({
    to: '/admin/blogs',
    search: { q: searchInput, page: newPageIndex + 1 }, // URL 1-based
  })
}
    useEffect(() => {
      navigate({
        to: '/admin/blogs',
        search: { q: debouncedSearch, page:1 },
        replace: true
      })
    }, [debouncedSearch,1])
  return (
    <>
      <Header >
        <div className='my-2 flex w-full justify-between'>
          <div className='text-2xl font-semibold'>Blogs</div>
          <div className='flex items-center gap-4'>
            <Button
              size='sm'
              className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => navigate({ to: '/admin/blogs/create' })}
            >
              Create Blog
              <PlusIcon/>
            </Button>
            <Show>
              <Show.When isTrue={true}>
                 <Label>
                               <Input
                                 size='sm'
                                 type='text'
                                 placeholder='Search Blogs'
                                 value={searchInput}
                                 onChange={(e) => setSearchInput(e.target.value)}
                               />
                    
                                    <Button
                                 variant='outline'
                                 size='sm'
                                 onClick={searchBlogs}
                                 disabled={isFetching}
                                 >
                                 {isFetching ? (
                                   <Loader className='animate animate-spin' />
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
          <Suspense fallback={<DataTableSkeleton />}>
        <DataTable
          data={blogs?.length > 0 ? blogs : []}
          columns={blogsSchema}
          fetchStatus={fetchStatus}
          totalPages={totalPages}
          pagination={true}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          paginationOptions={paginationOptions}
          setPagination={setPagination}
          handlePagination={handlePagination}
        />
        </Suspense>
      </Main>
    </>
  )
}