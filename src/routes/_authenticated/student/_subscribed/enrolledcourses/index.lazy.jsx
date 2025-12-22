import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSearch, createLazyFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  LayoutDashboard,
  Puzzle,
  Search,
  Settings,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import Pagination from '../../-components/Pagination'
import SearchInput from '../../-components/SearchInput'
import { useAppUtils } from '@/hooks/useAppUtils'
import { Show } from '@/shared/utils/Show'
import {
  useDebounceInput,
  getRenderPaginationButtons,
  useSearchInput,
  getFileUrl,
} from '@/utils/globalFunctions'
import { SmallLoader } from '../../../teacher/-layout/data/components/teacher-authenticated-layout'
import { CardDemo } from './-components/_Course_Card'



const queryClient = new QueryClient()
const coursesQueryOptions = (deps) =>
  queryOptions({
    queryKey: ['course', deps.page, deps.input],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/student/course/enrolled-courses/get?page=${deps.page}&q=${deps.input}`
        )
        response = response.data
        if (response.success) {
          console.log('response.data ===>', response.data)
          const { courses, totalPages } = response.data
          return { courses: courses, pages: totalPages }
        }
      } catch (error) {
        console.log('error', error)
        return { courses: [], pages: 0 }
      }
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })

export const Route = createLazyFileRoute(
  '/_authenticated/student/_subscribed/enrolledcourses/'
)({
  component: () => (
    <Suspense fallback={<SmallLoader />}>
      <RouteComponent />
    </Suspense>
  ),
  validateSearch: (search) => {
    return { input: search.input || '', page: Number(search.page ?? 1) }
  },
  loaderDeps: ({ search }) => {
    return { input: search.input, page: search.page }
  },
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(coursesQueryOptions(deps)),
})

function RouteComponent() {
  const { navigate } = useAppUtils()
  const isFirstRender = useRef(true)

  const searchParams = useSearch({
    from: '/_authenticated/student/_subscribed/enrolledcourses/',
  })
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/student/_subscribed/enrolledcourses/'
  )
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)
  const { data, fetchStatus, isFetching } = useQuery({
    ...coursesQueryOptions({ input: debouncedSearch, page: searchParams.page }),
    suspense: isFirstRender.current,
    placeholderData: (prev) => prev,
  })
  const courses = data?.courses
  const pages = data?.pages

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  useEffect(() => {
    navigate({
      to: '/student/enrolledcourses',
      search: { input: debouncedSearch, page: 1 },
      replace: true,
    })
  }, [debouncedSearch])

  const queryClient = useQueryClient()

  const handlePageChange = async (page) => {
    if (searchInput !== '') {
      navigate({
        to: `/student/enrolledcourses`,
        search: { page: page, input: searchInput },
      })
    } else {
      navigate({
        to: `/student/enrolledcourses`,
        search: { page: page, input: `` },
      })
    }
    await queryClient.invalidateQueries(
      coursesQueryOptions({ input: searchInput, page })
    )
  }

  const queryPage = useSearch({
    select: (search) => search.page,
  })
  const paginationButtons = useMemo(
    () => getRenderPaginationButtons(queryPage, pages, handlePageChange),
    [queryPage, pages]
  )

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
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto w-fit'>
          <SearchInput
            placeholder={'Search courses...'}
            value={searchInput}
            onSubmit={handleSearchSubmit}
            onChange={(e) => setSearchInput(e.target.value)}
            isFetching={isFetching}
          />
        </div>
      </Header>
      <h1 className='mx-2 my-2 bg-clip-text text-2xl font-extrabold tracking-tight drop-shadow-lg md:text-3xl'>
        Enrolled Courses
      </h1>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='p-6'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            <Show>
              <Show.When isTrue={courses && courses.length > 0}>
                {courses.map((course, index) => {
                  console.log('course', course)
                  return (
                    <CardDemo
                      key={course._id || index}
                      courseId={course._id}
                      fetchStatus={fetchStatus}
                      title={course.name}
                      desc={course.description}
                      image={getFileUrl(course.coverImage, 'public/courses/cover-images')}
                      material={course.material.length}
                      instructor={course.instructor}
                      enrollmentDate={course.updatedAt}
                      materials={course.material}
                    />
                  )
                })}
              </Show.When>
              <Show.Else>
                <div className='col-span-full flex flex-col items-center justify-center py-12'>
                  <div className='mb-2 text-lg text-slate-400'>
                    No courses found!
                  </div>
                  {searchInput?.trim() !== '' && (
                    <p className='text-sm text-slate-500'>
                      Try adjusting your search criteria
                    </p>
                  )}
                </div>
              </Show.Else>
            </Show>
          </div>
        </div>

        <div className='fixed bottom-20 left-1/2 -translate-x-1/2 transform'>
          <Pagination
            currentPage={queryPage}
            totalPages={pages}
            onPageChange={handlePageChange}
            paginationButtons={paginationButtons}
          />
        </div>
      </div>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/student',
    isActive: false,
    disabled: false,
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    href: '/student/enrolledcourses',
    isActive: true,
    disabled: false,
    icon: BookOpen,
  },
  {
    title: 'Quizzes (Dummy)',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
    icon: Puzzle,
  },
  {
    title: 'Settings',
    href: '/student/settings',
    isActive: false,
    disabled: false,
    icon: Settings,
  },
]
