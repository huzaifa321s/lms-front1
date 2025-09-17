
import { useState } from "react"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContentSection from "../-components/content-section"
import { useAppUtils } from "../../../../../hooks/useAppUtils"
import { openModal } from "../../../../../shared/config/reducers/student/studentDialogSlice"
import { Show } from "../../../../../shared/utils/Show"
import { getSubscriptionStatus, unixToLocaleStr } from "../../../../../shared/utils/helperFunction"
import { setCardAsDefault } from "../../../../../utils/globalFunctions"
import { queryClient } from "../../../../../utils/globalVars"
import PaymentMethods from "../../../../student/-components/paymentMethods"
import { invoicesQueryOption } from "../../../../student/setting/invoices"
import { invoicesSchema } from "../../features/tasks/-components/columns"
import { paymentMethodsQueryOptions } from "../../payment-methods"
import { DataTable } from "../../features/tasks/-components/data-table"

export const Route = createFileRoute("/_authenticated/student/settings/billing/")({
  component: () => (
    <>
      <ContentSection
        title="Billing"
        desc="Manage your subscription plans, payment methods, and view invoices in one place."
      >
        <Billing />
      </ContentSection>
    </>
  ),
  loader: () => {
    queryClient.ensureQueryData(paymentMethodsQueryOptions())
    queryClient.ensureQueryData(invoicesQueryOption(5))
  },
})

const plans = ["daily", "bronze", "silver", "gold"]

