import React, { Suspense, useEffect, useState } from 'react'
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  CheckCircle,
  Calendar,
  CreditCard,
  User,
  Hash,
  DollarSign,
  Clock,
  XCircle,
  Eye,
  Download,
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { LoaderThree } from '@/components/ui/loader'

const queryClient = new QueryClient()

const invoicesQueryOption = {
  queryKey: ['get-invoices'],
  queryFn: async ({ pageParam = 1 }) => {
    const res = await axios.get(`/student/payment/get-invoices?page=${pageParam}`)
    // API response structure: { success: true, message: "...", data: { invoices: [], has_more: true } }
    if (res.data.success) {
      return res.data.data // Return { invoices: [], has_more: true }
    } else {
      throw new Error('Failed to fetch invoices')
    }
  },
  getNextPageParam: (lastPage) => {
    // Early return if no lastPage (prevents undefined errors during initial render)
    if (!lastPage) {
      return undefined
    }
    if (lastPage?.has_more) {
      const invoices = lastPage.invoices || []
      if (invoices.length > 0) {
        const lastInvoice = invoices[invoices.length - 1]
        return lastInvoice?.invoice_id
      }
    }
    return undefined
  },
}
export const Route = createFileRoute('/_authenticated/student/invoices/')({
  loader: async () => {
    await queryClient.ensureInfiniteQueryData(invoicesQueryOption)
    return null
  },
  component: () => (
    <Suspense fallback={<LoaderThree className="text-[#2563eb]" />}>
      <InvoiceRowCards />
    </Suspense>
  ),
})

