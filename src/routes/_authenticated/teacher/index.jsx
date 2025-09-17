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
        let cardsResponse = await axios.get(`/teacher/dashboard/cards`)
        cardsResponse = cardsResponse.data
        let studentCoursesResponse = await axios.get(
          `/teacher/dashboard/courses-by-students`
        )
        studentCoursesResponse = studentCoursesResponse.data
        let monthlyEnrolledStudentsResponse = await axios.get(
          `/teacher/dashboard/monthly-enrolled-students`
        )
        monthlyEnrolledStudentsResponse = monthlyEnrolledStudentsResponse.data;
        return {
          card:cardsResponse.success ? cardsResponse.data : null,dounutData:studentCoursesResponse.success ? studentCoursesResponse.data : {coursesLabels:[],studentsCount:[],borderColor:[],backgroundColor:[]},monthlyEnrollments:monthlyEnrolledStudentsResponse.data
        }

      } catch (error) {
        return {card:null,dounutData:{coursesLabels:[],studentsCount:[],borderColor:[],backgroundColor:[]},monthlyEnrollments:[]}
      }
    },
  })

export const Route = createFileRoute('/_authenticated/teacher/')({
  beforeLoad: async ({ context }) => {
    const { isTeacherLoggedIn } = context.authentication
    if (!isTeacherLoggedIn) {
      throw redirect({ to: '/teacher/login' })
    }
  },
  loader:() => queryClient.ensureQueryData(cardQueryOptions()),
  component: Dashboard,
})
