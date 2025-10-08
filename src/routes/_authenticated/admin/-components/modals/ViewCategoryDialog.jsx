import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Newspaper } from 'lucide-react'
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
    <Dialog open={dialogOpen} onOpenChange={closeModalAdmin} modal>
      <DialogContent className='mx-2 w-full rounded-lg sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='mb-3 flex items-start gap-3'>
            <div className='rounded-lg p-3'>{getCategoryIcon(dialogType)}</div>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold'>{blogCategoryData?.name || 'Category Details'}</h2>
              <p className='text-muted-foreground'>{getCategoryTitle(dialogType)}</p>
            </div>
            {blogCategoryData && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${blogCategoryData?.active ? 'border-green-200 bg-green-100 text-green-800' : 'border-red-200 bg-red-100 text-red-800'}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${blogCategoryData?.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {blogCategoryData?.active ? 'Active' : 'Inactive'}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>View details and stats for this category</DialogDescription>
        </DialogHeader>

        <div>
          {blogCategoryIsError && (
            <div className='mb-4 rounded-lg border border-red-200 bg-red-100 p-3 text-red-800'>
              <p className='font-semibold'>Error Loading Category</p>
              <p className='mt-1 text-sm'>{blogCategoryError.message}</p>
            </div>
          )}

          {blogCategoryFetchStatus === 'paused' && (
            <div className='mb-4 rounded-lg border border-yellow-200 bg-yellow-100 p-3 text-yellow-800'>
              <p className='font-semibold'>Connection Issue</p>
              <p className='mt-1 text-sm'>No internet connection available</p>
            </div>
          )}

          {(blogCategoryFetchStatus === 'fetching' || blogCategoryIsFetching || (!blogCategoryData && blogCategoryFetchStatus !== 'paused')) && !blogCategoryIsError ? (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                <Skeleton className='h-5 w-24 rounded-md' />
                <Skeleton className='h-20 w-full rounded-md' />
              </div>
            </div>
          ) : (
            blogCategoryData && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4'>
                  {/* Date Information Card */}
                  <div className='rounded-lg border p-4'>
                    <h3 className='text-base font-semibold'>Timeline Information</h3>
                    <div className='mt-2 space-y-1'>
                      <p className='text-muted-foreground text-sm'>
                        <span className='font-medium'>Created:</span> {format(new Date(blogCategoryData.createdAt), 'PPP HH:mm:ss')}
                      </p>
                      {blogCategoryData?.updatedAt && (
                        <p className='text-muted-foreground text-sm'>
                          <span className='font-medium'>Updated:</span> {format(new Date(blogCategoryData.updatedAt), 'PPP HH:mm:ss')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Content Statistics Card */}
                  <div className='rounded-lg border p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='text-base font-semibold'>Content Statistics</h3>
                        <p className='text-muted-foreground text-sm'>
                          Total {dialogType.includes('game') ? 'Games' : dialogType.includes('course') ? 'Courses' : 'Blogs'} in Category
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='text-3xl font-bold'>{blogCategoryData?.total || 0}</div>
                        <div className='text-muted-foreground text-sm'>Items</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button size='sm' variant='outline' onClick={closeModalAdmin}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
