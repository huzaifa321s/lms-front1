import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { statuses } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { Cross } from 'lucide-react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  console.log('table.getAllColumns() ===>',table.getAllColumns());
  console.log('table.getColumn(`invoice_id`)?.getFilterValue() ===>',table.getColumn('invoice_id')?.getFilterValue());

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter tasks...'
          value={
            (table.getColumn('invoice_id')?.getFilterValue() as string) ?? ''

          }
          onChange={(event) => {
            ;(table.getColumn('invoice_id')?.setFilterValue(event.target.value),
              console.log('event.target.value ===>', event.target.value))
          }}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('invoice_status') && (
            <DataTableFacetedFilter
              column={table.getColumn('invoice_status')}
              title='Status'
              options={statuses}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            size='sm'
          >
            Reset
            <Cross className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
