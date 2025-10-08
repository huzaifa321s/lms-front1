// LazyDeleteBlogDialog.jsx
import React, { useState } from 'react'
import { Check, CheckCircle2, ClipboardIcon } from 'lucide-react'
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

export default function DeleteBlogDialog({
  dialogType,
  showInput,
  setShowInput,
  inputValue,
  setInputValue,
  handleSubmitBlogDeletion,
  deleteBlogMutation,
  dispatch,
  closeModalAdmin,
}) {
  if (dialogType !== 'delete-blog') return null
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('delete')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
      <form onSubmit={handleSubmitBlogDeletion}>
        <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold text-[#dc2626]'>
              Delete Blog
            </DialogTitle>
            <DialogDescription className='text-sm leading-relaxed text-[#64748b]'>
              <span className='text-xl font-bold text-[#1e293b]'>
                Are you sure you want to delete this blog?
              </span>
              <br />
              This action cannot be undone.
            </DialogDescription>
            {showInput && (
              <div className='mt-4 space-y-2'>
                <Label
                  htmlFor='deleteInput'
                  className='text-xs font-semibold text-[#1e293b] sm:text-sm'
                >
                  Please type{' '}
                  <button
                    type='button'
                    onClick={handleCopy}
                    className='inline-flex items-center gap-1 font-bold text-[#ef4444] hover:underline focus:outline-none'
                  >
                    'delete'
                    {copied ? (
                      <Check className='h-3 w-3 text-green-500' />
                    ) : (
                      <ClipboardIcon className='h-3 w-3 text-gray-500' />
                    )}
                  </button>{' '}
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
          </DialogHeader>

          <DialogFooter className='mt-6 flex justify-end space-x-3'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                className='rounded-[8px] border border-[#e2e8f0] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]'
                disabled={deleteBlogMutation.isPending}
                onClick={() => dispatch(closeModalAdmin())}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              size='sm'
              type={inputValue === 'delete' ? 'submit' : 'button'}
              variant='destructive'
              className='transform rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#dc2626] hover:to-[#b91c1c] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)] disabled:transform-none disabled:bg-[#e2e8f0] disabled:text-[#64748b]'
              disabled={
                deleteBlogMutation.isPending ||
                (showInput && inputValue !== 'delete')
              }
              onClick={(e) => {
                if (inputValue === 'delete') {
                  handleSubmitBlogDeletion(e)
                } else {
                  setShowInput((prev) => !prev)
                }
              }}
            >
              {deleteBlogMutation.isPending ? (
                 
                  "Deleting..."

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
