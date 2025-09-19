import axios from "axios"
import { format } from "date-fns"
import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconArrowLeftToArc } from "@tabler/icons-react"
import { ArrowLeft, Download, Mail, PrinterIcon } from "lucide-react"

const queryClient = new QueryClient()

const invoiceQueryOption = (invoiceID) =>
  queryOptions({
    queryKey: ["getInvoice", invoiceID],
    queryFn: async () => {
      try {
        const response = await axios.get(`/student/payment/get-invoices/${invoiceID}`)
        if (response.data.success) {
          console.log('response.data.data ====>',response.data)
          return { invoiceDetails: response.data.data }
        }
        return { invoiceDetails: null }
      } catch (error) {
        console.error("Error fetching invoice details:", error)
        return { invoiceDetails: null }
      }
    },
  })

export const Route = createFileRoute("/student/setting/invoices/invoice-details/$invoiceID")({
  component: InvoiceDetails,
  loader: ({ params }) => queryClient.ensureQueryData(invoiceQueryOption(params.invoiceID)),
})

function InvoiceDetails() {
  const { invoiceID } = useParams({
    from: "/student/setting/invoices/invoice-details/$invoiceID",
  })
  const { data } = useSuspenseQuery(invoiceQueryOption(invoiceID))
  const { invoiceDetails } = data

  const PRICE_MAP = {
    price_1P6ep6EdtHnRsYCMarT5ATUq: "Bronze Plan",
    price_1P6eq0EdtHnRsYCMGORU2F9n: "Silver Plan",
    price_1P6eqPEdtHnRsYCMSV1ln2lh: "Gold Plan",
    price_1PUXjiEdtHnRsYCMTMgc8M7S: "Daily Plan",
  }

  if (!invoiceDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[12px] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
            Invoice not found.
          </h1>
        </div>
      </div>
    )
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
    <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10">
      <Card className="bg-[#ffffff] border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:border-[#cbd5e1] transition-all duration-300 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="lg"
                className="bg-[#ffffff] border border-[#e2e8f0] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] text-[#2563eb] hover:bg-[#e2e8f0] hover:scale-105 transition-all duration-300"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={20} className="mr-2" />
                Go Back
              </Button>
              <div className="text-sm text-[#64748b]">
                <span>Invoices</span> <span className="mx-2">/</span>{" "}
                <span className="font-semibold">#{invoiceDetails.id.slice(-8)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-none text-white rounded-[8px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-200"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-none text-white rounded-[8px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-200"
              >
                <PrinterIcon size={16} className="mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-none text-white rounded-[8px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-200"
              >
                <Mail size={16} className="mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Invoice Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[12px] flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  Invoice #{invoiceDetails.id.slice(-8)}
                </h1>
                <p className="text-[#64748b] mt-2 font-medium">
                  Complete payment information and transaction history
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Status status={invoiceDetails?.payment_intent?.status === "succeeded" ? "Paid" : "Pending"}>
                <StatusIndicator status={invoiceDetails?.payment_intent?.status === "succeeded" ? "Paid" : "Pending"} />
                <StatusLabel value={invoiceDetails?.payment_intent?.status === "succeeded" ? "Paid" : "Pending"} />
              </Status>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#1e293b]">${invoiceDetails?.amount_paid / 100}</div>
                <div className="text-sm text-[#64748b]">Total Amount</div>
              </div>
            </div>
          </div>

          {/* Customer Section */}
          <div>
            <CardTitle className="mb-6 text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              Customer
              <div className="ml-auto">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              </div>
            </CardTitle>
            <div className="space-y-3">
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Name:</span>
                <span className="text-[#1e293b] font-medium">{invoiceDetails?.customer?.name}</span>
              </p>
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Email:</span>
                <span className="text-[#1e293b] font-medium truncate">{invoiceDetails?.customer_email}</span>
              </p>
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Plan:</span>
                <span className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {PRICE_MAP[invoiceDetails?.subscription?.plan.id] || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Invoice Details Section */}
          <div>
            <CardTitle className="mb-6 text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Invoice
            </CardTitle>
            <div className="space-y-3">
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">ID:</span>
                <span className="text-[#1e293b] font-mono text-sm">{invoiceDetails?.id}</span>
              </p>
              <div className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Status:</span>
                <Status
                  status={invoiceDetails?.payment_intent?.status === "succeeded" ? "Paid" : "Pending"}
                  key={"Paid"}
                >
                  <StatusIndicator />
                  <StatusLabel value={invoiceDetails?.payment_intent?.status === "succeeded" ? "Paid" : "Pending"} />
                </Status>
              </div>
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Date:</span>
                <span className="text-[#1e293b] font-medium">
                  {format(new Date(invoiceDetails?.created * 1000), "PPP")}
                </span>
              </p>
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Account:</span>
                <span className="text-[#1e293b] font-medium">{invoiceDetails?.account_name}</span>
              </p>
              <p className="flex justify-between items-center p-3 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Currency:</span>
                <span className="text-[#1e293b] font-bold uppercase">{invoiceDetails?.currency}</span>
              </p>
            </div>
          </div>

          {/* Amount Details Section */}
          <div>
            <CardTitle className="mb-6 text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              Amount Details
            </CardTitle>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444]/20 rounded-[8px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#ef4444]/10 rounded-full -mr-8 -mt-8 opacity-50"></div>
                <p className="flex justify-between items-center relative z-10">
                  <span className="font-semibold text-[#ef4444]">Amount Due:</span>
                  <span className="text-[#1e293b] font-bold text-lg">${invoiceDetails?.amount_due / 100}</span>
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20 rounded-[8px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#10b981]/10 rounded-full -mr-8 -mt-8 opacity-50"></div>
                <p className="flex justify-between items-center relative z-10">
                  <span className="font-semibold text-[#10b981]">Amount Paid:</span>
                  <span className="text-[#1e293b] font-bold text-lg">${invoiceDetails?.amount_paid / 100}</span>
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 border border-[#2563eb]/20 rounded-[8px] text-center">
                <span className="text-[#2563eb] font-semibold text-sm">Balance: </span>
                <span className="text-[#1e293b] font-bold">
                  ${(invoiceDetails?.amount_due - invoiceDetails?.amount_paid) / 100}
                </span>
              </div>
            </div>
          </div>

          {/* Items Purchased Section */}
          <div>
            <CardTitle className="mb-6 text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Items Purchased
              <div className="ml-2 bg-[#f59e0b]/10 text-[#f59e0b] px-2 py-1 rounded-full text-xs font-bold">
                {invoiceDetails?.lines?.data.length} item{invoiceDetails?.lines?.data.length !== 1 ? "s" : ""}
              </div>
            </CardTitle>
            <div className="grid gap-4 md:grid-cols-2">
              {invoiceDetails?.lines?.data.map((d, i) => (
                <CardContent
                  key={i}
                  className="p-5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-[8px] shadow-inner hover:bg-[#e2e8f0] transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#1e293b]">Item #{i + 1}</span>
                    </div>
                    <p className="flex justify-between items-center p-2 bg-[#ffffff] rounded-[8px]">
                      <span className="font-semibold text-[#64748b]">Plan:</span>
                      <span className="text-[#1e293b] font-semibold">{d.price?.product?.name}</span>
                    </p>
                    <p className="flex justify-between items-center p-2 bg-[#ffffff] rounded-[8px]">
                      <span className="font-semibold text-[#64748b]">Amount:</span>
                      <span className="text-[#1e293b] font-bold text-lg">${d.plan?.amount / 100}</span>
                    </p>
                  </div>
                </CardContent>
              ))}
            </div>
          </div>

          {/* Payment Method Section */}
          <div>
            <CardTitle className="mb-6 text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              Payment Method
            </CardTitle>
            <div className="space-y-3">
              <p className="flex justify-between items-center p-4 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Brand:</span>
                <span className="text-[#1e293b] font-bold uppercase tracking-wide">
                  {invoiceDetails?.payment_intent?.payment_method?.card?.brand}
                </span>
              </p>
              <p className="flex justify-between items-center p-4 bg-[#f1f5f9] rounded-[8px]">
                <span className="font-semibold text-[#64748b]">Card:</span>
                <span className="text-[#1e293b] font-mono font-semibold">
                  **** {invoiceDetails?.payment_intent?.payment_method?.card?.last4}
                </span>
              </p>
            </div>
          </div>

          {/* Summary Section */}
          <div>
            <CardTitle className="mb-6 text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Summary
            </CardTitle>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 border border-[#2563eb]/20 rounded-[8px] text-center">
                <p className="text-center">
                  <span className="block text-[#2563eb] font-semibold mb-1">Invoice Date</span>
                  <span className="text-[#1e293b] font-bold">
                    {format(new Date(invoiceDetails?.created * 1000), "PPP")}
                  </span>
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#64748b]/10 to-[#94a3b8]/10 border border-[#64748b]/20 rounded-[8px] text-center">
                <p className="text-center">
                  <span className="block text-[#64748b] font-semibold mb-1">Account</span>
                  <span className="text-[#1e293b] font-bold">{invoiceDetails?.account_name}</span>
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20 rounded-[8px] text-center">
                <p className="text-center">
                  <span className="block text-[#10b981] font-semibold mb-1">Processing Time</span>
                  <span className="text-[#1e293b] font-bold">Instant</span>
                </p>
              </div>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-2">
              Need Help?
            </h3>
            <p className="text-[#64748b] text-sm mb-4">
              If you have any questions about this invoice, please don't hesitate to contact our support team.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-none text-white rounded-[8px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-200"
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] border-none text-white rounded-[8px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-200"
              >
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
)
}