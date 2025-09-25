import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { columns } from "./topCoursesColumns"
import { useNavigate } from "@tanstack/react-router"

export function TopCourses({ data }) {
  const [state, setState] = useState({
    rowSelection: {},
    columnVisibility: {},
    columnFilters: [],
    sorting: [],
  })


  const navigate = useNavigate(({to:"/admin/courses"}))
  const table = useReactTable({
    data,
    columns,
    state,
    onRowSelectionChange: (rowSelection) => setState((s) => ({ ...s, rowSelection })),
    onSortingChange: (sorting) => setState((s) => ({ ...s, sorting })),
    onColumnFiltersChange: (columnFilters) => setState((s) => ({ ...s, columnFilters })),
    onColumnVisibilityChange: (columnVisibility) => setState((s) => ({ ...s, columnVisibility })),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
  })

  return (
  <div className="space-y-6 p-4 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-[12px] shadow-[0_6px_16px_rgba(0,0,0,0.3)]">
      {/* Working On It Message */}
      <div className="flex items-center justify-center py-3 px-4 bg-[#2563eb]/20 border border-[#2563eb]/50 rounded-[8px] text-[#bfdbfe] text-sm font-medium shadow-sm">
        <span className="flex items-center gap-2">
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#bfdbfe"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="#bfdbfe"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          We are working on it!
        </span>
      </div>

      {/* Table */}
      <div className="relative rounded-[12px] bg-white/95 backdrop-blur-sm border border-[#475569] shadow-[0_6px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden">
        <Table>
          <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-[#e2e8f0]">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    colSpan={header.colSpan}
                    className="text-[#1e293b] font-semibold text-sm bg-[#f1f5f9]"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
          {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-all duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="text-[#1e293b] text-sm"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-[#64748b] text-sm"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate({to:"/admin/courses"})}
        className="rounded-[8px] border-[#2563eb] bg-[#2563eb]/10 text-[#bfdbfe] hover:bg-[#2563eb]/20 hover:border-[#1d4ed8] hover:text-[#e2e8f0] font-semibold focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
      >
        View All Courses
      </Button>
    </div>
  )
}
