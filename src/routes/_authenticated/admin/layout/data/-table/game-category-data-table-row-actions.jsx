import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useSearch } from '@tanstack/react-router'
import { IconListDetails, IconTrash } from '@tabler/icons-react'
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
import { GameCategorySchema } from '../-schemas/gameCategoriesSchema'

export function GameCategoryDataTableRowActions({ row }) {
  const category = GameCategorySchema.parse(row.original)
  const searchParams = useSearch({from :'/_authenticated/admin/settings/game-category/'});
  const dispatch = useDispatch()

  

  return (
    <div className="flex items-center">
     <Button size="xs" variant="outline"  onClick={() => dispatch(openModal({type:'view-game-category-modal',props:{categoryID:category._id}}))} >View</Button>
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
          <DropdownMenuItem onClick={() => dispatch(openModal({type:'game-category-edit-modal',props:{category,inputValue:category.name,searchInput:searchParams.q}}))}>
            Edit
            <DropdownMenuShortcut>
              <EditIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
         
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => dispatch(openModal({type:'game-category-delete-modal',props:{category:category,searchInput:searchParams.q}}))}>
            Delete
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
