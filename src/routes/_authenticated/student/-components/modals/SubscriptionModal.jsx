import React from 'react'
import { CreditCard } from 'lucide-react'
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

export default function SubscriptionDialog({
  handleGoToSubscription,
  planUpdate,
  closeModal,
  navigate,
  modalData,
}) {
  return (
    <Dialog
      open
      onOpenChange={() => {
        closeModal()
        navigate({ to: '/student/' })
      }}
    >
      <form onSubmit={handleGoToSubscription}>
        <DialogContent className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]'>
          <DialogHeader className='flex flex-col items-center text-center'>
            <div className='rounded-full bg-[#10b981]/10 p-3'>
              <CreditCard className='h-8 w-8 text-[#10b981]' />
            </div>
            <DialogTitle className='mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
              {modalData?.title || 'Subscribe to get access'}
            </DialogTitle>
            <DialogDescription className='mt-2 text-sm text-[#64748b]'>
              Upgrade your account to unlock premium features, including
              enrolled courses, quizzes, and more. <br />
              Choose a plan that fits you best — we’ll use your default payment
              method to process the subscription.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className='flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end'>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                disabled={planUpdate.status === 'pending'}
                onClick={() => {
                  closeModal()
                  navigate({ to: '/student/' })
                }}
                className='rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]'
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              size='sm'
              type='submit'
              loading={planUpdate.status === 'pending'}
              disabled={planUpdate.status === 'pending'}
              onClick={handleGoToSubscription}
              className='rounded-[8px] bg-gradient-to-r from-[#10b981] to-[#059669] px-5 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
            >
              {planUpdate.status === 'pending' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
