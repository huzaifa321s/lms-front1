import {  EditIcon, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BlogsSchema } from '../-schemas/blogsSchema'
import { useAppUtils } from '../../../../../../hooks/useAppUtils'
import { openModalAdmin } from '../../../../../../shared/config/reducers/admin/DialogSlice'

export function BlogDataTableRowActions({ row }) {
  const blog = BlogsSchema.parse(row.original)
  const { dispatch, navigate } = useAppUtils()
  
  return (
   <>
  {/* View Button */}
  <Button
    size="xs"
    variant="outline"
    onClick={() =>
      navigate({
        to: `/admin/blogs/blog-details/${blog._id}`,
        search: { category: blog?.category?._id },
      })
    }
  >
    <Eye className="mr-1 h-4 w-4" />
    View
  </Button>

  {/* Dropdown Menu */}
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-[160px]">
      {/* Edit */}
      <DropdownMenuItem
        onClick={() => navigate({ to: `/admin/blogs/edit/${blog._id}` })}
        className="focus:bg-emerald-100 text-emerald-600 focus:text-emerald-800 cursor-pointer"
      >
        <EditIcon className="mr-2 h-4 w-4 text-emerald-600" />
        Edit
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Delete */}
      <DropdownMenuItem
        onClick={() =>
          dispatch(
            openModalAdmin({ type: "delete-blog", props: { blogID: blog._id } })
          )
        }
        className="focus:bg-red-100 text-red-600 focus:text-red-800 cursor-pointer"
      >
        <Trash className="mr-2 h-4 w-4 text-red-600" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</>

  )
}
