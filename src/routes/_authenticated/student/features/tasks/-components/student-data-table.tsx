import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { useDispatch } from 'react-redux'
import { openModalAdmin } from '../../../../../../shared/config/reducers/admin/DialogSlice.js'

const NoDataSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-12 w-12 text-[#2563eb]"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  fetchStatus: string
  searchInput: string
  pagination: boolean
  setSearchInput: (value: string) => void
  totalPages: number
  setPagination: (value: any) => void
  handlePagination: (page: number) => void
  paginationOptions: any
}

 function DataTable<TData, TValue>({
  columns,
  data,
  fetchStatus,
  searchInput,
  pagination,
  setSearchInput,
  totalPages,
  setPagination,
  handlePagination,
  paginationOptions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const dispatch = useDispatch()

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages || 1,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter: searchInput,
      columnFilters,
      pagination: paginationOptions,
    },
    enableRowSelection: true,
    onGlobalFilterChange: setSearchInput,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: pagination,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:border-[#cbd5e1] transition-all duration-300">
        {fetchStatus === 'fetching' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#ffffff]/60">
            <div className="flex items-center gap-3 rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] px-4 py-2 shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
              <span className="text-sm font-medium text-[#2563eb]">
                Loading data...
              </span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-[#f1f5f9]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-[#e2e8f0]"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-3 md:p-4 lg:px-6 text-left text-xs md:text-sm font-semibold text-[#1e293b]"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="divide-y divide-[#e2e8f0]">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onMouseOver={() =>
                      dispatch(
                        openModalAdmin({
                          isOpen: false,
                          props: { searchInput: searchInput && searchInput },
                        }),
                      )
                    }
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-[#2563eb]/5 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) =>
                      fetchStatus === 'fetching' ? (
                        <TableCell
                          key={cell.id}
                          className="p-3 md:p-4 lg:px-6 h-16"
                        >
                          <Skeleton className="h-8 w-full rounded-[8px] bg-[#e2e8f0] animate-pulse" />
                        </TableCell>
                      ) : (
                        <TableCell
                          key={cell.id}
                          className="p-3 md:p-4 lg:px-6 text-xs md:text-sm text-[#64748b]"
                        >
                          <div className="flex items-center min-h-[2rem]">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      <div className="p-4 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
                        <NoDataSvg />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-[#2563eb]">
                          No results found
                        </p>
                        <p className="text-sm text-[#64748b]">
                          Try adjusting your search or filter criteria.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-4 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:border-[#cbd5e1] transition-all duration-300">
          <DataTablePagination
            table={table}
            handlePagination={handlePagination}
            totalPages={totalPages}
            paginationOptions={paginationOptions}
          />
        </div>
      )}
    </div>
  )
}

export default DataTable