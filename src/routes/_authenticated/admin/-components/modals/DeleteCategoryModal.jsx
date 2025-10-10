import React, { useState } from 'react'
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Check,
  ClipboardIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DeleteCategoryDialog({
  dialogOpen,
  closeModalAdmin,
  dialogType,
  modalData,
  handleSubmitDeleteCategory,
  deleteBlogCategoryMutation,
}) {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('delete')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={closeModalAdmin}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (
            typeof handleSubmitDeleteCategory === 'function' &&
            inputValue === 'delete'
          ) {
            handleSubmitDeleteCategory(e)
          }
        }}
      >
        <DialogContent className='bg-card text-card-foreground overflow-hidden rounded-lg border shadow-lg sm:max-w-[425px]'>
          <DialogHeader className='border-b p-6'>
            <div className='flex items-center space-x-3'>
              <div className='bg-destructive/10 text-destructive rounded-md p-2'>
                <AlertTriangle className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <DialogTitle className='text-lg leading-tight font-semibold'>
                Delete Category
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className='space-y-4 p-6'>
            {/* Warning icon */}
            <div className='text-center'>
              <div className='bg-destructive/10 text-destructive border-destructive mx-auto flex h-16 w-16 items-center justify-center rounded-full border'>
                <Trash2 className='h-8 w-8' />
              </div>
            </div>

            {/* Warning text */}
            <div className='space-y-2 text-center'>
              <span className='text-base font-semibold'>
                Are you sure you want to delete this category?
              </span>
              <p className='text-muted-foreground text-sm'>
                This action cannot be undone.
              </p>
            </div>

            {/* Category details */}
            <div className='bg-muted/30 rounded-lg border p-4'>
              <div className='space-y-3'>
                <div>
                  <Badge className='mb-2'>Category</Badge>
                  <p className='line-clamp-2 text-sm font-medium'>
                    {modalData?.confirmQuestion ||
                      'No category question available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Input area */}
            {showInput && (
              <div className='animate-in slide-in-from-top flex flex-col gap-3 duration-300'>
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
                    value={inputValue || ''}
                    onChange={(e) => setInputValue(e.target.value)}
                    className='w-full'
                  />
                  {inputValue === 'delete' && (
                    <div className='absolute top-1/2 right-3 -translate-y-1/2 text-green-500'>
                      <CheckCircle2 className='h-5 w-5' />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className='flex flex-col gap-3 p-6 pt-0 sm:flex-row'>
            <DialogClose asChild>
              <Button
                variant='outline'
                disabled={deleteBlogCategoryMutation.status === 'pending'}
                onClick={closeModalAdmin}
                className='w-full sm:w-auto'
              >
                Cancel
              </Button>
            </DialogClose>

            {(dialogType === 'confirm-delete-blog-category' ||
              dialogType === 'confirm-game-delete-category') && (
              <Button
                type='button'
                variant='destructive'
                disabled={
                  deleteBlogCategoryMutation.status === 'pending' ||
                  (showInput && inputValue !== 'delete')
                }
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!showInput) {
                    setShowInput(true)
                  } else if (inputValue === 'delete') {
                    handleSubmitDeleteCategory(e)
                  }
                }}
                
              >
                {deleteBlogCategoryMutation.status === 'pending' ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className='h-4 w-4' />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
