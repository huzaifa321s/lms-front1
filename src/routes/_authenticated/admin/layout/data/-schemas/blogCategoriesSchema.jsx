import { createColumnHelper } from "@tanstack/react-table";
import { BlogCategoryDataTableRowActions } from "../-table/blog-category-data-table-row-actions";
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header";
import { z } from "zod";
const columnHelper = createColumnHelper()

export const blogCategoriesSchema = [
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
   columnHelper.accessor('name',{
    header:({column}) => (
      <DataTableColumnHeader column={column} title="Name"/>
    ),
   }),
columnHelper.accessor('active', {
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Status" />
  ),
  cell: (info) => (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        info.getValue() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {info.getValue() ? "Active" : "Inactive"}
    </span>
  ),
}),
  {
    id:'actions',
    header:({column}) => (
      <DataTableColumnHeader column={column} title="Action" className="float-right"/>
    ),cell:({row}) =><div className="float-right"> <BlogCategoryDataTableRowActions row={row}/></div>
  }
]


export const BlogCategoriesSchema = z.object({
  name:z.string(),
  _id:z.string()
})
