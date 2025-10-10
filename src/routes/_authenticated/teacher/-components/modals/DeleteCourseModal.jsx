import React, { useState } from 'react'
import { Check, CheckCircle2, ClipboardIcon, Trash } from 'lucide-react'
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

export default function DeleteCourseDialog({
  isOpen,
  closeModalTeacher,
  handleSubmitDeletion,
  modalData,
}) {
  const [showInput, setShowInput] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  console.log('modalData course', modalData)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('delete')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Dialog open={isOpen} onOpenChange={closeModalTeacher}>
      <form
        onSubmit={(e) => {
          console.log('e', e)
          e.preventDefault()
          if (!showInput) return setShowInput(true)
          if (inputValue === 'delete') {
            handleSubmitDeletion()
          }
        }}
      >
        <DialogContent className='fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-[425px] -translate-x-1/2 -translate-y-1/2 transform'>
          {/* Glow effect */}
          <div className='pointer-events-none absolute -inset-1 animate-pulse rounded-[12px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-30 blur-lg' />

          <div className='relative rounded-[12px] border border-[#e2e8f0] bg-white shadow-sm'>
            <DialogHeader className='p-4 sm:p-6'>
              <div className='flex items-center space-x-2 sm:space-x-3'>
                <div className='rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-1.5 sm:p-2'>
                  {/* Warning Icon */}
                  <svg
                    className='h-5 w-5 text-white sm:h-6 sm:w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                </div>
                <DialogTitle className='text-base font-bold text-[#1e293b] sm:text-lg md:text-xl'>
                  Delete Course
                </DialogTitle>
              </div>

              <DialogDescription className='mt-3 space-y-3 text-center sm:mt-4 sm:space-y-4'>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#e2e8f0] bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 shadow-md sm:h-16 sm:w-16'>
                  <svg
                    className='h-6 w-6 text-[#ef4444] sm:h-8 sm:w-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </div>

                <div className='space-y-1 sm:space-y-2'>
                  <span className='text-base font-bold text-[#1e293b] sm:text-lg md:text-xl'>
                    Are you sure you want to delete this course?
                  </span>
                  <p className='text-xs text-[#64748b] sm:text-sm'>
                    This action cannot be undone.
                  </p>
                </div>

                <div className='rounded-[8px] border border-[#e2e8f0] bg-white p-3 shadow-sm sm:p-4'>
                  <div className='space-y-2 sm:space-y-3'>
                    <div>
                      <span className='mb-1 inline-block rounded-full bg-[#2563eb]/10 px-2 py-1 text-xs font-semibold text-[#2563eb] sm:text-sm'>
                        Title
                      </span>
                      <p className='line-clamp-2 text-xs font-medium text-[#1e293b] sm:text-sm'>
                        {modalData?.courseDetails?.name || 'No title available'}
                      </p>
                    </div>
                    <div>
                      <span className='mb-1 inline-block rounded-full bg-[#f59e0b]/10 px-2 py-1 text-xs font-semibold text-[#f59e0b] sm:text-sm'>
                        Description
                      </span>
                      <p className='line-clamp-2 text-xs text-[#64748b] sm:text-sm'>
                        {modalData?.courseDetails?.desc ||
                          'No description available'}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            {showInput && (
              <div className='space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6'>
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
                    className='rounded-[8px] border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm'
                  />
                  {inputValue === 'delete' && (
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 transform sm:right-3'>
                      <CheckCircle2 className='h-4 w-4 text-[#10b981] sm:h-5 sm:w-5' />
                    </div>
                  )}
                  <div className='mt-1 text-xs text-[#94a3b8]'>
                    {inputValue.length}/6 characters
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className='flex flex-col gap-2 p-4 pt-0 sm:flex-row sm:gap-3 sm:p-6'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={closeModalTeacher}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                size='sm'
                onClick={() => {
                  if (!showInput) return setShowInput(true)
                  if (inputValue === 'delete') {
                    handleSubmitDeletion()
                  }
                }}
                type='submit'
                variant='destructive'
                disabled={showInput && inputValue !== 'delete'}
                className='flex w-full items-center justify-center space-x-1 rounded-[8px] bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 text-[#ef4444] shadow-sm transition-all duration-200 hover:from-[#ef4444]/20 hover:to-[#dc2626]/20 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#ef4444] disabled:cursor-not-allowed disabled:bg-[#e2e8f0] disabled:text-[#64748b] sm:w-auto sm:space-x-2'
              >
           <Trash/>
                <span>Delete</span>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
