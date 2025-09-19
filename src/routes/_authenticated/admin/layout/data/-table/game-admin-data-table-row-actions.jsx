import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate, useSearch } from '@tanstack/react-router'
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
import { openModal } from '../../../../../../shared/config/reducers/admin/DialogSlice'
import { useDispatch } from 'react-redux'
import { TrainingWheelGameSchema } from '../-schemas/trainingWheelGameSchemas'

export function DataTableRowActionsAdmin({ row }) {
  const game = TrainingWheelGameSchema.parse(row.original)
  const navigate = useNavigate()
 const searchParams = useSearch({from:'/_authenticated/admin/trainingwheelgame/'});
 const dispatch = useDispatch();
 

  return (
    <>
<Button size="xs" variant="outline" onClick={() => dispatch(openModal({type:'game-view',props:{gameID:game._id}}))}>View</Button>
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
          
          <DropdownMenuItem
            onClick={() =>
              navigate({ to: `/admin/trainingwheelgame/edit/${game._id}` })
            }
          >
            Edit
            <DropdownMenuShortcut>
              <EditIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => dispatch(openModal({type:'delete-game',props:{gameDetails:game,searchParams}}))}>
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
