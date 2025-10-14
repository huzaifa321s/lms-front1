import React, { useState } from 'react'
import { Newspaper, BookOpen, Gamepad2, Plus, Info, Tag } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <div className='flex items-start gap-3'>
            <div className='bg-primary/10 text-primary rounded-md p-2'>
              {getCategoryIcon()}
            </div>
            <div>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>{getCategoryText()}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info Section */}
        <div className='bg-muted/40 rounded-md p-3 text-sm'>
          <div className='flex items-start gap-3'>
            <Info className='text-primary mt-0.5 h-4 w-4' />
            <div>
              <p className='text-foreground font-medium'>
                Create a meaningful category name
              </p>
              <p className='text-muted-foreground'>
                Choose a clear, descriptive name that helps organize your
                content.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitAddCategory} className='space-y-4 pt-4'>
          <div className='space-y-2'>
            <Label htmlFor='categoryName'>Category Name</Label>
            <div className='relative'>
              <Input
                id='categoryName'
                type='text'
                placeholder='Enter category name...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={50}
              />
              <Tag className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span
                className={
                  inputValue?.length > 0 ? 'text-green-500' : 'text-destructive'
                }
              >
                {inputValue?.length > 0
                  ? '✓ Category name provided'
                  : 'Category name is required'}
              </span>
              <span className='text-muted-foreground'>
                {inputValue?.length}/50
              </span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type='button'
                variant='outline'
                disabled={addCategoryMutation.status === 'pending'}
                onClick={closeModalAdmin}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              disabled={addCategoryMutation.status === 'pending' || !inputValue}
            >
              {addCategoryMutation.status === 'pending' ? (
                <span className='flex items-center gap-2'>
                  <Plus className='h-4 w-4 animate-spin' />
                  Creating...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Category
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
