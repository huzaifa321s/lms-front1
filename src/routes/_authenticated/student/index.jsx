import { createFileRoute } from '@tanstack/react-router'
import Dashboard from './features/dashboard/index'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { getCookie } from '../../../shared/utils/helperFunction'
const queryClient = new QueryClient();
const token = getCookie('studentToken');
export const dashboardQueryOption = () => 
  queryOptions({
    queryKey:['enrolled-courses-get','get-invoices-paid','course-teachers'],
    queryFn:async() =>{
      try{
       let dashboardOverviewResponse = await axios.get(`/student/dashboard/overview?token=${token}`);
       dashboardOverviewResponse = dashboardOverviewResponse.data
       let data = {};
      if(dashboardOverviewResponse.success){
        data.enrolledCourses = dashboardOverviewResponse.data.courses
        data.paymentMethods = dashboardOverviewResponse.data.paymentMethods
        data.totalCharges = dashboardOverviewResponse.data.totalCharges
        data.courseTeachers = dashboardOverviewResponse.data.courseTeachers
        data.spendingByYear = dashboardOverviewResponse.data.spendingByYear
      }
         

      return data
      
      }catch(error){
        console.log('error',error);
        return {enrolledCourses:0,totalCharges:0,paymentMethods:[],courseTeachers:0}

      }
    },
    staleTime:30 * 60 * 1000
  }

)

export const Route = createFileRoute('/_authenticated/student/')({
  loader:({}) => queryClient.ensureQueryData(dashboardQueryOption()),
  component: Dashboard,
})