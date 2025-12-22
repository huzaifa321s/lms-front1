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
import { DollarSign } from "lucide-react"
import { useDispatch } from "react-redux"
import { closeModal } from "@/shared/config/reducers/student/studentDialogSlice"

function UpdateSubscriptionDialog({
  handleSubmitUpdation,
  planUpdate,
  modalData,
}) {
  const dispatch = useDispatch()
  return (
    <Dialog open onOpenChange={() => dispatch(closeModal())}>
      <form onSubmit={handleSubmitUpdation}>
        <DialogContent className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
              <DollarSign className="h-6 w-6 text-[#2563eb]" />
              Update Your Plan
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-[#64748b]">
              Are you sure you want to change your plan to{" "}
              <span className="font-semibold text-[#1e293b]">
                {modalData?.selectedPlan}
              </span>
              ? We'll use your default card for the payment.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3 pt-6">
            <DialogClose asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={planUpdate.status === "pending"}
                onClick={() => dispatch(closeModal())}

              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              type="submit"
              loading={planUpdate.status === "pending"}
              disabled={planUpdate.status === "pending"}
              onClick={handleSubmitUpdation}
            >
              {planUpdate.status === "pending" ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}


export default UpdateSubscriptionDialog