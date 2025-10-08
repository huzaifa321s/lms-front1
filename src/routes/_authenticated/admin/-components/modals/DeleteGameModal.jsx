import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, AlertTriangle, Info, Check, ClipboardIcon } from 'lucide-react'

export default function DeleteGameDialog({ dialogOpen, closeModalAdmin, modalData, deleteGameMutation }) {
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
          if (showInput && inputValue === 'delete') {
            deleteGameMutation.mutate()
          } else {
            setShowInput(true)
          }
        }}
      >
        <DialogContent className="bg-card text-card-foreground mx-4 overflow-hidden rounded-lg border shadow-lg sm:max-w-[500px]">
          <DialogHeader className="border-b p-6">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="bg-destructive/10 text-destructive rounded-md p-3">
                <Trash2 className="h-6 w-6" />
              </div>
              Delete Game
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {/* Warning Banner */}
            <div className="rounded-lg border border-yellow-300 bg-yellow-100 p-4 text-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="mb-1 text-lg font-bold">
                    Are you sure you want to delete this game?
                  </p>
                  <p className="text-sm">
                    This action cannot be undone and will permanently remove all game data.
                  </p>
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="bg-muted/30 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Info className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="mb-2 font-semibold">Game Question:</p>
                  <p className="bg-background rounded-lg border p-3 leading-relaxed break-words">
                    "{modalData?.gameDetails?.question}"
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            {showInput && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <div className="bg-destructive/10 border-destructive rounded-lg border p-4">
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
                  <Input
                    id="deleteInput"
                    type="text"
                    placeholder="Type 'delete' here..."
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="bg-muted/30 border-t p-6">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={closeModalAdmin}
                  className="order-2 w-full sm:order-1 sm:w-auto"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type={inputValue === 'delete' ? 'submit' : 'button'}
                variant="destructive"
                disabled={
                  (showInput && inputValue !== 'delete') ||
                  deleteGameMutation.status === 'pending'
                }
                onClick={() => {
                  if (showInput && inputValue === 'delete') {
                    deleteGameMutation.mutate()
                  } else {
                    setShowInput((prev) => !prev)
                  }
                }}
                loading={deleteGameMutation.status === 'pending'}
                className="order-1 w-full min-w-[140px] sm:order-2 sm:w-auto"
              >
                {deleteGameMutation.status === 'pending'
                  ? 'Deleting...'
                  : !showInput
                  ? 'Delete Game'
                  : inputValue === 'delete'
                  ? 'Confirm Delete'
                  : 'Delete Game'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
