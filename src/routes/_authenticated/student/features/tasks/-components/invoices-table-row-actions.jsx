import { useCallback, useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate, useRouter } from '@tanstack/react-router'
import {  IconListDetails, IconTrash } from '@tabler/icons-react'
import { EditIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Schema } from '../data/schema'


export function InvoicesDataTableRowActions({ row }) {
  const invoice = Schema.parse(row.original)
  console.log('invoice ===>',invoice)
  const navigate = useNavigate()


  return (
    <>

    <Button size="xs" variant="outline" onClick={() => navigate({to:`/student/setting/invoices/invoice-details/${invoice.invoice_id}` })}>View Detials</Button>
 
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => setDeleteModalCondition(true)}>
            Delete
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
