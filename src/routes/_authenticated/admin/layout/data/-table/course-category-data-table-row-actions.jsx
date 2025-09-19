import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useSearch } from '@tanstack/react-router'
import { IconListDetails, IconTrash } from '@tabler/icons-react'
import { EditIcon } from 'lucide-react'
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
import { openModal } from '../../../../../../shared/config/reducers/admin/DialogSlice'
import { CourseCategoriesSchema } from '../-schemas/courseCategoriesSchema'


export function CourseCategoryDataTableRowActions({ row }) {
  const category = CourseCategoriesSchema.parse(row.original)
  const searchDeps = useSearch({
    from: '/_authenticated/admin/settings/course-category/',
  })
  const dispatch = useDispatch()

  return (
    <div className="flex items-center">
      <Button size="xs" variant="outline"  onClick={() =>
              dispatch(
                openModal({
                  type: 'course-category-view-modal',
                  props: { categoryID: category._id,searchInput:searchDeps.q },
                })
              )
            }>View</Button>
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
              dispatch(
                openModal({
                  type: 'course-category-edit-modal',
                  props: { category, searchDeps, inputValue: category.name,searchInput:searchDeps.q },
                })
              )
            }
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
                openModal({
                  type: 'course-category-delete-modal',
                  props: { category,searchInput:searchDeps.q },
                })
              )
            }
          >
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
