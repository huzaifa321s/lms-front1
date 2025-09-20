import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getCookie } from '../../../shared/utils/helperFunction'
import Dashboard from './features/dashboard/index'

const queryClient = new QueryClient()
const token = getCookie('studentToken')
export const dashboardQueryOption = () =>
  queryOptions({
    queryKey: ['enrolled-courses-get', 'get-invoices-paid', 'course-teachers'],
    queryFn: async () => {
      try {
        const [overviewRes, teachersRes] = await Promise.all([
          axios.get(`/student/dashboard/overview?token=${token}`),
        ])

        const overview = overviewRes.data
        console.log('overView ==>',overview)
        return {
          enrolledCourses: overview?.data?.courses ?? [],
          paymentMethods: overview?.data?.paymentMethods ?? [],
          totalCharges: overview?.data?.totalCharges ?? 0,
          spendingByYear: overview?.data?.spendingByYear ?? [],
          courseTeachers: overview?.data?.courseTeachers ?? 0,
        }
      } catch (error) {
        console.error('error', error)
        return {
          enrolledCourses: [],
          totalCharges: 0,
          paymentMethods: [],
          courseTeachers: 0,
        }
      }
    },
  })

export const Route = createFileRoute('/_authenticated/student/')({
  loader: ({}) => queryClient.ensureQueryData(dashboardQueryOption()),
  component: Dashboard,
})
