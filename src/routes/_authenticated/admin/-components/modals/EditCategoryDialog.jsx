import React, { useEffect, useRef } from 'react'
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
import { Loader } from 'lucide-react'

export default function EditCategoryDialog({
  dialogType,
  inputValue,
  setInputValue,
  editCategoryMutation,
  handleSubmitEditCategory,
  dispatch,
  closeModalAdmin,
}) {
  const inputRef = useRef(null)

  // focus without selecting
  useEffect(() => {
    if (inputRef.current) {
      const el = inputRef.current
      el.focus({ preventScroll: true })
      el.setSelectionRange(el.value.length, el.value.length) // move cursor to end
    }
  }, [])

  return (
    <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
      <form onSubmit={handleSubmitEditCategory}>
        <DialogContent
          className='w-full rounded-[12px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-md'
          // ⬇️ Disable Radix's auto-focus behavior
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className='space-y-2'>
            <DialogTitle className='text-lg font-semibold text-[#1e293b]'>
              Edit Category
            </DialogTitle>
            <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
              Update the category name and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className='mt-4 space-y-2'>
            <Label
              htmlFor='category'
              className='text-sm font-medium text-[#1e293b]'
            >
              Category Name
            </Label>

            <Input
              ref={inputRef}
              id='category'
              value={inputValue}
              placeholder='Enter category name...'
              onChange={(e) => setInputValue(e.target.value)}
              className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20'
            />
          </div>

          <DialogFooter className='mt-6 flex justify-end space-x-3'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                type='button'
                disabled={editCategoryMutation.status === 'pending'}
                onClick={() => dispatch(closeModalAdmin())}
              >
                Cancel
              </Button>
            </DialogClose>

          <Button loading={editCategoryMutation.status === 'pending'} size='sm' type='submit' onClick={handleSubmitEditCategory} disabled={ editCategoryMutation.status === 'pending' || !inputValue } > {editCategoryMutation.status === 'pending' ?( "Saving...") : ( 'Save Changes' )} </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
