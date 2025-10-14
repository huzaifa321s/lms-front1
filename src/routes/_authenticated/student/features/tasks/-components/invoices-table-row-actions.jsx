import { useNavigate } from '@tanstack/react-router'
import { MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Schema } from '../data/schema'

export function InvoicesDataTableRowActions({ row }) {
  const invoice = Schema.parse(row.original)
  const navigate = useNavigate()

  return (
    <>
      <Button
        size='xs'
        variant='outline'
        onClick={() =>
          navigate({
            to: `/student/setting/invoices/invoice-details/${invoice.invoice_id}`,
          })
        }
      >
        View Detials
      </Button>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => setDeleteModalCondition(true)}>
            Delete
            <DropdownMenuShortcut>
              <Trash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
