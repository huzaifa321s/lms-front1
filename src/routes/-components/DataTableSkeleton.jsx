import { Skeleton } from "@/components/ui/skeleton"

export function DataTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Table Skeleton */}
      <div className="relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#f1f5f9]">
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="p-4 text-left">
                    <Skeleton className="h-5 w-24 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, rowIdx) => (
                <tr key={rowIdx} className="border-t border-[#e2e8f0]">
                  {[...Array(5)].map((_, colIdx) => (
                    <td key={colIdx} className="p-4">
                      <Skeleton className="h-6 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-4 shadow-sm flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  )
}
