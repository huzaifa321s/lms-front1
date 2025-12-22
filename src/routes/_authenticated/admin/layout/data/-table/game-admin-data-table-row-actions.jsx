import { useNavigate, useSearch } from '@tanstack/react-router'
import { EditIcon, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TrainingWheelGameSchema } from '../-schemas/trainingWheelGameSchemas'
import { openModalAdmin } from '@/shared/config/reducers/admin/DialogSlice'
import { openModal } from '@/shared/config/reducers/student/studentDialogSlice'

export function DataTableRowActionsAdmin({ row }) {
  const game = TrainingWheelGameSchema.parse(row.original)
  const navigate = useNavigate()
  const searchParams = useSearch({
    from: '/_authenticated/admin/trainingwheelgame/',
  })
  const dispatch = useDispatch()

  return (
    <>
      <Button
        size='xs'
        variant='outline'
        onClick={() =>
          dispatch(
            openModal({
              type: 'game-view',
              props: { gameID: game._id, userType: 'admin' },
            })
          )
        }
      >
        <Eye />
        View
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
          <DropdownMenuItem
            onClick={() =>
              navigate({ to: `/admin/trainingwheelgame/edit/${game._id}` })
            }
            className='cursor-pointer text-emerald-600 focus:bg-emerald-100 focus:text-emerald-800'
          >
            Edit
            <DropdownMenuShortcut>
              <EditIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                openModalAdmin({
                  type: 'delete-game',
                  props: { gameDetails: game, searchParams },
                })
              )
            }
            className='cursor-pointer text-red-600 focus:bg-red-100 focus:text-red-800'
          >
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
