import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header"
const columnHelper = createColumnHelper();

export const enrolledCoursesSchema = [
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
  columnHelper.accessor('student.firstName', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='First Name' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('student.lastName', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Name' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('student.email', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
]