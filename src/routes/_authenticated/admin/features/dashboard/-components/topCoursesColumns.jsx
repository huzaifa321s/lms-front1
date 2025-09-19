import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '../../tasks/-components/data-table-column-header'
import { labels} from './dummyTablePriorities'

export const columns = [
  {
    accessorKey: 'title',
    enableSorting:false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Course' />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)
      return (
        <div className='flex space-x-2'>
          {label && <Badge variant='outline'>{label.label}</Badge>}
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('title')}
          </span>
        </div>
      )
    },
  },
    {
    accessorKey: 'description',
    enableSorting:false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>  
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('description')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'studentsCount',
    enableSorting:false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Students' />
    ),
    cell: (info) => {
      
      return (
        <div className='flex w-[100px] items-center'>
          
          <span>{info.getValue()}</span>
        </div>
      )
    },
  },
]
