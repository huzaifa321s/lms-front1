import { Badge } from '@/components/ui/badge'
import { labels, priorities, statuses } from '../data/data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// columns for tasks
export const columns = [
  {
    id: 'select',
    cell: ({ row }) => (
      <p className="text-sm text-gray-600">{row.index + 1}</p>
    ),
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
  ),
    cell: ({ row }) => (
      <div className="w-[60px] sm:w-[80px] truncate">
        {row.getValue('id')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 max-w-xs sm:max-w-lg md:max-w-2xl">
          {label && (
            <Badge variant="outline" className="mb-1 sm:mb-0">
              {label.label}
            </Badge>
          )}
          <span className="truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )
      if (!status) return null

      return (
        <div className="flex items-center w-[80px] sm:w-[120px]">
          {status.icon && (
            <status.icon className="text-muted-foreground mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          )}
          <span className="truncate text-xs sm:text-sm">{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )
      if (!priority) return null

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="text-muted-foreground mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          )}
          <span className="truncate text-xs sm:text-sm">{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions row={row} />
    ),
  },
]


// invoices schema
export const invoicesSchema = [
columnHelper.display({
  id: "serial",
  header: "#",
  cell: ({ row, table }) => {
    console.log('table.getState().pagination ===>',table.getState().pagination)
    const { pageIndex, pageSize } = table.getState().pagination
    console.log('pageIndex ===>',pageIndex)
    console.log('pageIndex * pageSize + row.index  + 1',pageIndex * pageSize + row.index + 1)
    return <p>{ pageIndex * pageSize + row.index + 1}</p>
  }
}),
  {
    accessorKey: 'invoice_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice ID" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[100px] sm:max-w-[200px]">
        {row.getValue('invoice_id')}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'subscription_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription ID" />
    ),
    cell: ({ row }) => (
      <p className="truncate max-w-[80px] sm:max-w-[160px]">
        {row.getValue('subscription_id')}
      </p>
    ),
  },
  {
    accessorKey: 'issue_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => (
      <p className="text-xs sm:text-sm">{row.getValue('issue_date')}</p>
    ),
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => (
      <p className="text-xs sm:text-sm">{row.getValue('due_date')}</p>
    ),
  },
  {
    accessorKey: 'paid_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid Date" />
    ),
    cell: ({ row }) => (
      <p className="text-xs sm:text-sm">{row.getValue('paid_at')}</p>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <p className="font-medium">{row.getValue('amount')}</p>
    ),
  },
  {
    accessorKey: 'invoice_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <p className="capitalize">{row.getValue('invoice_status')}</p>
    ),
  },
]
