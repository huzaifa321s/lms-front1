import axios from 'axios'
import { createFileRoute } from '@tanstack/react-router'
import Dashboard from './features/dashboard/index'
import {  queryOptions } from '@tanstack/react-query'


const fetchTopCards = async () => {
  // Simulating a fast API response for the cards
  const res = await axios.get('/admin/dashboard/cards');
  return res.data.success ? res.data.data : [];
};

const fetchTopCourses = async () => {
  const res = await axios.get('/admin/dashboard/top-courses');
  return res.data.success ? res.data.data : [];
};

const fetchTopTeachers = async () => {
  // Simulating a medium API response for the chart data
  await new Promise(resolve => setTimeout(resolve, 1500));
  const res = await axios.get('/admin/dashboard/top-teachers');
  return res.data.success ? res.data.data : [];
};


const fetchEarnings = async () => {
  const res = await axios.get('/admin/dashboard/earnings');
  return res.data.success ? res.data.data : [];
};


// Define query options for each data type
export const cardQueryOptions = () =>
  queryOptions({
    queryKey: ['cards'],
    queryFn: async () => {
      try {
        const response = await fetchTopCards();
        return response
      } catch (error) {
        console.error('Error fetching cards:', error);
        return null
      }
    },
    // The following options are crucial for Suspense
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const topCoursesQueryOptions = () =>
  queryOptions({
    queryKey: ['top-courses'],
    queryFn: fetchTopCourses,
    enabled:true,
    suspense:false,
  });

export const topTeachersQueryOptions = () =>
  queryOptions({
    queryKey: ['top-teachers'],
    queryFn: async () => {
      try {
        const response = await fetchTopTeachers();
        return response
      } catch (error) {
        console.error('Error fetching top teachers:', error);
        return []
      }
    },
    staleTime: 5 * 60 * 200, 
  });


  

  export const EarningsQuery = () =>
  queryOptions({
    queryKey: ['get-earnings'],
    queryFn: async () => {
      try {
        const response = await fetchEarnings();
        return  response 
      } catch (error) {
        console.error('Error fetching top teachers:', error);
        return null
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });


export const Route = createFileRoute('/_authenticated/admin/')({
  component: Dashboard,
})
