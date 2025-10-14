import { useNavigate, useSearch } from '@tanstack/react-router'
import { MoreHorizontal, EditIcon, Trash, Eye } from 'lucide-react'
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
import { openModal } from '../../../../../../shared/config/reducers/student/studentDialogSlice'
import { openModalTeacher } from '../../../../../../shared/config/reducers/teacher/teacherDialogSlice'
import { TrainingWheelGameSchema } from '../../../../admin/layout/data/-schemas/trainingWheelGameSchemas'

export function DataTableRowActions({ row }) {
  const game = TrainingWheelGameSchema.parse(row.original)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useSearch({
    from: '/_authenticated/teacher/trainingwheelgame/',
  })

  return (
    <>
      <Button
        size='xs'
        variant='outline'
        onClick={() =>
          dispatch(
            openModal({
              type: 'game-view',
              props: { gameID: game._id, userType: 'teacher' },
            })
          )
        }
      >
      <Eye/>  View
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
              navigate({ to: `/teacher/trainingwheelgame/edit/${game._id}` })
            }
             className="focus:bg-emerald-100 text-emerald-600 focus:text-emerald-800 cursor-pointer"
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
                openModalTeacher({
                  type: 'delete-game-modal',
                  props: {
                    gameID: game._id,
                    params,
                    gameDetails: { question: game.question },
                  },
                })
              )
            }
                    className="focus:bg-red-100 text-red-600 focus:text-red-800 cursor-pointer"

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
