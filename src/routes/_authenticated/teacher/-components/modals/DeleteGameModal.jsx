import React, { useState } from 'react'
import { AlertTriangle, Check, CheckCircle2, ClipboardIcon, Trash2 } from 'lucide-react'
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

export default function DeleteGameDialog({
  isOpen,
  closeModalTeacher,
  handleSubmitDeleteGame,
  modalData,
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
    <Dialog open={isOpen} onOpenChange={closeModalTeacher}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!showInput) return setShowInput(true)
          if (
            inputValue === 'delete' &&
            typeof handleSubmitDeleteGame === 'function'
          ) {
            handleSubmitDeleteGame()
          }
        }}
      >
        <DialogContent className='fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-[425px] -translate-x-1/2 -translate-y-1/2 transform'>
          {/* Glow effect */}
          <div className='pointer-events-none absolute -inset-1 animate-pulse rounded-[12px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-30' />

          {/* Modal content */}
          <div className='relative rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
            <DialogHeader className='p-4 sm:p-6'>
              <div className='flex items-center space-x-3'>
                <div className='rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2'>
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className='text-base font-bold text-[#1e293b] sm:text-lg md:text-xl'>
                  Delete Game
                </DialogTitle>
              </div>

              <DialogDescription className='mt-4 space-y-4 text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e2e8f0] bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 shadow-md'>
                 <Trash2 className="h-8 w-8 text-[#ef4444]" />
                </div>

                <span className='block text-lg font-bold text-[#1e293b] sm:text-xl'>
                  Are you sure you want to delete this game?
                </span>
                <p className='text-xs text-[#64748b] sm:text-sm'>
                  This action cannot be undone.
                </p>

                <div className='rounded-[8px] border border-[#e2e8f0] bg-white p-4 shadow-sm'>
                  <span className='mb-1 inline-block rounded-full bg-[#2563eb]/10 px-2 py-1 text-xs font-semibold text-[#2563eb] sm:text-sm'>
                    Question
                  </span>
                  <p className='line-clamp-2 text-xs font-medium text-[#1e293b] sm:text-sm'>
                    {modalData?.gameDetails?.question ||
                      'No question available'}
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            {/* Input area */}
            {showInput && (
              <div className='space-y-2 p-4 sm:p-6'>
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
                    className='w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-xs placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 sm:text-sm'
                  />
                  {inputValue === 'delete' && (
                    <div className='absolute top-1/2 right-3 -translate-y-1/2'>
                      <CheckCircle2 className='h-5 w-5 text-[#10b981]' />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <DialogFooter className='flex flex-col gap-2 p-4 sm:flex-row sm:gap-3 sm:p-6'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={closeModalTeacher}
                  className='w-full rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] shadow-sm hover:bg-[#e2e8f0] hover:shadow-md sm:w-auto'
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                size='sm'
                type='button'
                variant='destructive'
                disabled={showInput && inputValue !== 'delete'}
                onClick={() => {
                  if (!showInput) return setShowInput(true)
                  if (
                    inputValue === 'delete' &&
                    typeof handleSubmitDeleteGame === 'function'
                  ) {
                    handleSubmitDeleteGame()
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
