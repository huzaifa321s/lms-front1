import { createColumnHelper } from "@tanstack/react-table";
import { BlogDataTableRowActions } from "../-table/blog-data-table-row-actions";
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header";
import { z } from "zod";

const columnHelper = createColumnHelper()
export const blogsSchema = [
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
  columnHelper.accessor('title', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('category.name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  {
    id: 'actions',
    header: () => <p>Actions</p>,
    cell: ({ row }) => <BlogDataTableRowActions row={row} />,
  },
]



export const BlogsSchema = z.object({
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  content: z.string(),
  title: z.string(),
  _id: z.string(),
})