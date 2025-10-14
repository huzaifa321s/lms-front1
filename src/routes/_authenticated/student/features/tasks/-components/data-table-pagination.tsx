import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import {
  Separator
} from "@/components/ui/separator"
interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
  handlePagination,
  totalPages,
  paginationOptions
}: DataTablePaginationProps<TData>) {

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-border bg-muted/30 rounded-b-lg">
      <div className="flex flex-1 items-center justify-between flex-wrap gap-4">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium text-muted-foreground sm:block">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[80px] border-border text-sm">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" disabled>
              {/* {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Page{" "}
            <span className="text-foreground font-semibold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-semibold">
              {table.getPageCount()}
            </span>
          </div>

          <Separator orientation="vertical" className="h-5 bg-border" />

          {/* Pagination Buttons */}
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePagination(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 w-8 border-border bg-background hover:bg-muted/50"
                  >
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">First page</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePagination(paginationOptions.pageIndex - 1)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 w-8 border-border bg-background hover:bg-muted/50"
                  >
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Previous</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePagination(paginationOptions.pageIndex + 1)}
                    disabled={!table.getCanNextPage()}
                    className="h-8 w-8 border-border bg-background hover:bg-muted/50"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Next</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePagination(totalPages - 1)}
                    disabled={!table.getCanNextPage()}
                    className="h-8 w-8 border-border bg-background hover:bg-muted/50"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Last page</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
