import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

function CancelSubscriptionDialog({
  handleSubmitCancelation,
  planCancel,
  closeModal,
}) {
  return (
    <Dialog open onOpenChange={closeModal}>
      <form onSubmit={handleSubmitCancelation}>
        <DialogContent className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]">
          <DialogHeader className="flex items-center text-center flex-col">
            <div className="rounded-full bg-[#ef4444]/10 p-3">
              <AlertCircle className="h-8 w-8 text-[#ef4444]" />
            </div>
            <DialogTitle className="mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-[#64748b]">
              Are you sure you want to cancel the subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={planCancel.status === "pending"}
                onClick={closeModal}
                className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#1e293b]"
              >
                Go Back
              </Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              type="submit"
              loading={planCancel.status === "pending"}
              disabled={planCancel.status === "pending"}
              onClick={handleSubmitCancelation}
              className="rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-5 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
            >
              {planCancel.status === "pending" ? "Cancelling..." : "Cancel Your Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default CancelSubscriptionDialog