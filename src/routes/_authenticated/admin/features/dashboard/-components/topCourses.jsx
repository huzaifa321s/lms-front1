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
  <div className="space-y-6 rounded-[12px] ">


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
      >
        View All Courses
      </Button>
    </div>
  )
}
