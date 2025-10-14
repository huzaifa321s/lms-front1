import { createColumnHelper } from "@tanstack/react-table";
import { CoursesDataTableRowActions } from "../-table/course-data-table-row-actions";
import { DataTableColumnHeader } from "../../../../student/features/tasks/-components/data-table-column-header";
import { format } from "date-fns";
import { z } from "zod";
const columnHelper = createColumnHelper();
export const coursesSchema = [
columnHelper.display({
  id: "serial",
  header: "#",
  cell: ({ row, table }) => {
    
    const { pageIndex, pageSize } = table.getState().pagination

    return <p>{ pageIndex * pageSize + row.index + 1}</p>
  }
}),
  columnHelper.accessor('name', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: (info) => <p>{info.getValue()}</p>,
  }),

  columnHelper.accessor('description', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
cell: (info) => (
  <p className="truncate w-40">
    {info.getValue()}
  </p>
)



  }),

  columnHelper.accessor(
    (row) => `${row.instructorFirstName} ${row.instructorLastName}`,
    {
      id: 'Instructor',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Instructor' />,
      cell: (info) => <p>{info.getValue().trim() || 'N/A'}</p>,
    }
  ),

  columnHelper.accessor('enrolledCount', {
    header: ({ column }) => (
      <DataTableColumnHeader className="w-fit" column={column} title='Students' />
    ),
    cell: (info) => <p className="ml-[20px]">{info.getValue()}</p>,
  }),

  columnHelper.accessor('category.name', {
    id:'category.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
    cell: (info) => <p>{info.getValue() || 'N/A'}</p>,
  }),

  columnHelper.accessor('createdAt', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: (info) => <p>{format(new Date(info.getValue()), 'PPP')}</p>,
  }),

  {
    id: 'actions',
    header: () => <p>Actions</p>,
    cell: ({ row }) => <CoursesDataTableRowActions row={row} />,
  },
]

export const CoursesSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string().optional(), // optional if some courses don't have it
  createdAt: z.string(),
  updatedAt: z.string(),
  enrolledCount: z.number().optional(),
  instructorFirstName: z.string().optional(), // fallback empty string
  instructorLastName: z.string().optional(),

});


export const StudentSchema = z.object({
  _id: z.string(), // ObjectId string
  name: z.string(),
  phone: z.string().nullable(),
  bio: z.string().nullable(),
  email: z.string(),
  profile: z.string().nullable(),
  subscriptionPriceId: z.string().nullable(),
  subscriptionStatus: z.string().nullable(),
  coursesCount: z.number(),
  courseIds: z.array(z.string()), // list of course ObjectIds
  planActive: z.boolean(),
  plan: z.string().nullable(),
});
