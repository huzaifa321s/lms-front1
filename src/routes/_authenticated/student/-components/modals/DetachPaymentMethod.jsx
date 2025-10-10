import React from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { closeModal } from "../../../../../shared/config/reducers/student/studentDialogSlice"

export default function DetachPaymentMethodDialog({ confirmDetach, cardDetach }) {
  const dispatch = useDispatch()

  return (
    <Dialog open onOpenChange={() => dispatch(closeModal())}>
      <form onSubmit={confirmDetach}>
        <DialogContent className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
              Detach Payment Method
            </DialogTitle>
            <DialogDescription className="text-sm text-[#64748b]">
              Are you sure you want to detach this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex-row items-center justify-end gap-3">
            <DialogClose asChild>
              <Button
                size="sm"
                disabled={cardDetach.status === "pending"}
                variant="outline"
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              type="submit"
              onClick={() => cardDetach.mutate()}
              loading={cardDetach.status === "pending"}
              disabled={cardDetach.status === "pending"}
            >
              {cardDetach.status === "pending" ? "Detaching..." : "Detach"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
