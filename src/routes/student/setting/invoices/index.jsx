import axios from 'axios'
import { createFileRoute } from '@tanstack/react-router'
import {
  invoicesSchema,
} from '../../../_authenticated/student/features/tasks/-components/columns'
const DataTable = lazy(() => import("../../../_authenticated/student/features/tasks/-components/data-table"))


import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Receipt, FileText, DollarSign, Calendar, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { lazy, Suspense } from 'react'
import { DataTableSkeleton } from '../../../-components/DataTableSkeleton'

const queryClient = new QueryClient();
export const invoicesQueryOption = (length) =>
  queryOptions({
    queryKey: ['get-invoices'],
    queryFn: async () => {

      try {
        let response = await axios.get(`/student/payment/get-invoices?length=${length}`)
        response = response.data
        if (response.success) {
          return response.data
        }
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
  })

export const Route = createFileRoute(
  '/student/setting/invoices/'
)({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(invoicesQueryOption())
})

function RouteComponent() {
  const { data, fetchStatus } = useSuspenseQuery(invoicesQueryOption());
  const invoices = data?.invoices
  console.log('data 22 ==>', data)

  // Calculate some stats for the header cards
  const totalInvoices = invoices?.length || 0;
  const totalAmount = invoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
  const paidInvoices = invoices?.filter(invoice => invoice.status === 'paid')?.length || 0;
  const pendingInvoices = totalInvoices - paidInvoices;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className='p-6 lg:p-8 space-y-8'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3'>
            <div className='p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg'>
              <Receipt className="w-8 h-8 text-white" />
            </div>
            Invoice Management
          </h1>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
            Track and manage all your payment invoices in one place
          </p>

          {/* Decorative separator */}
          <div className='w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mt-4'></div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Total Invoices */}
          <div className='backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300 group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 font-medium mb-1'>Total Invoices</p>
                <p className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  {totalInvoices}
                </p>
              </div>
              <div className='p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl group-hover:shadow-lg transition-all duration-300'>
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className='backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300 group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 font-medium mb-1'>Total Amount</p>
                <p className='text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent'>
                  ${totalAmount.toLocaleString()}
                </p>
              </div>
              <div className='p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl group-hover:shadow-lg transition-all duration-300'>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Paid Invoices */}
          <div className='backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300 group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 font-medium mb-1'>Paid</p>
                <p className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                  {paidInvoices}
                </p>
              </div>
              <div className='p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl group-hover:shadow-lg transition-all duration-300'>
                <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Invoices */}
          <div className='backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl border border-white/20 p-6 hover:shadow-3xl transition-all duration-300 group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 font-medium mb-1'>Pending</p>
                <p className='text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
                  {pendingInvoices}
                </p>
              </div>
              <div className='p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl group-hover:shadow-lg transition-all duration-300'>
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <Button >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button
            variant="outline"

          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Main Content Card */}
        <div className='backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-300'>
          <div className='p-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3'>
                <div className='p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl'>
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                All Invoices
              </h2>

              <div className='text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm'>
                {totalInvoices} total records
              </div>
            </div>

            {/* Decorative separator */}
            <div className='w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent mb-6'></div>
          </div>

          <div className='relative min-h-[500px]'>
            {invoices && invoices.length > 0 ? (
              <Suspense fallback={<DataTableSkeleton />}>

                <DataTable
                  data={invoices}
                  columns={invoicesSchema}
                  fetchStatus={fetchStatus}
                />
              </Suspense>
            ) : (
              <div className='flex flex-col items-center justify-center py-20 px-8'>
                <div className='p-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-8'>
                  <Receipt size={64} className="text-gray-400" />
                </div>
                <h3 className='text-2xl font-semibold text-gray-600 mb-3'>No Invoices Found</h3>
                <p className='text-gray-500 text-center max-w-md mb-6'>
                  You don't have any invoices yet. When you make purchases or payments, they will appear here.
                </p>
                <Button >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className='backdrop-blur-md bg-white/30 rounded-3xl shadow-2xl border border-white/20 p-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='text-center md:text-left'>
              <p className='text-gray-600 text-sm mb-1'>Last updated</p>
              <p className='font-semibold text-gray-800'>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className='flex items-center gap-6'>
              <div className='text-center'>
                <p className='text-sm text-gray-600 mb-1'>Payment Success Rate</p>
                <p className='text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent'>
                  {totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}%
                </p>
              </div>

              <div className='w-px h-8 bg-gray-300'></div>

              <div className='text-center'>
                <p className='text-sm text-gray-600 mb-1'>Average Amount</p>
                <p className='text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  ${totalInvoices > 0 ? Math.round(totalAmount / totalInvoices) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}