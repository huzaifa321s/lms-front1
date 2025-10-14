import React from 'react'
import { format } from 'date-fns'
import { BookOpen, Newspaper } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

function getCategoryTitle(dialogType) {
  switch (dialogType) {
    case 'blog-category-view-modal':
    case 'add-blog-category-modal':
      return 'Blog Category'

    case 'course-category-view-modal':
    case 'add-course-category':
      return 'Course Category'

    case 'view-game-category-modal':
    case 'add-game-category':
      return 'Game Category'

    default:
      return 'Category'
  }
}

export default function ViewCategoryDialog({
  dialogOpen,
  dialogType,
  blogCategoryData,
  blogCategoryFetchStatus,
  blogCategoryIsError,
  blogCategoryError,
  blogCategoryIsFetching,
  closeModalAdmin,
}) {
  const getCategoryIcon = () => {
    switch (dialogType) {
      case 'add-blog-category-modal':
        return <Newspaper className='h-7 w-7' />
      case 'add-course-category':
        return <BookOpen className='h-7 w-7' />
      case 'add-game-category':
        return <Gamepad2 className='h-7 w-7' />
      default:
        return null
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={closeModalAdmin}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <div className='flex items-start gap-3'>
            <div className='bg-primary/10 text-primary rounded-md p-2'>
              {getCategoryIcon(dialogType)}
            </div>
            <div className='flex-1'>
              <DialogTitle className='text-xl font-semibold'>
                {blogCategoryData?.name || 'Category Details'}
              </DialogTitle>
              <DialogDescription>
                {getCategoryTitle(dialogType)}
              </DialogDescription>
            </div>
            {blogCategoryData && (
              <Badge
                variant={blogCategoryData.active ? 'default' : 'destructive'}
                className='flex items-center gap-1.5 text-xs font-semibold'
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    blogCategoryData.active ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                {blogCategoryData.active ? 'Active' : 'Inactive'}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Error state */}
        {blogCategoryIsError && (
          <div className='bg-destructive/10 text-destructive flex items-start gap-3 rounded-md p-3'>
            <AlertCircle className='h-5 w-5 shrink-0' />
            <div>
              <p className='font-medium'>Error Loading Category</p>
              <p className='text-sm'>{blogCategoryError.message}</p>
            </div>
          </div>
        )}

        {/* Paused state */}
        {blogCategoryFetchStatus === 'paused' && (
          <div className='flex items-start gap-3 rounded-md bg-yellow-100/60 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500'>
            <WifiOff className='h-5 w-5 shrink-0' />
            <div>
              <p className='font-medium'>Connection Issue</p>
              <p className='text-sm'>No internet connection available</p>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {blogCategoryIsFetching && (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-28 rounded-md' />
              <Skeleton className='h-16 w-full rounded-md' />
            </div>
          </div>
        )}

        {/* Actual content */}
        {!blogCategoryIsFetching && blogCategoryData && (
          <div className='space-y-4'>
            {/* Timeline Card */}
            <div className='border-border bg-muted/30 rounded-md border p-4'>
              <h3 className='text-base font-semibold'>Timeline Information</h3>
              <div className='text-muted-foreground mt-2 space-y-1 text-sm'>
                <p>
                  <span className='text-foreground font-medium'>Created:</span>{' '}
                  {format(new Date(blogCategoryData.createdAt), 'PPP HH:mm:ss')}
                </p>
                {blogCategoryData.updatedAt && (
                  <p>
                    <span className='text-foreground font-medium'>
                      Updated:
                    </span>{' '}
                    {format(
                      new Date(blogCategoryData.updatedAt),
                      'PPP HH:mm:ss'
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className='border-border bg-muted/30 rounded-md border p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-base font-semibold'>
                    Content Statistics
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Total{' '}
                    {dialogType.includes('game')
                      ? 'Games'
                      : dialogType.includes('course')
                        ? 'Courses'
                        : 'Blogs'}{' '}
                    in Category
                  </p>
                </div>
                <div className='text-right'>
                  <div className='text-foreground text-3xl font-bold'>
                    {blogCategoryData.total || 0}
                  </div>
                  <div className='text-muted-foreground text-sm'>Items</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' size='sm' onClick={closeModalAdmin}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
