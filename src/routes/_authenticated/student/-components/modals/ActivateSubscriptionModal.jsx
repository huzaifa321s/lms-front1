import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ActivateSubscriptionDialog({ closeModal }) {
  return (
    <Dialog
      open
      onOpenChange={() => {
        closeModal()
      }}
    >
      <DialogContent className="mx-auto max-w-md rounded-[8px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
            Activate Subscription
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <p className="mb-6 text-lg text-[#64748b]">
            Your subscription is not active. Please activate your plan to
            continue accessing premium features.
          </p>

          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={closeModal}
              className="rounded-[8px] text-[#64748b] transition-all duration-300 hover:bg-green-50 hover:text-green-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.info(
                  "This feature will be available in a future update."
                )
              }}
              className="rounded-[8px] bg-gradient-to-r from-green-600 to-emerald-600 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
            >
              Activate Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
