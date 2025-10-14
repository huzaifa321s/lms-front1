import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useQuery, queryOptions, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch, createFileRoute } from '@tanstack/react-router'
import { BookOpen, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Show } from '../../../shared/utils/Show'
import {
  getDebounceInput,
  getRenderPaginationButtons,
  useSearchInput,
} from '../../../utils/globalFunctions'
import Pagination from '../../_authenticated/student/-components/Pagination'

const BLOG_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fit=crop&w=600&q=80'

// Query options for fetching blogs
export const blogsQueryOptions = ({ q, page }) =>
  queryOptions({
    queryKey: ['blogs', q, page],
    queryFn: async () => {
      let queryStr = `page=${page}`
      if (q) queryStr += `&q=${q}`

      const response = await axios.get(`/web/blog/get?${queryStr}`)
      if (response.data.success) return response.data.data
      throw new Error(response.data.message || 'Failed to fetch blogs')
    },
    placeholderData: (prev) => prev,
  })

const BlogsPageSkeleton = () => (
  <div className='min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6'>
    <div className='mx-auto max-w-7xl'>
      <div className='mb-8 animate-pulse'>
        <div className='h-8 w-48 rounded-lg bg-slate-200'></div>
        <div className='mt-2 h-4 w-96 rounded-lg bg-slate-200'></div>
      </div>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className='animate-pulse rounded-xl bg-white p-4 shadow-lg'
          >
            <div className='h-44 w-full rounded-t-xl bg-slate-200'></div>
            <div className='mt-4 space-y-2'>
              <div className='h-6 w-3/4 rounded bg-slate-200'></div>
              <div className='h-4 w-full rounded bg-slate-200'></div>
              <div className='h-4 w-1/2 rounded bg-slate-200'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

function RouteComponent() {
  const navigate = useNavigate()
  const { q, page: currentPage } = useSearch({ from: '/student/blogs/' })
  const [searchInput, setSearchInput] = useSearchInput('/student/blogs/')
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = getDebounceInput(searchInput, delay)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    ...blogsQueryOptions({ q: debouncedSearch, page: currentPage }),
    suspense: true,
  })

  const { blogs = [], totalPages = 1 } = data || {}

  const handleNavigation = useCallback(
    ({ page = currentPage, query = searchInput } = {}) => {
      navigate({
        to: '/student/blogs',
        search: { page, q: query || undefined },
      })
    },
    [navigate, currentPage, searchInput]
  )

  const handlePageChange = async (page) => {
    if (searchInput !== '') {
      navigate({
        to: `/student/blogs`,
        search: { page: page, input: searchInput },
      })
    } else {
      navigate({
        to: `/student/blogs`,
        search: { page: page, input: `` },
      })
    }
    await queryClient.invalidateQueries(
      blogsQueryOptions({ q: debouncedSearch, page: currentPage + 1 })
    )
  }

  // Prefetch next page
  useEffect(() => {
    if (currentPage < (data?.totalPages || 1)) {
      queryClient.prefetchQuery(
        blogsQueryOptions({ q: debouncedSearch, page: currentPage + 1 })
      )
    }
  }, [currentPage, debouncedSearch, data?.totalPages])
  const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/blog-images/`
  const paginationButtons = useMemo(
    () => getRenderPaginationButtons(currentPage, totalPages, handlePageChange),
    [currentPage, totalPages]
  )
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6 font-sans'>
      <div className='relative mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='space-y-2'>
            <h1 className='bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
              Latest Blogs
            </h1>
            <p className='text-lg text-slate-600'>
              Explore articles and insights to enhance your learning journey
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative w-full max-w-sm'>
              <Input
                type='text'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNavigation()}
                placeholder='Search blogs...'
                className='w-full rounded-lg border-slate-200 bg-white py-2.5 pr-10 pl-10 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                aria-label='Search blogs'
              />
              <Button
                onClick={() => handleNavigation()}
                variant='outline'
                aria-label='Search'
              >
                <Search />
              </Button>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        <Show>
          <Show.When isTrue={blogs.length > 0 && !isLoading}>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl'
                  role='article'
                  aria-label={`Blog: ${blog.title}`}
                >
                  <div className='relative h-44 overflow-hidden'>
                    <img
                      src={
                        `${defaultCover}${blog.image}` || BLOG_PLACEHOLDER_IMAGE
                      }
                      alt={blog.title}
                      className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent' />
                  </div>

                  <div className='space-y-3 p-5'>
                    <h3 className='line-clamp-2 text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-600'>
                      {blog.title}
                    </h3>
                    <p className='line-clamp-3 text-sm text-slate-600'>
                      {blog.description}
                    </p>

                    <div className='mt-2 flex items-center gap-2 text-xs text-slate-500'>
                      <Users className='h-3 w-3' />
                      <span>{blog.views || 0} views</span>
                    </div>

                    <Button
                      variant='outline'
                      onClick={() =>
                        navigate({
                          to: `/student/blogs/blog-details/${blog._id}`,
                        })
                      }
                      aria-label={`Read more: ${blog.title}`}
                    >
                      Read More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Show.When>

          <Show.When isTrue={!isLoading && blogs.length === 0}>
            <div className='py-16 text-center'>
              <div className='mx-auto w-fit rounded-full bg-slate-100 p-6 shadow-inner'>
                <BookOpen className='h-16 w-16 text-slate-300' />
              </div>
              <h3 className='mt-6 text-2xl font-bold text-slate-800'>
                No blogs found!
              </h3>
              <p className='mx-auto mt-2 max-w-md text-lg text-slate-600'>
                Try adjusting your search or explore new categories.
              </p>
            </div>
          </Show.When>
        </Show>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleNavigation}
          paginationButtons={paginationButtons}
        />
      </div>
    </div>
  )
}

// Route definition
export const Route = createFileRoute('/student/blogs/')({
  component: () => (
    <Suspense fallback={<BlogsPageSkeleton />}>
      <RouteComponent />
    </Suspense>
  ),
})

export default RouteComponent
