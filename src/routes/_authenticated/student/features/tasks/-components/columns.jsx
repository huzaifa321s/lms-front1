import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { labels, priorities, statuses } from '../data/data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from '../../../../teacher/-layout/data/table/game-data-table-row-actions.jsx'
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/shadcn-io/status';
import { InvoicesDataTableRowActions } from './invoices-table-row-actions.jsx'
import { Button } from '@/components/ui/button.js'
import { toast } from 'sonner'
import axios from 'axios'
import { CourseTeachersDataTableRowActions } from './course-teachers-data-table-row-actions.jsx'
import { BookAIcon } from 'lucide-react'
import { CoursesDataTableRowActionsStudent } from './student-course-data-table-row-actions.jsx'

const columnHelper = createColumnHelper()
const payInvoice = 
    async (id) => {
      try {
        let response = await axios.post(`/student/payment/pay-invoice`, {
          invoiceId: id,
        })
        response = response.data
        console.log('response ===>',response)
        if (response.success) {
          if (
            response?.data?.subscription &&
            response?.data?.remainingEnrollmentCount
          ) {
            dispatch(
              updateSubscription({
                subscription: response.data.subscription,
                remainingEnrollmentCount:
                  response.data.remainingEnrollmentCount,
              })
            )
          }

          toast.success('Payment successful')
        }
      } catch (error) {
        console.log('error',error)
        const errorData = error.response?.data
        if (errorData?.metadata?.errorType === 'StripeCardError') {
          toast.error(errorData.message)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    }
   

export const columns = [
  {
    id: 'select',
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Task' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='text-muted-foreground mr-2 h-4 w-4' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      return (
        <div className='flex items-center'>
          {priority.icon && (
            <priority.icon className='text-muted-foreground mr-2 h-4 w-4' />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => console.log('action row ===>', row),
  },
]

export const invoicesSchema = [
  { id: 'select', cell: ({ row }) => <p>{row.index + 1}</p> },
  {
    accessorKey: 'invoice_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Invoice ID' />
    ),
    cell: ({ row }) => {
      return <div >{row.getValue('invoice_id')}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'subscription_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subscription ID' />
    ),
    cell: ({ row }) => {
      return <p>{row.getValue('subscription_id')}</p>
    },
  },
  {
    accessorKey: 'issue_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Issue Date' />
    ),
    cell: ({ row }) => {
      return <p >{row.getValue('issue_date')}</p>
    },
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Due Date' />
    ),
    cell: ({ row }) => {
      return <p >{row.getValue('due_date')}</p>
    },
  },
  {
    accessorKey: 'paid_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Paid Date' />
    ),
    cell: ({ row }) => {
      return <p >{row.getValue('paid_at')}</p>
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return <p>${row.getValue('amount')}</p>
    },
  },
  {
    accessorKey: 'invoice_status',
    header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return <p className="flex items-center gap-1"> 
      <Status status={row.getValue('invoice_status')}>
      <StatusIndicator />
      <StatusLabel value={row.getValue('invoice_status')}/>
      </Status> 
    </p>
    },
  },
  {
    id: 'actions',
    header:() => <p>Actions</p>,
    cell: ({ row }) => <div className="flex items-center gap-2">{row.original.invoice_status === 'Open' && <Button size="xs" onClick={() => payInvoice(row.original.invoice_id)}>Pay Invoice</Button>}<InvoicesDataTableRowActions row={row}/></div>
  },
]



// export const trainingWheelGamesSchema = [
//   { id: 'select', cell: ({ row }) => <p>{row.index + 1}</p> },
//   columnHelper.accessor('question', {
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Question' />
//     ),
//     cell: (info) => <p>{info.getValue()}</p>,
//   }),
//   columnHelper.accessor('category.name', {
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Category' />
//     ),
//     cell: (info) => <p>{info.getValue()}</p>,
//   }),
//   columnHelper.accessor('difficulties', {
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Difficulty Levels' />
//     ),
//     cell: (info) => (
//       <>
//         <div className='flex w-[20px] flex-wrap'>
//           {info.getValue().length > 0 &&
//             info.getValue().map((item) => {
//               return (
//                 <Badge
//                  className="my-0.5"
//                   variant={
//                     item === 'beginner'
//                       ? 'secondary'
//                       : item === 'intermediate'
//                         ? 'default'
//                         : item === 'expert'
//                           ? 'destructive'
//                           : 'default'
//                   }
//                 >
//                   {' '}
//                   {item}
//                 </Badge>
//               )
//             })}
//         </div>
//       </>
//     ),
//   }),
//   {
//     id: 'actions',
//     header: ({  }) => <p>Actions</p>,
//     cell: ({ row }) => <DataTableRowActions row={row} />,
//   },
// ]


export const coursesSchemaStudent = [
  { id: 'select', cell: ({ row }) => <p>{row.index + 1}</p> },

  columnHelper.accessor('name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('description', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
cell: (info) => (
  <p className="truncate w-40">
    {info.getValue()}
  </p>
)
,
  }),
  columnHelper.accessor(
    (row) => `${row.instructor.firstName} ${row.instructor.lastName}`,
    {
      id: 'Instructor',
    }
  ),
  columnHelper.accessor('category.name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: (info) => <p>{info.getValue()}</p>,
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: (info) => <p>{format(info.getValue(), 'PPP')}</p>,
  }),
  {
    id: 'actions',
    header: () => <p>Actions</p>,
    cell: ({ row }) => <CoursesDataTableRowActionsStudent row={row} />,
  },
]



export const teachersSchemaStudentPanel = [
  columnHelper.display({
  id: "serial",
  header: "#",
  cell: ({ row, table }) => {
    const { pageIndex, pageSize } = table.getState().pagination
    return <p>{ pageIndex * pageSize + row.index + 1}</p>
  }
}),
  columnHelper.accessor('profile', {
    header:() => <p>Profile</p>,
    cell: (info) => <img className="rounded-full shadow-md w-10 h-10" src={`${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/teacher/profile/${info.getValue()}`} laoding="lazy"/>,
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
    cell: (info) => <p className='px-5'>{info.getValue().length > 3 ? info.getValue().length : info.getValue().map((c,i) => {
      return <div className="flex gap-0.5 "><BookAIcon/> {c.name}{i + 1 != info.getValue().length && ','}</div>
    })}</p>,
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
    cell: ({ row }) => <CourseTeachersDataTableRowActions row={row} />,
  },
]

