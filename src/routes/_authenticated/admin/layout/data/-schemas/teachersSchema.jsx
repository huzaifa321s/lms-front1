import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header";
import { TeachersDataTableRowActions } from "../../../../student/features/tasks/-components/teacher-data-table-row-actions";
import { format } from "date-fns";
const columnHelper = createColumnHelper()

export const teachersSchema = [
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
  columnHelper.accessor('profile', {
    header:() => <p>Profile</p>,
    cell: (info) => <img className="rounded-full shadow-md w-10 h-10" loading="lazy" src={`${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/teacher/profile/${info.getValue()}`}/>,
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'Name',
  }),
  columnHelper.accessor('bio', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bio' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('courses', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Courses' />
    ),
    cell: (info) => <p className='px-5'>{info.getValue().length}</p>,
  }),
  columnHelper.accessor('email', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Joining Date' />
    ),
    cell: (info) => <p>{format(info.getValue(), 'PPP')}</p>,
  }),
  {
    id: 'actions',
    header: () => <p>Actions</p>,
    cell: ({ row }) => <TeachersDataTableRowActions row={row} />,
  },
]
