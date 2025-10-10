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
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.info(
                  "This feature will be available in a future update."
                )
              }}
            >
              Activate Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
