import React, { memo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'


const Pagination = ({ currentPage, totalPages, onPageChange ,paginationButtons}) => {
  // Generate page buttons dynamically


  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex justify-center">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
        {currentPage > 1 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 text-current" />
          </Button>
        )}

        {paginationButtons}

        {currentPage < totalPages && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4 text-current" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Memoize for performance
export default memo(Pagination)
