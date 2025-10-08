import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Newspaper, BookOpen, Gamepad2, Plus, Info, Tag } from 'lucide-react'

export default function AddCategoryDialog({
  dialogOpen,
  dialogType,
  inputValue,
  setInputValue,
  addCategoryMutation,
  handleSubmitAddCategory,
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

  const getCategoryText = () => {
    switch (dialogType) {
      case 'add-blog-category-modal':
        return 'Blog Category'
      case 'add-course-category':
        return 'Course Category'
      case 'add-game-category':
        return 'Game Category'
      default:
        return ''
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={closeModalAdmin}>
      <form onSubmit={handleSubmitAddCategory}>
        <DialogContent className='bg-card text-card-foreground w-full overflow-hidden rounded-lg border shadow-lg sm:max-w-[480px]'>
          <DialogHeader className='relative border-b p-6'>
            <div className='flex items-center gap-4'>
              <div className='bg-primary/10 text-primary rounded-md p-3'>
                {getCategoryIcon()}
              </div>
              <div>
                <DialogTitle className='text-2xl font-bold'>Add New Category</DialogTitle>
                <p className='text-muted-foreground mt-1 text-sm font-normal'>
                  {getCategoryText()}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className='space-y-4 p-6'>
            <DialogDescription className='text-muted-foreground leading-relaxed'>
              <div className='bg-muted/30 rounded-lg border p-4'>
                <div className='flex items-start gap-3'>
                  <Info className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
                  <div>
                    <p className='text-foreground mb-1 font-semibold'>
                      Create a meaningful category name
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Choose a clear, descriptive name that will help organize your content effectively.
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>

            <div className='space-y-3'>
              <Label htmlFor='categoryName' className='text-foreground mb-2 block text-sm font-semibold'>
                Category Name
              </Label>
              <div className='relative'>
                <Input
                  id='categoryName'
                  type='text'
                  placeholder='Enter a descriptive category name...'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className='h-12 w-full pr-12'
                />
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                  <Tag className='h-5 w-5' />
                </div>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className={`transition-colors duration-200 ${inputValue?.length > 0 ? 'text-green-500' : 'text-destructive'}`}>
                  {inputValue?.length > 0 ? '✓ Category name provided' : 'Category name is required'}
                </span>
                <span className='text-muted-foreground'>{inputValue?.length}/50</span>
              </div>
            </div>
          </div>

          <DialogFooter className='bg-muted/30 border-t px-6 py-5'>
            <div className='flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <DialogClose asChild>
                <Button variant='outline' className='w-full sm:w-auto' disabled={addCategoryMutation.status === 'pending'} onClick={closeModalAdmin}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type='submit'
                loading={addCategoryMutation.status === 'pending'}
                onClick={handleSubmitAddCategory}
                className='w-full min-w-[140px] sm:w-auto'
                disabled={addCategoryMutation.status === 'pending' || !inputValue}
              >
                {addCategoryMutation.status === 'pending' ? (
                  <span className='flex items-center gap-2'>Creating...</span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' /> Add Category
                  </span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
