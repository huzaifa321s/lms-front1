import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header";
import {Badge} from '@/components/ui/badge'
import { StudentDataTableRowActions } from "../-table/student-data-table-row-actions";
import { cn } from '@/lib/utils'

const columnHelper = createColumnHelper()

export const studentsSchema = [
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
  columnHelper.accessor('profile',{
    header:() => <p>Profile</p>,
    cell:(info) => <img className="rounded-full shadow-md w-10 h-10" loading="lazy" src={`${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/student/profile/${info.getValue()}`}/>,
    enableSorting:false

  }),
  columnHelper.accessor('name',{
    header:({column}) => (<DataTableColumnHeader column={column} title="Name"/>)
  }),
  columnHelper.accessor('bio',{
    header:({column}) => (<DataTableColumnHeader column={column} title="Bio"/>),
    enableSorting:false,
  }),
  columnHelper.accessor("phone",{
    header:({column}) => <DataTableColumnHeader column={column} title="Phone"/>,
    cell:(info) => <p>{info.getValue()}</p>
  }),
   columnHelper.accessor("coursesCount",{
    header:({column}) => <DataTableColumnHeader column={column} title="Courses Enrolled"/>,
    cell:(info) => <p>{info.getValue()}</p>
  }),
  columnHelper.accessor('plan',{
    header:({column}) => <DataTableColumnHeader column={column} title="Subscription"/>,
    cell:(info) =><Badge
    size="xs"
  className={cn(
    
    info.getValue() === "Daily" && "bg-gray-200 text-gray-800 dark:bg-gray-700",
    info.getValue() === "Silver" && "bg-slate-400 text-white dark:bg-slate-500",
    info.getValue() === "Gold" && "bg-yellow-500 text-white dark:bg-yellow-600",
    info.getValue() === "Bronze" && "bg-amber-600 text-white dark:bg-amber-700"
  )}
>
  {info.getValue()}
</Badge>
  }),
  columnHelper.accessor("email",{
    header:({column}) => <DataTableColumnHeader column={column} title="Email"/>,
    cell:(info) => <p>{info.getValue()}</p>
   }),
   {id:'actions',header:({column}) => <DataTableColumnHeader column={column} title="Actions"/>,cell:({row}) => <StudentDataTableRowActions row={row}/>},
]