import { createColumnHelper } from "@tanstack/react-table"
import { DataTableRowActionsAdmin } from "../-table/game-admin-data-table-row-actions"
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header"
const columnHelper = createColumnHelper();
import { Badge } from '@/components/ui/badge'
import { z } from "zod";

export const trainingWheelGamesSchemaAdmin = [
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
}),,
  columnHelper.accessor('question', {
    header: ({ column }) => (
      <DataTableColumnHeader className="w-fit" column={column} title='Question' />
    ),
    cell: (info) => <p className="truncate w-20">{info.getValue()}</p>,
  }),
  columnHelper.accessor('category.name', {
    header: ({ column }) => (
      <DataTableColumnHeader className="w-fit" column={column} title='Category' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('difficulties', {
    header: ({ column }) => (
      <DataTableColumnHeader className="w-fit" column={column} title='Difficulty Levels' />
    ),
cell: (info) => (
      <>
        <div className='flex w-[20px] flex-wrap'>
          {info.getValue().length > 0 &&
            info.getValue().map((item) => {
              return (
                <Badge
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
    header: () => <p>Actions</p>,
    cell: ({ row }) => <DataTableRowActionsAdmin  row={row} />,
  },
]


export const TrainingWheelGameSchema = z.object({
  _id: z.string(),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  difficulties: z.array(z.string()),
  question: z.string(),
})
