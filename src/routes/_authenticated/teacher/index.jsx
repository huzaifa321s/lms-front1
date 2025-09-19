import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import Dashboard from './features/dashboard'

const queryClient = new QueryClient()

export const cardQueryOptions = () =>
  queryOptions({
    queryKey: ['cards', 'courses-by-students', 'monthly-enrolled-students'],
queryFn: async () => {
  try {
    const [cardsRes, coursesRes, monthlyRes] = await Promise.all([
      axios.get('/teacher/dashboard/cards'),
      axios.get('/teacher/dashboard/courses-by-students'),
      axios.get('/teacher/dashboard/monthly-enrolled-students')
    ])

    return {
      card: cardsRes.data.success ? cardsRes.data.data : null,
      dounutData: coursesRes.data.success
        ? coursesRes.data.data
        : { coursesLabels: [], studentsCount: [], borderColor: [], backgroundColor: [] },
      monthlyEnrollments: monthlyRes.data?.data || []
    }
  } catch {
    return {
      card: null,
      dounutData: { coursesLabels: [], studentsCount: [], borderColor: [], backgroundColor: [] },
      monthlyEnrollments: []
    }
  }
}

  })

export const Route = createFileRoute('/_authenticated/teacher/')({
  loader:() => queryClient.ensureQueryData(cardQueryOptions()),
  component: Dashboard,
})
