import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Loader, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { openModalAdmin } from '../../../../../shared/config/reducers/admin/DialogSlice'
import { Show } from '../../../../../shared/utils/Show'
const DataTable = lazy(() => import("../../../student/features/tasks/-components/student-data-table"))

import ContentSection from '../../../student/settings/-components/content-section'
import { blogCategoriesSchema } from '../../layout/data/-schemas/blogCategoriesSchema'
import { blogCategoryQueryOptions } from '../index.jsx'
import { getDebounceInput, useSearchInput } from '../../../../../utils/globalFunctions'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { useSearch } from '@tanstack/react-router'
import { DataTableSkeleton } from '../../../../-components/DataTableSkeleton.jsx'

export function SettingsBlogCategory() {
  const [searchInput, setSearchInput] = useSearchInput(
    '/_authenticated/admin/settings/'
  )
    let currentPage = useSearch({
        from: '/_authenticated/admin/settings/',
        select: (search) => search.page,
      })
  const debouncedSearch = getDebounceInput(searchInput,800)
  const isFirstRender = useRef(true);
  const { data, fetchStatus, isFetching } = useQuery(
    blogCategoryQueryOptions({ q: debouncedSearch ,suspense:isFirstRender.current,page:currentPage})
  )
const blogCategories = data?.blogCategories?.length > 0 ? data?.blogCategories : [];
const totalPages = data?.totalPages;
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, []);


  const {navigate,dispatch} = useAppUtils()
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
  
  

  return (
   <> 
  <ContentSection title="Blog Categories" className="bg-[#f8fafc]">
    <div className="my-2 flex items-center justify-between">
      <Button
        size="sm"
        onClick={() =>
          dispatch(
            openModalAdmin({
              type: 'add-blog-category-modal',
              props: { searchInput },
            })
          )
        }
        className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
      >
      <Plus/>  Add Category
      </Button>
      <Show>
        <Show.When isTrue={true}>
          <Label>
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
              className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300 ml-2"
            >
              {isFetching ? (
                <Loader className="h-4 w-4 animate-spin text-[#2563eb]" />
              ) : (
                <Search className="h-4 w-4 text-[#2563eb]" />
              )}
            </Button>
          </Label>
        </Show.When>
      </Show>
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
    />
      </Suspense>
  </ContentSection>
</>
  )
}