function Billing() {
  const { dispatch, router, navigate } = useAppUtils()
  const { data, fetchStatus } = useSuspenseQuery(paymentMethodsQueryOptions())
  const [fetchInvoices, setFetchInvoices] = useState(false)
  const { data: invoicesData } = useSuspenseQuery({
    ...invoicesQueryOption(5),
    enabled: fetchInvoices,
  })
  console.log('invoicesData ==>',invoicesData)
  const invoices = invoicesData?.invoices
  const { paymentMethods, defaultPM } = data
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)
  console.log("subscription ==>", subscription)
  const filteredPlans = plans.filter((p) => p !== subscription?.name?.toLowerCase())
  const remainingCourses = useSelector((state) => state.studentAuth.credentials?.remainingEnrollmentCount)
  const [tabValue, setTabValue] = useState(filteredPlans[0])

  // Select Plan & Payment Method
  const selectPaymentMethod = (e) => {
    setSelectedPaymentMethod(e.target.value)
  }

  const cardDefault = useMutation({
    mutationFn: setCardAsDefault,
  })

  const handleTabsValueChange = (e) => {
    setTabValue(e)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <Tabs orientation="horizontal" defaultValue="billing" className="w-full">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg mb-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gradient-to-r from-slate-50/80 to-blue-50/50 rounded-xl p-1 border border-slate-200/30">
            <TabsTrigger
              value="billing"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200/50 rounded-lg font-medium transition-all duration-200"
            >
              💳 Billing
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              onClick={() => setFetchInvoices(true)}
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200/50 rounded-lg font-medium transition-all duration-200"
            >
              📄 Invoices
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="billing" className="space-y-6">
          <div className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full shadow-sm">
                  <span className="text-xl">💳</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                  Current Subscription
                </h1>
              </div>

              <div className="bg-gradient-to-r from-blue-50/50 to-slate-50/50 rounded-xl p-4 border border-blue-200/30 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{subscription?.name} Plan</h2>
                      <Badge
                        className={`border border-blue-200/50 shadow-sm ${subscription?.status !== "active" ? "bg-red-500 text-white" : "bg-gradient-to-r from-blue-100 to-slate-100 text-blue-700"}`}
                      >
                        {getSubscriptionStatus(subscription?.status)}
                      </Badge>
                    </div>
                    <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                      {subscription?.price} per month
                    </p>
                    <p className="text-slate-600 text-sm sm:text-base">
                      <span
                        className={`font-semibold ${getSubscriptionStatus(subscription?.status) === "Expired" ? "line-through text-red-500" : ""}`}
                      >
                        Remaining Courses: {remainingCourses}/{subscription?.courseLimit}
                      </span>
                    </p>
                    {getSubscriptionStatus(subscription?.status) !== "Expired" && (
                      <p className="text-slate-600 text-sm sm:text-base">
                        <span className="font-bold text-slate-700">Next Payment:</span>{" "}
                        {unixToLocaleStr(subscription?.currentPeriodEnd, "en-US")}
                      </p>
                    )}
                    {getSubscriptionStatus(subscription?.status) === "Expired" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 font-semibold text-sm sm:text-base">
                          Pay the debts to renew the subscription.
                        </p>
                      </div>
                    )}
                  </div>
                  {subscription?.subscriptionId ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: "cancel-subscription-modal",
                            props: { currentPlan: subscription },
                          }),
                        )
                      }
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Cancel Plan
                    </Button>
                  )  : getSubscriptionStatus(subscription?.status) === "Canceled" ? (
  // Case 2: Subscription was cancelled
  <div className="rounded-2xl bg-red-50/80 backdrop-blur-sm shadow-xl border border-red-200/50 p-8 md:p-12 text-center">
    <h1 className="text-3xl md:text-4xl font-bold text-red-600">
      Subscription Cancelled
    </h1>
    <p className="mt-4 text-red-700 text-base md:text-lg leading-relaxed">
      Your subscription has been cancelled. You can renew anytime to continue accessing courses.
    </p>
    <div className="my-2 h-px w-full bg-gradient-to-r from-red-200 via-slate-200 to-red-200" />
    <Button
      onClick={() =>
        navigate({
          to: "/student/resubscription-plans",
          search: { redirect: "/student/settings/billing/" },
        })
      }
      className="w-full md:w-auto rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
    >
      Renew Plan
    </Button>
  </div>
) :
                  
                  
                  (
                    <>
                      {/* Main Card */}
                     <div className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/50 p-8 md:p-12 text-center">
    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
      Subscription Inactive
    </h1>
    <p className="mt-4 text-slate-700 text-base md:text-lg leading-relaxed">
      Your subscription is inactive. Please subscribe to continue and unlock premium features.
    </p>
    <div className="my-2 h-px w-full bg-gradient-to-r from-blue-200 via-slate-200 to-blue-200" />
    <Button
      onClick={() =>
        navigate({
          to: "/student/resubscription-plans",
          search: { redirect: "/student/settings/billing/" },
        })
      }
      className="w-full md:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
    >
      Subscribe Now
    </Button>
  </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {subscription?.subscriptionId && (
            <>
              <div className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-4">Available Plans</h2>

                  <Tabs value={tabValue} onValueChange={handleTabsValueChange} className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-gradient-to-r from-slate-50/80 to-blue-50/50 rounded-xl p-1 border border-slate-200/30 mb-6">
                      {plans.map((p, i) => {
                        return (
                          p !== subscription?.name?.toLowerCase() && (
                            <TabsTrigger
                              value={p}
                              key={i}
                              className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200/50 rounded-lg font-medium transition-all duration-200 capitalize"
                            >
                              {p}
                            </TabsTrigger>
                          )
                        )
                      })}
                    </TabsList>

                    <TabsContent value="bronze">
                      {subscription?.name !== "Bronze" && (
                        <div className="bg-gradient-to-br from-blue-50/30 to-slate-50/30 rounded-xl p-6 border border-blue-200/30">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-4">
                              <h3 className="text-lg sm:text-xl font-bold text-blue-600">$170 per month</h3>
                              <ul className="space-y-2 text-slate-600">
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Can buy 4 courses
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Limited support
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Basic features
                                </li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  openModal({
                                    type: "update-subscription-modal",
                                    props: {
                                      selectedPlan: "Bronze",
                                      currentPlan: subscription,
                                    },
                                  }),
                                )
                              }}
                              className="w-full sm:w-auto bg-gradient-to-r from-white to-blue-50/80 border border-blue-200/50 hover:from-blue-50 hover:to-slate-50 hover:border-blue-300 text-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Update to Bronze Plan
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="silver">
                      {subscription?.name !== "Silver" && (
                        <div className="bg-gradient-to-br from-blue-50/30 to-slate-50/30 rounded-xl p-6 border border-blue-200/30">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-4">
                              <h3 className="text-lg sm:text-xl font-bold text-blue-600">$200 per month</h3>
                              <ul className="space-y-2 text-slate-600">
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Can buy 8 courses
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Priority support
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Advanced features
                                </li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  openModal({
                                    type: "update-subscription-modal",
                                    props: {
                                      selectedPlan: "Silver",
                                      currentPlan: subscription,
                                    },
                                  }),
                                )
                              }}
                              className="w-full sm:w-auto bg-gradient-to-r from-white to-blue-50/80 border border-blue-200/50 hover:from-blue-50 hover:to-slate-50 hover:border-blue-300 text-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Update to Silver Plan
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="gold">
                      {subscription?.name !== "Gold" && (
                        <div className="bg-gradient-to-br from-blue-50/30 to-slate-50/30 rounded-xl p-6 border border-blue-200/30">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-4">
                              <h3 className="text-lg sm:text-xl font-bold text-blue-600">$250 per month</h3>
                              <ul className="space-y-2 text-slate-600">
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Can buy 12 courses
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  24/7 premium support
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  All premium features
                                </li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  openModal({
                                    type: "update-subscription-modal",
                                    props: {
                                      selectedPlan: "Gold",
                                      currentPlan: subscription,
                                    },
                                  }),
                                )
                              }}
                              className="w-full sm:w-auto bg-gradient-to-r from-white to-blue-50/80 border border-blue-200/50 hover:from-blue-50 hover:to-slate-50 hover:border-blue-300 text-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Update to Gold Plan
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="daily">
                      {subscription?.name !== "Daily" && (
                        <div className="bg-gradient-to-br from-blue-50/30 to-slate-50/30 rounded-xl p-6 border border-blue-200/30">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-4">
                              <h3 className="text-lg sm:text-xl font-bold text-blue-600">$10 per month</h3>
                              <ul className="space-y-2 text-slate-600">
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Can buy 1 course
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Basic support
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  Essential features
                                </li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  openModal({
                                    type: "update-subscription-modal",
                                    props: {
                                      selectedPlan: "Daily",
                                      currentPlan: subscription,
                                    },
                                  }),
                                )
                              }}
                              className="w-full sm:w-auto bg-gradient-to-r from-white to-blue-50/80 border border-blue-200/50 hover:from-blue-50 hover:to-slate-50 hover:border-blue-300 text-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Update to Daily Plan
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-6">Payment Methods</h2>

                  <Show>
                    <Show.When isTrue={fetchStatus === "fetching" || paymentMethods.length > 0}>
                      <div className="bg-gradient-to-r from-blue-50/30 to-slate-50/30 rounded-xl p-4 border border-blue-200/30 mb-4">
                        <PaymentMethods
                          paymentMethods={paymentMethods}
                          fetchStatus={fetchStatus}
                          selectPaymentMethod={selectPaymentMethod}
                          selectedPaymentMethod={selectedPaymentMethod}
                          cardDefault={cardDefault}
                          dispatch={dispatch}
                          openModal={openModal}
                          router={router}
                        />
                      </div>
                    </Show.When>
                    <Show.Else>
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">💳</span>
                        </div>
                        <p className="text-slate-600">No payment methods available.</p>
                      </div>
                    </Show.Else>
                  </Show>

                  <Button
                    onClick={() => dispatch(openModal({ type: "add-payment-method" }))}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium w-full sm:w-auto mt-4 sm:mt-0"
                  >
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="group relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/10 via-slate-200/10 to-blue-200/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full shadow-sm">
                  <span className="text-xl">📄</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                  Invoices
                </h1>
              </div>

              <Show>
                <Show.When isTrue={invoices && invoices.length > 0}>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50/50 to-slate-50/50 rounded-xl p-4 border border-blue-200/30">
                      <p className="text-lg font-semibold text-slate-700">Recent 5 invoices</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-blue-200/30 overflow-hidden">
                      {console.log("invoices ==>", invoices)}
                      <DataTable data={invoices} columns={invoicesSchema} pagination={false} />
                    </div>
                    {invoicesData?.has_more && <Button
                      onClick={() => navigate({ to: "/student/invoices",reloadDocument:true })}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium w-auto"
                    >
                      View All Invoices
                    </Button> }
                  </div>
                </Show.When>
                <Show.Else>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-slate-600">No invoices available.</p>
                  </div>
                </Show.Else>
              </Show>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
