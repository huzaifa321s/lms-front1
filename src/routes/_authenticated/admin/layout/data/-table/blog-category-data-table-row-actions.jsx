
import {  useSearch } from '@tanstack/react-router'
import {  EditIcon, Eye, MoreHorizontal, Trash } from 'lucide-react'
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
import { openModalAdmin } from '../../../../../../shared/config/reducers/admin/DialogSlice'
import { BlogCategoriesSchema } from '../-schemas/blogCategoriesSchema'


export function BlogCategoryDataTableRowActions({ row }) {
  const category = BlogCategoriesSchema.parse(row.original)
  const searchInput = useSearch({
    from: '/_authenticated/admin/settings/',
    select: (search) => search.q,
  })
  const dispatch = useDispatch()

  return (
    <div className="flex items-center">
    <Button size="xs" variant="outline"  onClick={() =>
              dispatch(
                openModalAdmin({
                  type: 'blog-category-view-modal',
                  props: { categoryID: category._id },
                })
              )
            }>
              <Eye/> View</Button>
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
              dispatch(
                openModalAdmin({
                  type: 'edit-category-modal',
                  props: { searchInput, category, inputValue: category?.name },
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
                openModalAdmin({
                  type: 'delete-blog-category',
                  props: { searchInput ,category},
                })
              )
            }
          >
            Delete
            <DropdownMenuShortcut>
              <Trash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
