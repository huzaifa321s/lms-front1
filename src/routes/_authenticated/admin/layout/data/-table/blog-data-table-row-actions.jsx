import { useCallback, useState } from 'react'
import axios from 'axios'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { IconListDetails, IconTrash } from '@tabler/icons-react'
import { EditIcon } from 'lucide-react'
import { toast } from 'sonner'
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
import DeleteBlogModal from '../../../blogs/-components/BlogDeleteModal'
import { useAppUtils } from '../../../../../../hooks/useAppUtils'
import { openModal } from '../../../../../../shared/config/reducers/admin/DialogSlice'

export function BlogDataTableRowActions({ row }) {
  const blog = BlogsSchema.parse(row.original)
  const {router,dispatch,navigate} = useAppUtils()
  const [deleteModalCondition, setDeleteModalCondition] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const deleteBlog = useCallback(async () => {
    setIsLoading(true)
    try {
      let response = await axios.delete(`/admin/blog/delete/${blog._id}`)
      response = response.data
      if (response.success) {
        toast.success('Blog deleted successfully')
        setDeleteModalCondition(false)
        router.invalidate()
      }
    } catch (error) {
      console.log('Registration Error -> ', error)
      toast.error('Internal server error')
    } finally {
      setIsLoading(false)
    }
  }, [blog, router, toast])

  return (
    <>
      {/* {deleteModalCondition && (
        <DeleteBlogModal
          modalCondition={deleteModalCondition}
          handleModalClose={setDeleteModalCondition}
          deleteBlog={deleteBlog}
          isLoading={isLoading}
          blogDetails={blog}
        />
      )} */}
<Button  size="xs" variant="outline" onClick={() =>
              navigate({
                to: `/admin/blogs/blog-details/${blog._id}`,
                search: { category: blog.category._id },
              })
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
            onClick={() => navigate({ to: `/admin/blogs/edit/${blog._id}` })}
          >
            Edit
            <DropdownMenuShortcut>
              <EditIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => dispatch(openModal({type:'delete-blog',props:{blogID:blog._id}}))}>
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
