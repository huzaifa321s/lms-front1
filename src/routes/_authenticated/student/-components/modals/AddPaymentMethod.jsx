import React from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { closeModal } from "../../../../../shared/config/reducers/student/studentDialogSlice"
import { CardElement } from "@stripe/react-stripe-js"

export default function AddPaymentMethodDialog({
  handleSubmitCard,
  cardElementOptions,
  handleChange,
  defaultCheck,
  setDefaultCheck,
  stripe,
  cardComplete,
  saveCardDetailsMutation
}) {
  const dispatch = useDispatch()

  return (
    <Dialog open onOpenChange={() => dispatch(closeModal())}>
      <form onSubmit={handleSubmitCard}>
        <DialogContent className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
              Add Payment Method
            </DialogTitle>
          </DialogHeader>

          <CardElement
            options={cardElementOptions}
            onChange={handleChange}
          />

          <div className="mt-4 flex items-center gap-3">
            <Label className="font-medium text-[#64748b]">Set as Default</Label>
            <Input
              type="checkbox"
              checked={defaultCheck}
              className="h-5 w-5 rounded-[8px] border border-[#e2e8f0] shadow-none"
              onChange={() => setDefaultCheck(prev => !prev)}
            />
          </div>

          <DialogFooter className="mt-6 flex-row items-center justify-end gap-3">
            <DialogClose asChild>
              <Button
                size="sm"
                disabled={saveCardDetailsMutation.status === "pending"}
                variant="outline"
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              size="sm"
              loading={saveCardDetailsMutation.status === "pending"}
              disabled={
                saveCardDetailsMutation.status === "pending" ||
                !stripe ||
                !cardComplete
              }
              onClick={handleSubmitCard}
            >
              {saveCardDetailsMutation.status === "pending" ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
