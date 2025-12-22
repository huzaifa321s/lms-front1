import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Loader, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTableSkeleton } from '../../../../-components/DataTableSkeleton.jsx'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { openModalAdmin } from '../../../../../shared/config/reducers/admin/DialogSlice'
import { Show } from '../../../../../shared/utils/Show'
import {
  useDebounceInput,
  useSearchInput,
} from '@/utils/globalFunctions'
import SearchInput from '../../../student/-components/SearchInput.jsx'
import ContentSection from '../../../student/settings/-components/content-section'
import { blogCategoriesSchema } from '../../layout/data/-schemas/blogCategoriesSchema'
import { blogCategoryQueryOptions } from '../index.jsx'

const DataTable = lazy(
  () => import('../../../student/features/tasks/-components/student-data-table')
)

export function SettingsBlogCategory() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/settings/'
  )
  let currentPage = useSearch({
    from: '/_authenticated/admin/settings/',
    select: (search) => search.page,
  })
  const delay = searchInput.length < 3 ? 400 : 800
  const debouncedSearch = useDebounceInput(searchInput, delay)
  const isFirstRender = useRef(true)
  const { data, fetchStatus, isFetching } = useQuery(
    blogCategoryQueryOptions({
      q: debouncedSearch,
      suspense: isFirstRender.current,
      page: currentPage,
    })
  )
  const blogCategories =
    data?.blogCategories?.length > 0 ? data?.blogCategories : []
  const totalPages = data?.totalPages
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  const { navigate, dispatch } = useAppUtils()
  const queryClient = useQueryClient()

  const searchCategories = async () => {
    if (searchInput.trim() !== '') {
      navigate({ to: '/admin/settings', search: { q: searchInput } })
    } else {
      navigate({ to: '/admin/settings', search: { q: '' } })
    }
    await queryClient.invalidateQueries(
      blogCategoryQueryOptions({ q: searchInput })
    )
  }

  useEffect(() => {
    navigate({
      to: '/admin/settings',
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
      to: '/admin/settings',
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
        to: '/admin/settings',
        search: { page: 1, q: debouncedSearch },
      })
    },
    [navigate, setSearchInput]
  )
  return (
    <>
      <ContentSection title='Blog Categories' className='bg-[#f8fafc]'>
        <div className='my-2 flex items-center justify-between'>
          <Button
            size='sm'
            onClick={() =>
              dispatch(
                openModalAdmin({
                  type: 'add-blog-category-modal',
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
            data={blogCategories}
            columns={blogCategoriesSchema}
            fetchStatus={fetchStatus}
            pagination={true}
            totalPages={totalPages}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            paginationOptions={paginationOptions}
            setPagination={setPagination}
            handlePagination={handlePagination}
            hiddenColumnsOnMobile={['serial']}

          />
        </Suspense>
      </ContentSection>
    </>
  )
}