function InvoiceRowCards() {
  const { ref, inView } = useInView()
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    revenue: 0,
  })

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    ...invoicesQueryOption,
    suspense: true,
  })

  const invoices = data?.pages?.flatMap((page) => page.invoices) || []

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/student/payment/get-invoices-stats')
        if (response.data.success) {
          setStats(response.data.data)
        }
      } catch (err) {
        console.error('Stats API error:', err)
      }
    }
    fetchStats()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-[#10b981]" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-[#f59e0b]" />
      case 'Overdue':
        return <XCircle className="h-4 w-4 text-[#ef4444]" />
      default:
        return <Clock className="h-4 w-4 text-[#64748b]" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'from-[#10b981]/10 to-[#059669]/10 border-[#10b981]/20 text-[#10b981]'
      case 'Pending':
        return 'from-[#f59e0b]/10 to-[#d97706]/10 border-[#f59e0b]/20 text-[#f59e0b]'
      case 'Overdue':
        return 'from-[#ef4444]/10 to-[#dc2626]/10 border-[#ef4444]/20 text-[#ef4444]'
      default:
        return 'from-[#f1f5f9] to-[#e2e8f0] border-[#e2e8f0] text-[#64748b]'
    }
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const navigate = useNavigate()

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6 flex items-center justify-center">
        <p className="text-[#ef4444] text-lg">Error loading invoices: {error.message}</p>
      </div>
    )
  }

  return (
     <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Coming Soon Heading */}
        <div className="mb-12 w-full max-w-2xl mx-auto">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-6 text-center">
            <h1 className="text-3xl font-bold text-[#1e293b] font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
              We are working on this page
              <span className="ml-2 inline-block bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Clock className="w-4 h-4 inline mr-1" /> Stay Tuned!
              </span>
            </h1>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent">
            Invoice Management
          </h1>
          <p className="text-lg text-[#64748b]">
            Track and manage all your invoices in one place
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1e293b]">
                {invoices.length}
              </div>
              <div className="text-sm text-[#64748b]">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10b981]">
                {invoices.filter((inv) => inv?.invoice_status === 'Paid').length}
              </div>
              <div className="text-sm text-[#64748b]">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {invoices.filter((inv) => inv?.invoice_status === 'Pending').length}
              </div>
              <div className="text-sm text-[#64748b]">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ef4444]">
                {invoices.filter((inv) => inv?.invoice_status === 'Overdue').length}
              </div>
              <div className="text-sm text-[#64748b]">Overdue</div>
            </div>
            <div className="col-span-2 text-center md:col-span-1">
              <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
                ${invoices.reduce((sum, inv) => sum + (inv?.amount_due || 0) / 100, 0).toFixed(2)}
              </div>
              <div className="text-sm text-[#64748b]">Revenue</div>
            </div>
          </div>
        </div>

        {/* Invoice List Header - Desktop Only */}
        <div className="mb-4 hidden md:block">
          <div className="rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-4">
            <div className="flex items-center justify-between text-sm font-medium text-[#64748b]">
              <div className="flex-1">Invoice Details</div>
              <div className="flex items-center space-x-6">
                <div className="w-20 text-center">Plan Price</div>
                <div className="w-20 text-center">Paid</div>
                <div className="w-20 text-center">Remaining</div>
                <div className="w-32 text-center">Status</div>
                <div className="w-20 text-center">Actions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Row Cards List */}
        <div className="space-y-4">
          {invoices.map((invoice, index) => {
            const isLast = invoices.length === index + 1
            return (
              <div
                key={invoice?.invoice_id}
                className="group mb-4 rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-[#cbd5e1] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
                ref={isLast ? ref : null}
              >
                {/* Mobile Layout */}
                <div className="block space-y-4 md:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-3 w-3 rounded-full shadow-lg"
                        style={{ backgroundColor: invoice?.plan_details?.color || '#64748b' }}
                      ></div>
                      <div>
                        <h3 className="font-bold text-[#1e293b]">
                          {invoice?.plan_details?.name || 'Unknown Plan'}
                        </h3>
                        <p className="font-mono text-sm text-[#64748b]">
                          #{invoice?.invoice_id?.slice(-8) || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-1 rounded-[8px] bg-gradient-to-r px-2 py-1 ${getStatusColor(invoice?.invoice_status)} border`}
                    >
                      {getStatusIcon(invoice?.invoice_status)}
                      <span className="text-xs font-semibold">
                        {invoice?.invoice_status || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-[#1e293b]">
                      {invoice?.plan_details?.price || 'N/A'}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#64748b]">Remaining</div>
                      <div
                        className={`text-lg font-bold ${invoice?.amount_remaining === 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}
                      >
                        ${(invoice?.amount_remaining / 100 || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">
                      Issue: {invoice?.issue_date || 'N/A'}
                    </span>
                    {invoice?.paid_at && (
                      <span className="text-[#10b981]">
                        Paid: {invoice.paid_at}
                      </span>
                    )}
                    {!invoice?.paid_at && invoice?.due_date !== 'N/A' && (
                      <span className="text-[#ef4444]">
                        Due: {invoice.due_date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Row Layout */}
                <div className="hidden items-center justify-between md:flex">
                  {/* Left Section - Invoice Info */}
                  <div className="flex flex-1 items-center space-x-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-4 w-4 rounded-full shadow-lg"
                          style={{ backgroundColor: invoice?.plan_details?.color || '#64748b' }}
                        ></div>
                        <div className="text-sm font-medium text-[#64748b]">
                          #{String(index + 1).padStart(2, '0')}
                        </div>
                      </div>

                      <div>
                        <h3 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-bold text-transparent">
                          {invoice?.plan_details?.name || 'Unknown'} Plan
                        </h3>
                        <p className="font-mono text-sm text-[#64748b]">
                          {invoice?.invoice_id?.slice(-12) || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="hidden lg:block">
                      <div className="mb-1 text-sm text-[#64748b]">Customer ID</div>
                      <div className="font-mono text-sm text-[#1e293b]">
                        {invoice?.customer_id?.slice(-8) || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-sm text-[#64748b]">Issue Date</div>
                      <div className="text-sm font-medium text-[#1e293b]">
                        {invoice?.issue_date || 'N/A'}
                      </div>
                    </div>

                    {invoice?.paid_at && (
                      <div className="hidden lg:block">
                        <div className="mb-1 text-sm text-[#64748b]">Paid Date</div>
                        <div className="text-sm font-medium text-[#10b981]">
                          {invoice.paid_at}
                        </div>
                      </div>
                    )}

                    {!invoice?.paid_at && invoice?.due_date !== 'N/A' && (
                      <div className="hidden lg:block">
                        <div className="mb-1 text-sm text-[#64748b]">Due Date</div>
                        <div className="text-sm font-medium text-[#ef4444]">
                          {invoice.due_date}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Center Section - Amount Details */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="mb-1 text-sm text-[#64748b]">Plan Price</div>
                      <div className="text-xl font-bold text-[#1e293b]">
                        {invoice?.plan_details?.price || 'N/A'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-1 text-sm text-[#64748b]">Amount Paid</div>
                      <div className="text-lg font-semibold text-[#10b981]">
                        ${(invoice?.amount_paid / 100 || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-1 text-sm text-[#64748b]">Remaining</div>
                      <div
                        className={`text-lg font-bold ${invoice?.amount_remaining === 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}
                      >
                        ${(invoice?.amount_remaining / 100 || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center space-x-2 rounded-[8px] bg-gradient-to-r px-4 py-2 ${getStatusColor(invoice?.invoice_status)} border`}
                    >
                      {getStatusIcon(invoice?.invoice_status)}
                      <span className="text-sm font-semibold">
                        {invoice?.invoice_status || 'Unknown'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        className="rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2 text-white transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
                        onClick={() => navigate({ to: `/student/setting/invoices/invoice-details/${invoice?.invoice_id}` })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        className="rounded-[8px] border border-[#e2e8f0] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2 text-white transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {invoices.length > 0 && (
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            className="mt-6 rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02] disabled:bg-[#e2e8f0] disabled:text-[#64748b]"
          >
            {isFetchingNextPage ? 'Loading More...' : hasNextPage ? 'Load More' : 'No More'}
          </Button>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#64748b]">
            Showing {invoices.length} invoices • Last updated:{' '}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
