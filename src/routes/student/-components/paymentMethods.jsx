
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import { Delete } from "lucide-react"

const PaymentMethods = ({
  paymentMethods,
  fetchStatus,
  selectPaymentMethod,
  selectedPaymentMethod,
  cardDefault,
  dispatch,
  openModal,
  queryOptions
}) => {
  const queryClient = useQueryClient()

  return (
    <>
      <ul className="space-y-3">
        {paymentMethods.map((pm, k) => {
          const isSelected = selectedPaymentMethod === pm.paymentMethodId

          return (
            <li
              key={k}
              className={`
                  flex w-full max-w-none justify-between gap-4 rounded-2xl p-5
                  bg-white/90 backdrop-blur-xl border border-slate-200/50
                  shadow-lg shadow-slate-500/10 hover:shadow-xl hover:shadow-slate-500/20
                  transition-all duration-300 hover:-translate-y-1
                  ${fetchStatus === "fetching" ? "bg-slate-100/30 animate-pulse" : ""}
                  ${isSelected ? "ring-2 ring-blue-400/50 bg-blue-50/20" : ""}
                `}
            >
              <div className="flex items-center gap-4 flex-1">
                <Input
                  type="radio"
                  size="xs"
                  name={`radio-${k}`}
                  className="radio checked:bg-blue-600 accent-blue-600 w-5 h-5 cursor-pointer"
                  value={pm.paymentMethodId}
                  checked={isSelected}
                  onChange={selectPaymentMethod}
                />

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-700 min-w-[80px]">{pm.brand}</span>

                    <span className="font-mono text-slate-600 font-medium">**** {pm.last4}</span>

                    {pm.isDefault && <Badge className="bg-blue-100 text-blue-700 border-blue-200">Default</Badge>}

                    <div className="text-xs text-slate-600/80 text-center">
                      <div className="font-medium">Expires</div>
                      <div className="font-mono font-semibold">{pm.expiry}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {!pm.isDefault && isSelected && (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={cardDefault.status === "pending"}
                    disabled={cardDefault.status === "pending"}
                    onClick={() => cardDefault.mutate({ paymentMethodId: pm.paymentMethodId, queryClient, queryOptions })}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  >
                    Set Default
                  </Button>
                )}

                {paymentMethods.length > 1 && isSelected && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                    onClick={() => {
                      dispatch(
                        openModal({
                          type: "detach-payment-method",
                          props: {
                            paymentMethodId: pm.paymentMethodId,
                            queryKey: ["student-payment-methods"],
                          },
                        }),
                      )
                    }}
                  >
                    <Delete />
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default PaymentMethods
