import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '../../../../student/features/tasks/-components/data-table-column-header';
import { DataTableRowActions } from '../table/game-data-table-row-actions';
import { createColumnHelper } from '@tanstack/react-table';
const columnHelper = createColumnHelper()
export const trainingWheelGamesSchema = [
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
  columnHelper.accessor('question', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Question' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('category.name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('difficulties', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Difficulty Levels' />
    ),
    cell: (info) => (
      <>
        <div className='flex w-[20px] flex-wrap'>
          {info.getValue().length > 0 &&
            info.getValue().map((item) => {
              return (
                <Badge
                 className="my-0.5"
                  variant={
                    item === 'beginner'
                      ? 'secondary'
                      : item === 'intermediate'
                        ? 'default'
                        : item === 'expert'
                          ? 'destructive'
                          : 'default'
                  }
                >
                  {' '}
                  {item}
                </Badge>
              )
            })}
        </div>
      </>
    ),
  }),
  {
    id: 'actions',
    header: ({  }) => <p>Actions</p>,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]