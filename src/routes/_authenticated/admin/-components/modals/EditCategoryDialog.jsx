import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EditCategoryDialog({
  dialogType,
  inputValue,
  setInputValue,
  editCategoryMutation,
  handleSubmitEditCategory,
  dispatch,
  closeModalAdmin,
}) {
  return (
    <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
      <form onSubmit={handleSubmitEditCategory}>
        <DialogContent className='w-full rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-md'>
          {/* Header */}
          <DialogHeader className='space-y-2'>
            <DialogTitle className='text-lg font-semibold text-[#1e293b]'>
              Edit Category
            </DialogTitle>
            <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
              Update the category name and save your changes.
            </DialogDescription>
          </DialogHeader>

          {/* Input */}
          <div className='mt-4 space-y-2'>
            <Label
              htmlFor='category'
              className='text-sm font-medium text-[#1e293b]'
            >
              Category Name
            </Label>
            <Input
              id='category'
              value={inputValue}
              placeholder='Enter category name...'
              onChange={(e) => setInputValue(e.target.value)}
              className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20'
            />
          </div>

          {/* Footer */}
          <DialogFooter className='mt-6 flex justify-end space-x-3'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                disabled={editCategoryMutation.status === 'pending'}
                onClick={() => dispatch(closeModalAdmin())}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              size='sm'
              type='submit'
              onClick={handleSubmitEditCategory}
              disabled={editCategoryMutation.status === 'pending' || !inputValue}
            >
              {editCategoryMutation.status === 'pending' ? (
                <span className='flex items-center gap-2'>
                  <svg
                    className='h-4 w-4 animate-spin'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
