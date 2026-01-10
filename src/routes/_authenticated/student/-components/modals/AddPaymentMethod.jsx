import React, { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { closeModal } from "@/shared/config/reducers/student/studentDialogSlice"
import { paymentMethodsQueryOptions } from '../../payment-methods'

export default function AddPaymentMethodDialog() {
  const dispatch = useDispatch()
  const stripe = useStripe()
  const elements = useElements()
  const queryClient = useQueryClient()

  const [defaultCheck, setDefaultCheck] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        marginTop: '5px',
        marginBottom: '5px',
        color: '#000',
        '::placeholder': {
          color: '#000',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  const handleChange = (event) => {
    setCardComplete(event.complete)
  }

  const saveCardDetails = useCallback(async () => {
    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    console.log('Creating token...')
    const { token, error: tokenError } = await stripe.createToken(cardElement)
    if (tokenError) {
      console.error('Token Error:', tokenError)
      toast.error(tokenError.message)
      return
    }
    console.log('Token created:', token.id)

    console.log('Creating payment method...')
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: 'card',
      card: { token: token.id },
    })

    if (pmError) {
      toast.error(pmError.message)
      return
    }

    const reqBody = {
      paymentMethodId: paymentMethod.id,
      setDefaultPaymentMethodFlag: defaultCheck,
    }

    try {
      let response = await axios.post(
        '/student/payment/add-new-payment-method',
        reqBody
      )
      response = response.data
      if (response.success) {
        toast.success(response.message)
        await queryClient.invalidateQueries(paymentMethodsQueryOptions())
        dispatch(closeModal())
      }
    } catch (error) {
      console.log('Registration Error --> ', error)
      toast.error('Something went wrong')
    }
  }, [
    stripe,
    elements,
    defaultCheck,
    queryClient,
    dispatch,
  ])

  const saveCardDetailsMutation = useMutation({
    mutationFn: saveCardDetails,
  })

  const handleSubmitCard = (e) => {
    e.preventDefault()
    console.log('Submission triggered')
    saveCardDetailsMutation.mutate()
  }

  return (
    <Dialog open onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] sm:max-w-[425px]">
        <form onSubmit={handleSubmitCard}>
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
                type="button"
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
            >
              {saveCardDetailsMutation.status === "pending" ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
