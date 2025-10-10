import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, CheckCircle2, ClipboardIcon } from 'lucide-react'

export default function DeleteCategoryDialog1({
  dialogType,
  showInput,
  setShowInput,
  inputValue,
  setInputValue,
  handleSubmitCategory,
  deleteBlogCategoryFirstMutation,
  dispatch,
  closeModalAdmin,
}) {
  const getCategoryName = () => {
    if (dialogType === 'delete-blog-category') return 'blog'
    if (dialogType === 'course-category-delete-modal') return 'course'
    if (dialogType === 'game-category-delete-modal') return 'game'
    return ''
  }
   const [copied, setCopied] = useState(false)
  
    const handleCopy = () => {
      navigator.clipboard.writeText('delete')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }

  return (
    <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
      <form onSubmit={handleSubmitCategory}>
        <DialogContent className='w-full rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-md'>
          <DialogHeader className='space-y-2'>
            <DialogTitle className='text-lg font-semibold text-[#dc2626]'>
              Delete Category
            </DialogTitle>
            <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
              <span className='font-semibold text-[#1e293b]'>
                Are you sure you want to delete this {getCategoryName()} category?
              </span>
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {showInput && (
            <div className='mt-4 space-y-2'>
                 <Label
      htmlFor='deleteInput'
      className='text-xs font-semibold text-[#1e293b] sm:text-sm'
    >
      Please type{' '}
      <Button
        type='button'
        onClick={handleCopy}
      >
        'delete'
        {copied ? (
          <Check className='h-3 w-3 text-green-500' />
        ) : (
          <ClipboardIcon className='h-3 w-3 text-gray-500' />
        )}
      </Button>{' '}
      to confirm
    </Label>
              <div className='relative'>
                <Input
                  id='deleteInput'
                  type='text'
                  placeholder='delete'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#1e293b] placeholder-[#94a3b8] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/20'
                />
                {inputValue === 'delete' && (
                  <div className='absolute top-1/2 right-2 -translate-y-1/2 transform'>
                    <CheckCircle2 className='h-4 w-4 text-[#059669]' />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className='mt-6 flex justify-end space-x-3'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                disabled={deleteBlogCategoryFirstMutation.status === 'pending'}
                onClick={() => dispatch(closeModalAdmin())}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              size='sm'
              type={inputValue === 'delete' ? 'submit' : 'button'}
              variant='destructive'
              disabled={
                deleteBlogCategoryFirstMutation.status === 'pending' ||
                (showInput && inputValue !== 'delete')
              }
              onClick={(e) => {
                if (inputValue === 'delete') {
                  handleSubmitCategory(e)
                } else {
                  setShowInput(true)
                }
              }}
            >
              {deleteBlogCategoryFirstMutation.status === 'pending' ? (
                <span className='flex items-center gap-2'>Deleting...</span>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
