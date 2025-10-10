// LazyDeleteBlogDialog.jsx
import React, { useState } from 'react'

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
import {
  Trash2,
  AlertTriangle,
  ClipboardIcon,
  CheckCircle2,
  Check,
  XCircle,
} from 'lucide-react'
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
            <DialogTitle className='flex items-center gap-2 text-lg font-semibold text-[#dc2626]'>
              <Trash2 className='h-5 w-5 text-[#dc2626]' />
              Delete Blog
            </DialogTitle>

            <DialogDescription className='mt-2 text-sm leading-relaxed text-[#64748b]'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='mt-[2px] h-5 w-5 text-[#facc15]' />
                <div>
                  <span className='text-xl font-bold text-[#1e293b]'>
                    Are you sure you want to delete this blog?
                  </span>
                  <br />
                  This action cannot be undone.
                </div>
              </div>
            </DialogDescription>

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
                    variant=""
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
          </DialogHeader>

          <DialogFooter className='mt-6 flex justify-end space-x-3'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                disabled={deleteBlogMutation.isPending}
                onClick={() => dispatch(closeModalAdmin())}
              >
                <XCircle className='h-4 w-4 text-[#64748b]' />
                Cancel
              </Button>
            </DialogClose>

            <Button
              size='sm'
              type={inputValue === 'delete' ? 'submit' : 'button'}
              variant='destructive'
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
              <Trash2 className='h-4 w-4 text-white' />
              {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
